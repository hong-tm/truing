#!/usr/bin/env node
// Interaction probe. See roughness-probe.md. Read-only apart from hover and opening row menus.
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const THRESHOLDS = { overlayLightnessGap: 0.35, overlayChroma: 0.08, stateFillFamilies: 3, stateFillMinTiles: 6, barRowShare: 0.5, barMaxHeight: 8, barMinWidth: 30, sweepTargets: 6 }

function loadChromium() {
  const require = createRequire(resolve('package.json'))
  for (const m of [process.env.PLAYWRIGHT_MODULE, 'playwright', 'playwright-core'].filter(Boolean)) {
    try { return require(m).chromium } catch {}
  }
  console.error('playwright not found: install playwright-core or set PLAYWRIGHT_MODULE'); process.exit(2)
}

// Runs in the page. Paints any CSS colour on a canvas, then returns OKLCH-like lightness and chroma.
const PAGE_HELPERS = `
window.__rp = (() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true })
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  const lch = (css) => {
    if (!css || css === 'transparent') return null
    cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = css; cx.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data
    if (a < 40) return null
    const R = lin(r), G = lin(g), B = lin(b)
    const l = Math.cbrt(0.4122 * R + 0.5363 * G + 0.0514 * B), m = Math.cbrt(0.2119 * R + 0.6807 * G + 0.1074 * B), s = Math.cbrt(0.0883 * R + 0.2817 * G + 0.6300 * B)
    const L = 0.2104 * l + 0.7936 * m - 0.0040 * s, A = 1.9779 * l - 2.4285 * m + 0.4506 * s, Bb = 0.0259 * l + 0.7827 * m - 0.8086 * s
    return { L, C: Math.hypot(A, Bb), H: (Math.atan2(Bb, A) * 180 / Math.PI + 360) % 360 }
  }
  const root = () => document.querySelector('main') || document.body
  const pageColour = () => { for (let e = root(); e; e = e.parentElement) { const c = lch(getComputedStyle(e).backgroundColor); if (c) return c } return { L: 1, C: 0, H: 0 } }
  const overlay = () => document.querySelector('[role=tooltip],[data-radix-popper-content-wrapper],[data-floating-ui-portal]')
  const overlayColour = () => { const o = overlay(); if (!o) return null; for (const e of [o, ...o.querySelectorAll('*')]) { const c = lch(getComputedStyle(e).backgroundColor); if (c) return c } return null }
  // Repeated similar-sized items: keep the largest group of same-size controls.
  const targets = () => {
    const els = [...root().querySelectorAll('button,[role=button],a,td,[tabindex],[data-state]')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 40 && b.width < 240 && b.height > 30 && b.height < 180 && b.top >= 0 && b.bottom <= innerHeight })
    const groups = {}
    for (const e of els) { const b = e.getBoundingClientRect(); const k = Math.round(b.width / 16) + 'x' + Math.round(b.height / 16); (groups[k] ||= []).push(e) }
    return Object.values(groups).sort((a, b) => b.length - a.length)[0] || []
  }
  return { lch, pageColour, overlay, overlayColour, targets, root }
})()`

const findings = []
const add = (page, check, detail) => findings.push({ page, check, detail })

async function probe(p, page, darkClass) {
  await p.evaluate((d) => { document.documentElement.classList.remove('light'); document.documentElement.classList.add(d) }, darkClass)
  await p.waitForTimeout(250)
  await p.mouse.move(2, 2); await p.waitForTimeout(150)
  const idle = await p.evaluate(() => __rp.root().innerText)
  const pts = await p.evaluate((n) => __rp.targets().slice(0, n).map((e) => { const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } }), THRESHOLDS.sweepTargets)
  const out = { sweep: 'not measured', targets: pts.length }
  if (pts.length >= 3) {
    await p.mouse.move(pts[0].x, pts[0].y); await p.waitForTimeout(450)
    const first = await p.evaluate(() => { const c = __rp.overlayColour(); return { c, page: __rp.pageColour() } })
    if (first.c) {
      if (first.c.C <= THRESHOLDS.overlayChroma && first.page.L < 0.45 && first.c.L - first.page.L > THRESHOLDS.overlayLightnessGap) add(page, 'overlay-theme', `overlay L=${first.c.L.toFixed(2)} on dark page L=${first.page.L.toFixed(2)}`)
      if (first.c.C > THRESHOLDS.overlayChroma) add(page, 'overlay-fill', `overlay chroma ${first.c.C.toFixed(2)}`)
    }
    await p.evaluate(() => { window.__t = []; window.__stop = false; const f = () => { window.__t.push(__rp.root().innerText + '§' + (__rp.overlay()?.innerText || '')); if (!window.__stop) requestAnimationFrame(f) }; requestAnimationFrame(f) })
    for (const q of pts.slice(1)) { await p.mouse.move(q.x, q.y, { steps: 14 }); await p.waitForTimeout(300) }
    const seq = await p.evaluate(() => { window.__stop = true; const o = []; for (const k of window.__t) if (o[o.length - 1] !== k) o.push(k); return o })
    const idleKey = idle + '§'
    const distinct = new Set(seq).size
    const reverts = seq.slice(1, -1).filter((k) => k === idleKey).length
    // Content that changes per target but passes through a repeated in-between state also flashes.
    const passes = seq.length - distinct
    out.sweep = { states: seq.length, distinct, reverts, targets: pts.length }
    if (distinct > 2 && (reverts >= 2 || passes >= pts.length - 2)) add(page, 'hover-idle-flash', `${seq.length} text states across ${pts.length} targets; ${passes} repeat an earlier state`)
  }
  await p.mouse.move(2, 2)
  const measureFills = () => p.evaluate(({ chroma }) => {
    const groups = {}
    for (const e of __rp.targets()) { const c = __rp.lch(getComputedStyle(e).backgroundColor); if (c && c.C > chroma / 2) { const f = Math.round(c.H / 45); (groups[f] ||= 0); groups[f]++ } }
    return { families: Object.keys(groups).length, tiles: Object.values(groups).reduce((a, b) => a + b, 0) }
  }, { chroma: THRESHOLDS.overlayChroma })
  // Tints that read as colour in light mode can fall below the bar in dark mode: keep the worse theme.
  const darkFills = await measureFills()
  await p.evaluate((d) => document.documentElement.classList.remove(d), darkClass); await p.waitForTimeout(250)
  const lightFills = await measureFills()
  await p.evaluate((d) => document.documentElement.classList.add(d), darkClass)
  const fills = lightFills.families > darkFills.families ? lightFills : darkFills
  out.fills = fills
  if (fills.tiles >= THRESHOLDS.stateFillMinTiles && fills.families >= THRESHOLDS.stateFillFamilies) add(page, 'state-fills', `${fills.families} colour families across ${fills.tiles} tiles by default`)
  const rows = await p.evaluate((T) => {
    const trs = [...document.querySelectorAll('tbody tr,[role=row]')]
    let bars = 0
    for (const r of trs) if ([...r.querySelectorAll('*')].some((e) => { const q = e.getBoundingClientRect(); if (q.height > T.barMaxHeight || q.height < 1 || q.width < T.barMinWidth) return false; const c = __rp.lch(getComputedStyle(e).backgroundColor); return c && c.C > 0.05 })) bars++
    const tr = trs.find((r) => r.querySelector('button,a'))
    const ctl = tr ? [...tr.querySelectorAll('button,a')].filter((e) => e.getBoundingClientRect().width > 0).map((e) => (e.innerText || e.getAttribute('aria-label') || '').trim()) : []
    return { n: trs.length, bars, ctl }
  }, THRESHOLDS)
  out.rows = rows
  if (rows.n >= 4 && rows.bars / rows.n >= THRESHOLDS.barRowShare) add(page, 'row-redundant-mark', `${rows.bars}/${rows.n} rows carry a thin coloured bar; check it adds something the text does not`)
  const menuBtn = p.locator('tbody tr button[aria-haspopup=menu],tbody tr button[aria-label*="ction" i]').first()
  if (await menuBtn.count()) {
    await menuBtn.click().catch(() => {}); await p.waitForTimeout(250)
    const items = await p.evaluate(() => [...document.querySelectorAll('[role=menuitem]')].map((e) => e.innerText.trim()))
    out.menu = items
    const stem = (s) => s.toLowerCase().replace(/[^a-z一-鿿 ]/g, '').split(' ').filter((w) => w.length > 3).map((w) => w.slice(0, 5))
    const visible = rows.ctl.flatMap(stem)
    if (items.length === 1) add(page, 'row-duplicate-action', `menu has one item: ${items[0]}`)
    else for (const it of items) if (stem(it).some((w) => visible.includes(w))) add(page, 'row-duplicate-action', `menu item repeats a visible action: ${it}`)
    await p.keyboard.press('Escape')
  }
  return out
}

async function main() {
  const file = process.argv[2]
  if (!file) { console.error('usage: roughness-probe.mjs <config.json>'); process.exit(2) }
  const cfg = JSON.parse(readFileSync(file, 'utf8'))
  const br = await loadChromium().launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox'] })
  const ctx = await br.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' })
  if (cfg.cookies) await ctx.addCookies(cfg.cookies.map((c) => ({ ...c, url: cfg.base })))
  const p = await ctx.newPage()
  await p.addInitScript(PAGE_HELPERS)
  const res = {}; let measured = 0
  for (const pg of cfg.pages) {
    const r = await p.goto(new URL(pg.url, cfg.base).href, { waitUntil: 'networkidle' }).catch(() => null)
    if (!r || !r.ok()) { res[pg.name] = 'failed to load'; continue }
    await p.waitForTimeout(cfg.waitMs ?? 700)
    res[pg.name] = await probe(p, pg.name, cfg.darkClass || 'dark'); measured++
  }
  await br.close()
  console.log(JSON.stringify({ findings, pages: res }, null, 1))
  process.exit(measured === 0 ? 2 : findings.length ? 1 : 0)
}
main().catch((e) => { console.error(e); process.exit(2) })
