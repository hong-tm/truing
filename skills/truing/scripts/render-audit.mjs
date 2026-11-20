#!/usr/bin/env node
// render-audit.mjs — measure the rendered surface, not the source.
//
// craft-audit.mjs reads source and can only produce leads. This script opens
// each page in Chromium and measures what a reader actually sees: the left
// rail, the type sizes in use, numeric column alignment, hit-target sizes,
// silent truncation, horizontal overflow, row-height tiers, the focal map of
// the first viewport and the share of colour on screen. Each finding names the
// rule it tests (R-VIS-xxx in references/visual-craft.md).
//
// Usage: node scripts/render-audit.mjs <config.json> [--label name]
// Config:
//   { "base": "http://127.0.0.1:5173",
//     "out": "./render-audit",            // screenshots, focal maps, report.json
//     "viewports": [1440, 390],           // widths; height is 900 / 844
//     "themes": ["light"],                // "light" | "dark" (prefers-color-scheme)
//     "cookies": [{"name":"x","value":"y"}],
//     "waitMs": 1000,
//     "hide": ["#dev-toolbar"],           // harness overlays to remove before measuring
//     "pages": [{ "name": "users", "url": "/users", "setup": ["/login-as/admin"] }] }
// Optional config: "themeMode": "class" sets html.dark / html.light after load, for
// class-based themes that ignore prefers-color-scheme. "expectAsset": "index-abc.css"
// fails the run when the page does not load the build you meant to measure.
// "fallbackText": "Something went wrong" (a regex, also per page) marks a render invalid when the
// app's error fallback shows; set it for production builds, where React logs no boundary message. Per page:
// "allowVoid": true for a page that is sparse on purpose, "allowRedirect": true,
// "shape": "form" for a form or settings page (no focal block expected),
// "focus": "<css selector>" for the element first attention should land on.
// Playwright: resolves `playwright` or `playwright-core`; set PLAYWRIGHT_MODULE
// PLAYWRIGHT_MODULE must be a file path or package name here (ESM import): a global install needs .../playwright/index.js, not its directory.
// to an absolute module path and CHROME_PATH to a Chromium binary if needed.
// Exit: 0 when clean, 1 when any finding remains (report it as NOT CLEAN, never as a pass),
// 2 on bad input, browser failure, or a page that could not be measured (rule "AUDIT":
// 4xx/5xx, redirected away, blank, a crash whose error fallback took the page (dev-build
// React boundary log with a near-empty <main>, or the configured fallbackText),
// wrong build, or a theme that did not change).
// Clean means the measured hygiene passed. It says nothing about composition: open the
// contact sheets it writes (contact-<theme>-<width>.png) and judge R-VIS-036/040/044 by eye.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

// Rule-card thresholds, one source. The references/visual-craft cards and
// scripts/render-audit.md quote these numbers; change a card together with its
// line here, never one without the other.
const THRESHOLDS = {
  typeRatioMax: 1.5,       // R-VIS-014 upper bound (aim 1.3-1.5x, largest number vs title)
  typeSizesMax: 6,         // R-VIS-017 distinct font sizes on one page
  tinyTextPx: 13,          // R-VIS-017 data and labels read at 13-14px; below is tiny
  tinyTextShareMax: 0.4,   // R-VIS-017 max share of characters under tinyTextPx
  contrastFloor: 4.5,      // R-VIS-015 WCAG AA body text
  contrastFloorLarge: 3,   // R-VIS-015 large text (>= 24px, or >= 18.5px bold)
  cardVoidPx: 64,          // R-VIS-042 blank band inside a card
  viewportVoidPx: 180,     // R-VIS-042 blank band across the first viewport (or 20% of height)
  barWidthMax: 64,         // R-VIS-043 a chart mark is about 48-56px
  focalShareMin: 0.45,     // R-VIS-036 one block holds this share of the first viewport
  hitFloorPx: 24,          // R-VIS-025 WCAG 2.5.8 minimum
  hitFloorTouchPx: 44,     // R-VIS-025 touch widths
  staggerCountMax: 5,       // R-VIS-049 items in a first-arrival stagger group
  staggerBudgetMs: 600,     // R-VIS-049 last delay + duration inside the panel budget (R-VIS-029)
}

const args = process.argv.slice(2)
const cfgPath = args.find((a) => !a.startsWith('--'))
const label = args.includes('--label') ? args[args.indexOf('--label') + 1] : 'run'
if (!cfgPath) {
  console.error('usage: render-audit.mjs <config.json> [--label name]')
  process.exit(2)
}
let cfg
try {
  cfg = JSON.parse(readFileSync(cfgPath, 'utf8'))
} catch (e) {
  console.error(`cannot read config: ${e.message}`)
  process.exit(2)
}
if (typeof cfg.base !== 'string' || !Array.isArray(cfg.pages) || !cfg.pages.length || cfg.pages.some((p) => !p.name || !p.url)) {
  console.error('config needs "base" (string) and "pages" (non-empty list of {name, url})')
  process.exit(2)
}
for (const re of [cfg.fallbackText, ...cfg.pages.map((p) => p.fallbackText)].filter((x) => x != null)) {
  try { new RegExp(re) } catch (e) { console.error(`bad "fallbackText" regex ${JSON.stringify(re)}: ${e.message}`); process.exit(2) }
}
const out = resolve(cfg.out ?? './render-audit', label)
mkdirSync(out, { recursive: true })

async function loadChromium() {
  const tries = [process.env.PLAYWRIGHT_MODULE, 'playwright', 'playwright-core'].filter(Boolean)
  for (const t of tries) {
    try {
      const m = await import(t)
      return (m.default ?? m).chromium
    } catch {}
  }
  console.error('playwright not found: install playwright-core or set PLAYWRIGHT_MODULE')
  process.exit(2)
}

// ---- in-page DOM measurement ------------------------------------------------
function measureDom([T, signatureVar]) {
  const vis = (el) => {
    const s = getComputedStyle(el)
    if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) === 0) return false
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return false
    // sr-only: 1px clipped boxes
    if (r.width <= 1.5 && r.height <= 1.5) return false
    if (s.clipPath && s.clipPath.includes('inset(50%')) return false
    return true
  }
  const textRect = (el) => {
    const range = document.createRange()
    range.selectNodeContents(el)
    const rects = [...range.getClientRects()].filter((r) => r.width > 0)
    if (!rects.length) return null
    return {
      left: Math.min(...rects.map((r) => r.left)),
      right: Math.max(...rects.map((r) => r.right)),
    }
  }
  const root = document.querySelector('main') ?? document.body
  const vw = innerWidth
  const res = { findings: [], facts: {} }
  const add = (rule, severity, msg, box) => res.findings.push({ rule, severity, msg, box })
  const boxOf = (el) => {
    const r = el.getBoundingClientRect()
    return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) }
  }

  // Overflow (R-VIS-023 / R-VIS-012): the page itself never scrolls sideways.
  const sw = document.documentElement.scrollWidth
  res.facts.scrollWidth = sw
  if (sw > vw + 1) {
    const wide = [...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > vw + 1 && vis(el))
    const culprit = wide.find((el) => ![...el.children].some((k) => wide.includes(k))) ?? wide[0]
    add('R-VIS-023', 'high', `page scrolls sideways: ${sw}px in a ${vw}px viewport; ends at <${culprit?.tagName.toLowerCase()} class="${String(culprit?.className).slice(0, 60)}">`, culprit ? boxOf(culprit) : undefined)
  }

  // Icon-only control with no name (R-VIS-009): nobody can tell what it does.
  for (const el of root.querySelectorAll('button, a, [role=button]')) {
    if (!vis(el) || /[\p{L}\p{N}]/u.test(el.textContent)) continue
    if (!el.querySelector('svg, img') && !el.textContent.trim()) continue
    if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.title || el.querySelector('img[alt]:not([alt=""]), svg title')) continue
    add('R-VIS-009', 'medium', 'icon-only control has no accessible name or tooltip', boxOf(el))
    break
  }

  // Collision (R-VIS-039): a control's icon drawn over its own label.
  for (const el of root.querySelectorAll('button, a, [role=button]')) {
    const icon = el.querySelector('svg')
    if (!icon || !vis(el) || !vis(icon)) continue
    const range = document.createRange()
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const ir = icon.getBoundingClientRect()
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim() || !vis(n.parentElement)) continue // an sr-only label cannot collide
      range.selectNodeContents(n)
      const hit = [...range.getClientRects()].some((r) => r.width > 0 && r.left < ir.right - 1 && r.right > ir.left + 1 && r.top < ir.bottom - 1 && r.bottom > ir.top + 1)
      if (hit) { add('R-VIS-039', 'high', `icon overlaps its label in "${el.textContent.trim().slice(0, 40)}"`, boxOf(el)); break }
    }
  }

  // Stretched void (R-VIS-042): a blank band inside a card.
  const framed = (el) => {
    const c = getComputedStyle(el)
    const painted = c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== getComputedStyle(el.parentElement ?? el).backgroundColor
    return el.dataset.slot === 'card' || parseFloat(c.borderTopWidth) > 0 && parseFloat(c.borderLeftWidth) > 0 || (painted && parseFloat(c.borderTopLeftRadius) > 0)
  }
  for (const card of root.querySelectorAll('[data-slot=card], section, article, aside, div')) {
    if (!vis(card) || !framed(card) || card.getBoundingClientRect().height < 120) continue
    const inks = [...card.querySelectorAll('svg, img, canvas, button, a, input, [data-slot=skeleton]')].filter(vis).map((el) => el.getBoundingClientRect())
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT)
    const range = document.createRange()
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim() || !vis(n.parentElement)) continue
      range.selectNodeContents(n)
      inks.push(...[...range.getClientRects()].filter((r) => r.width > 0))
    }
    if (inks.length <= 1 && card.dataset.slot !== 'card') continue // one label on a drawn shape, not a stretched card
    const box = card.getBoundingClientRect()
    let edge = box.top
    let gap = 0
    for (const r of inks.sort((a, b) => a.top - b.top)) { gap = Math.max(gap, r.top - edge); edge = Math.max(edge, r.bottom) }
    gap = Math.max(gap, box.bottom - edge)
    if (gap > T.cardVoidPx) add('R-VIS-042', 'medium', `${Math.round(gap)}px blank band inside the card "${card.textContent.trim().slice(0, 30)}"`, boxOf(card))
  }

  // Rail (R-VIS-011): breadcrumb, h1 and first content block share one x.
  const h1 = [...document.querySelectorAll('h1')].find(vis)
  // Breadcrumb by role, or by shape: short path text directly above the title.
  const pathLike = (el) => el && vis(el) && el.textContent.trim().length < 90 && /\S\s*[/›»>]\s*\S/.test(el.textContent)
  const crumb = [...document.querySelectorAll('nav[aria-label*="readcrumb" i] li, [data-slot=breadcrumb-item]')].find(vis) ?? (pathLike(h1?.previousElementSibling) ? h1.previousElementSibling : pathLike(h1?.parentElement?.previousElementSibling) ? h1.parentElement.previousElementSibling : null)
  const rail = {}
  if (crumb) rail.breadcrumb = Math.round(textRect(crumb)?.left ?? crumb.getBoundingClientRect().left)
  if (h1) rail.h1 = Math.round(textRect(h1)?.left ?? h1.getBoundingClientRect().left)
  if (h1) {
    const all = [...root.querySelectorAll('*')]
    const after = all.filter((el) => h1.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING && !h1.contains(el))
    const block = after.find((el) => {
      if (!vis(el) || el.closest('blockquote, figure, aside')) return false // one deliberate inset is not a broken rail
      const s = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      const framed = parseFloat(s.borderTopWidth) > 0 || parseFloat(s.borderLeftWidth) > 0 || (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent')
      return framed && r.width > root.getBoundingClientRect().width * 0.6
    })
    if (block) rail.content = Math.round(block.getBoundingClientRect().left)
  }
  res.facts.rail = rail
  // A control sits beside what it controls (R-VIS-011): the sidebar toggle near the sidebar.
  const bar = [...document.querySelectorAll('aside, nav[aria-label*="side" i], [data-slot=sidebar], [class*="sidebar" i]')].find((e) => vis(e) && e.getBoundingClientRect().width < vw * 0.4 && e.getBoundingClientRect().height > innerHeight * 0.5)
  const tog = [...document.querySelectorAll('button, [role=button]')].find((b) => vis(b) && !bar?.contains(b) && /(sidebar|side nav|collapse nav)/i.test((b.getAttribute('aria-label') || '') + ' ' + b.textContent + ' ' + b.title))
  if (bar && tog) {
    const b = bar.getBoundingClientRect()
    const t = tog.getBoundingClientRect()
    const dist = Math.max(t.left - b.right, b.left - t.right)
    if (dist > vw * 0.4) add('R-VIS-011', 'low', `the sidebar toggle sits ${Math.round(dist)}px from the sidebar it controls`, boxOf(tog))
  }
  // Phone app bar (R-VIS-011 exception): the toggle leads the bar from inside a gutter
  // too narrow to hold it, and its icon stands on the rail; the crumb after it is the
  // bar's title. Only then is the icon compared instead of the crumb, so the exception
  // can turn a finding into a pass but never make one. facts.rail keeps the crumb.
  const cmp = { ...rail }
  let appBarNote = ''
  if (crumb && h1 && tog) {
    const t = tog.getBoundingClientRect()
    const c = crumb.getBoundingClientRect()
    const h1x = textRect(h1)?.left ?? h1.getBoundingClientRect().left
    const gutter = h1x - root.getBoundingClientRect().left
    const icon = ([...tog.querySelectorAll('svg')].find(vis) ?? tog).getBoundingClientRect().left
    const sameRow = Math.abs((t.top + t.bottom) / 2 - (c.top + c.bottom) / 2) < c.height
    if (sameRow && t.right <= c.left + 1 && t.left < h1x && gutter < t.width) {
      res.facts.appBar = Math.round(icon)
      if (Math.abs(icon - h1x) <= 2) cmp.breadcrumb = rail.h1
      else if (Math.abs(rail.breadcrumb - rail.h1) > 2) appBarNote = ` (the app-bar toggle icon at ${Math.round(icon)} is off the rail)`
    }
  }
  const xs = Object.values(cmp)
  if (xs.length >= 2 && Math.max(...xs) - Math.min(...xs) > 2)
    add('R-VIS-011', 'medium', `left edges disagree: ${JSON.stringify(cmp)}${appBarNote}`, h1 ? boxOf(h1) : undefined)

  // Type sizes (R-VIS-017 ≤6; R-VIS-014 title vs largest number).
  const sizes = new Map()
  const chars = new Map()
  let maxNum = 0
  // Contrast (R-VIS-015): composed through ancestors in the browser's own colour
  // parser, so oklch() and lab() tokens measure the same as hex.
  const cv = document.createElement('canvas')
  cv.width = cv.height = 1
  const cc = cv.getContext('2d', { willReadFrequently: true })
  const rgba = (css) => {
    cc.clearRect(0, 0, 1, 1)
    cc.fillStyle = '#000'
    cc.fillStyle = css
    cc.fillRect(0, 0, 1, 1)
    const d = cc.getImageData(0, 0, 1, 1).data
    return [d[0], d[1], d[2], d[3] / 255]
  }
  const over = (f, b) => [0, 1, 2].map((i) => f[i] * f[3] + b[i] * (1 - f[3])).concat(1)
  const bgOf = (el) => {
    const layers = []
    let opacity = 1
    for (let e = el; e; e = e.parentElement) {
      const c = getComputedStyle(e)
      opacity *= Number(c.opacity)
      if (c.backgroundImage !== 'none') return null // gradient or image: not computable here
      const col = rgba(c.backgroundColor)
      if (col[3] > 0) layers.push(col)
      if (col[3] >= 0.99) break
    }
    let b = [255, 255, 255, 1]
    for (const l of layers.reverse()) b = over(l, b)
    return { b, opacity }
  }
  const lum = (c) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
  }
  const contrast = { checked: 0, skipped: 0, low: [] }
  const seenEl = new Set()
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const t = walker.currentNode
    if (!t.textContent.trim()) continue
    const el = t.parentElement
    if (!el || !vis(el) || el.closest('svg, [aria-hidden="true"]')) continue
    const fs = Math.round(parseFloat(getComputedStyle(el).fontSize) * 2) / 2
    sizes.set(fs, (sizes.get(fs) ?? 0) + 1)
    chars.set(fs, (chars.get(fs) ?? 0) + t.textContent.trim().length)
    if (!seenEl.has(el) && !el.closest('[disabled], [aria-disabled="true"]')) {
      seenEl.add(el)
      const st = getComputedStyle(el)
      const under = bgOf(el)
      if (!under) contrast.skipped++
      else {
        const fg = rgba(st.color)
        fg[3] *= under.opacity
        const fgc = over(fg, under.b)
        const [hi, lo] = [lum(fgc), lum(under.b)].sort((a, b) => b - a)
        const ratio = (hi + 0.05) / (lo + 0.05)
        const large = fs >= 24 || (fs >= 18.5 && Number(st.fontWeight) >= 700)
        contrast.checked++
        if (ratio < (large ? T.contrastFloorLarge : T.contrastFloor)) contrast.low.push({ ratio: +ratio.toFixed(2), text: t.textContent.trim().slice(0, 30), box: boxOf(el) })
      }
    }
    if (/^[\sRM$€£¥%+\-−.,\d]+$/.test(t.textContent.trim()) && /\d/.test(t.textContent)) maxNum = Math.max(maxNum, fs)
  }
  // Label treatment (R-VIS-015): a page of tracked capitals reads as a template.
  const capsLabels = [...seenEl].filter((el) => getComputedStyle(el).textTransform === 'uppercase').length
  res.facts.uppercaseLabels = capsLabels
  if (capsLabels >= 5) add('R-VIS-015', 'low', `${capsLabels} uppercase structural labels on one page; sentence case is the default`)
  res.facts.contrast = { checked: contrast.checked, skipped: contrast.skipped, low: contrast.low.length }
  if (contrast.low.length) {
    const worst = [...contrast.low].sort((a, b) => a.ratio - b.ratio)[0]
    add('R-VIS-015', worst.ratio < 3 ? 'high' : 'medium', `${contrast.low.length} text runs under the contrast floor; worst ${worst.ratio}:1 on “${worst.text}”`, worst.box)
  }
  res.facts.typeSizes = Object.fromEntries([...sizes].sort((a, b) => a[0] - b[0]))
  if (sizes.size > T.typeSizesMax) add('R-VIS-017', 'medium', `${sizes.size} type sizes in use (target ≤ ${T.typeSizesMax}): ${[...sizes.keys()].sort((a, b) => a - b).join(', ')}px`)
  // Tiny-text share (R-VIS-017b): data and labels read at 13-14px; a page
  // where most text is smaller cannot ship silently.
  {
    // Weighted by characters read, not text nodes: forty axis ticks are not forty sentences.
    const total = [...chars.values()].reduce((a, b) => a + b, 0)
    const tiny = [...chars].filter(([fs]) => fs < T.tinyTextPx).reduce((a, [, n]) => a + n, 0)
    res.facts.tinyTextShare = total ? Math.round((tiny / total) * 100) / 100 : 0
    if (total >= 200 && tiny / total > T.tinyTextShareMax)
      add('R-VIS-017', 'medium', `${Math.round((tiny / total) * 100)}% of characters are under ${T.tinyTextPx}px (target ≤ ${Math.round(T.tinyTextShareMax * 100)}%; data and labels read at ${T.tinyTextPx}-${T.tinyTextPx + 1}px)`)
  }
  if (h1 && maxNum) {
    const h = parseFloat(getComputedStyle(h1).fontSize)
    res.facts.titleVsNumber = { h1: h, largestNumber: maxNum }
    if (maxNum > h * T.typeRatioMax) add('R-VIS-014', 'low', `largest number ${maxNum}px is ${(maxNum / h).toFixed(2)}× the ${h}px title (aim 1.3-${T.typeRatioMax}×; this check fails above ${T.typeRatioMax}×)`)
  }

  // Numeric columns (R-VIS-026) and header agreement.
  const NUM = /^[\s(]*(RM|\$|€|£)?\s*[-−+]?[\d,]+(\.\d+)?\s*(%|m²|RM)?[\s)]*$/i
  for (const table of [...root.querySelectorAll('table')].filter(vis)) {
    const rows = [...table.querySelectorAll('tbody tr')].filter(vis)
    const heights = new Set(rows.map((r) => { const td = r.querySelector('td'); return td ? Math.round(parseFloat(getComputedStyle(td).paddingTop)) : 0 }))
    const cardMode = !table.querySelector('thead') || !vis(table.querySelector('thead'))
    if (!cardMode && heights.size > 2 && rows.length > 3) add('R-VIS-006', 'low', `${heights.size} row-padding tiers in one table: ${[...heights].join(', ')}px`, boxOf(table))
    const cols = new Map()
    for (const tr of rows) {
      ;[...tr.children].forEach((td, i) => {
        const txt = td.textContent.trim()
        if (!txt || !vis(td)) return
        const c = cols.get(i) ?? { num: 0, all: 0, left: 0, cells: [] }
        c.all++
        if (NUM.test(txt)) {
          c.num++
          const tr2 = textRect(td)
          const r = td.getBoundingClientRect()
          const s = getComputedStyle(td)
          const inner = r.width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)
          if (tr2 && inner - (tr2.right - tr2.left) > 8) {
            const gapR = r.right - parseFloat(s.paddingRight) - tr2.right
            if (gapR > 3) c.left++
          }
          c.cells.push(td)
        }
        cols.set(i, c)
      })
    }
    // R-VIS-039: cells in one row follow one vertical model. Either every
    // first line sits on one line (top-aligned) or every content block shares
    // one centre (middle-aligned). A row that mixes the two reads ragged.
    let worst = null
    for (const tr of rows) {
      const first = []
      const mid = []
      for (const td of tr.children) {
        if (!vis(td)) continue
        const w = document.createTreeWalker(td, NodeFilter.SHOW_TEXT)
        let top = null
        let lo = Infinity
        let hi = -Infinity
        while (w.nextNode()) {
          if (!w.currentNode.textContent.trim() || !vis(w.currentNode.parentElement)) continue
          const rg = document.createRange()
          rg.selectNodeContents(w.currentNode)
          for (const rc of rg.getClientRects()) {
            if (top === null) top = rc.top + rc.height / 2
            lo = Math.min(lo, rc.top)
            hi = Math.max(hi, rc.bottom)
          }
        }
        for (const m of td.querySelectorAll('img, svg, [data-slot=avatar], [data-slot=badge]')) {
          if (!vis(m)) continue
          const rc = m.getBoundingClientRect()
          lo = Math.min(lo, rc.top)
          hi = Math.max(hi, rc.bottom)
        }
        if (top === null) continue
        first.push(top)
        mid.push((lo + hi) / 2)
      }
      if (first.length < 2) continue
      const spread = (a) => Math.max(...a) - Math.min(...a)
      const s = Math.min(spread(first), spread(mid))
      if (!worst || s > worst.spread) worst = { spread: s, tr }
    }
    if (!cardMode && worst && worst.spread > 3)
      add('R-VIS-039', 'medium', `a row mixes top and middle alignment: cells miss a shared line by ${worst.spread.toFixed(1)}px`, boxOf(worst.tr))
    const ths = [...table.querySelectorAll('thead th')]
    // R-VIS-023: rows became cards, so the header row labels nothing.
    const th0 = table.querySelector('thead')
    if (th0 && vis(th0) && rows[0] && getComputedStyle(rows[0]).display !== 'table-row')
      add('R-VIS-023', 'medium', 'table rows render as cards while the header row still shows', boxOf(th0))
    // R-VIS-009: a column of solid buttons is N primary calls to action.
    const solidRows = rows.filter((tr) => [...tr.querySelectorAll('button, a, [role=button]')].some((b) => {
      if (!vis(b)) return false
      const [r, g, bl, al] = rgba(getComputedStyle(b).backgroundColor)
      return al > 0.8 && Math.max(r, g, bl) - Math.min(r, g, bl) > 60
    }))
    if (solidRows.length > 1) add('R-VIS-009', 'medium', `${solidRows.length} rows carry a solid action; one per view is the limit`, boxOf(solidRows[1]))
    // R-VIS-009: one action column, one control width.
    const byCol = new Map()
    for (const tr of rows) [...tr.children].forEach((td, i) => {
      const ctl = [...td.querySelectorAll('button, a[href], [role=button]')].filter(vis)
      if (ctl.length === 1 && td.textContent.trim().length < 30) byCol.set(i, [...(byCol.get(i) ?? []), ctl[0].getBoundingClientRect().width])
    })
    for (const ws of byCol.values())
      if (ws.length >= 3 && ws.length >= rows.length * 0.5 && Math.max(...ws) - Math.min(...ws) > 8 && new Set(ws.map((w) => Math.round(w / 4))).size >= 3) { add('R-VIS-009', 'low', `row actions range from ${Math.round(Math.min(...ws))}px to ${Math.round(Math.max(...ws))}px wide in one column`, boxOf(table)); break }
    // R-VIS-045: a column earns its place.
    if (!cardMode && rows.length >= 4) {
      ths.forEach((th, i) => {
        const name = th.textContent.trim()
        const cells = rows.map((tr) => tr.children[i]).filter(Boolean)
        if (cells.length !== rows.length || !vis(th)) return
        const filled = cells.filter((td) => td.textContent.trim() || td.querySelector('button, a, input, img, svg'))
        const values = new Set(cells.map((td) => td.textContent.trim()))
        if (!filled.length) add('R-VIS-045', 'low', `column “${name || i + 1}” is empty in every row`, boxOf(th))
        else if (values.size === 1 && filled.length === cells.length && !cells[0].querySelector('button, a, input')) add('R-VIS-045', 'low', `column “${name || i + 1}” holds “${[...values][0].slice(0, 24)}” in every row`, boxOf(th))
      })
    }
    for (const [i, c] of cols) {
      if (c.all < 2 || c.num / c.all < 0.6) continue
      const name = ths[i]?.textContent.trim() || `col ${i + 1}`
      // Identifiers (stall no., #, ID, code) are labels, not quantities.
      const plainInts = c.cells.every((td) => /^\s*\d{1,5}\s*$/.test(td.textContent))
      const mono = c.cells.every((td) => /mono|courier|consolas|menlo/i.test(getComputedStyle(td.firstElementChild ?? td).fontFamily))
      // Phone numbers, postcodes and other dialled or keyed codes: a leading 0 or + never starts a quantity.
      // Five digits or more, so signed deltas (+12) and zero-padded counts (01) stay quantities.
      // Whole words: "Account" holds the letters of "count" and is no quantity; "Subtotal" and "Discount" are named so they stay quantities.
      const QTY = /\b(qty|quantit(y|ies)|counts?|(sub)?totals?|discounts?|amounts?|sizes?|days?)\b/i
      const keyed = c.cells.every((td) => /^\s*(\+\d|0\d)[\d\s()-]*\s*$/.test(td.textContent) && td.textContent.replace(/\D/g, '').length >= 5) && !QTY.test(name)
      if (mono || keyed || /(^|\s)(no\.?|#|id|code|ref|phone|tel|mobile|postcode|zip)\s*$/i.test(name) || (plainInts && !QTY.test(name))) continue
      if (c.left / c.num > 0.5) add('R-VIS-026', 'medium', `numeric column “${name}” is not right-aligned`, boxOf(c.cells[0]))
      else if (ths[i] && vis(ths[i])) {
        const hr = textRect(ths[i])
        const r = ths[i].getBoundingClientRect()
        const s = getComputedStyle(ths[i])
        if (hr && r.right - parseFloat(s.paddingRight) - hr.right > 3 && r.width - (hr.right - hr.left) > 16)
          add('R-VIS-026', 'low', `header “${name}” is left while its numbers are right-aligned`, boxOf(ths[i]))
      }
    }
  }

  // Hit targets (R-VIS-025): WCAG 2.5.8 floor 24px; 44px on touch widths.
  const floor = vw < 768 ? T.hitFloorTouchPx : T.hitFloorPx
  const small = []
  // Nothing to hit: a disabled control, or one that lets the pointer pass through.
  // aria-disabled alone is not enough: such a control is often still tapped (to show why it is off).
  // pointer-events: none on the control is overridden by a child that sets it back: the click lands on the child.
  const inert = (el) => el.disabled || !!el.closest('fieldset:disabled, [inert]') ||
    (getComputedStyle(el).pointerEvents === 'none' && ![...el.querySelectorAll('*')].some((k) => vis(k) && getComputedStyle(k).pointerEvents !== 'none'))
  const TARGETS = 'button, a[href], [role=button], [role=checkbox], [role=switch], [role=tab], [role=combobox], input:not([type=hidden]), select'
  for (const el of document.querySelectorAll(TARGETS)) {
    if (!vis(el)) continue
    if (el.tagName === 'A' && el.closest('p, li > p')) continue // inline text links are exempt
    if (inert(el)) continue
    let r = el.getBoundingClientRect()
    if (r.width >= floor && r.height >= floor) continue
    if (r.top < 0 || r.bottom > innerHeight) {
      el.scrollIntoView({ block: 'center', inline: 'nearest' })
      r = el.getBoundingClientRect()
    }
    // Measure the hit area a finger gets, not the drawn box: probe outward
    // from the centre until the point no longer lands on this control. An
    // invisible ::after hit-box (R-VIS-025 action 2) counts; a visual margin does not.
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const reach = (dx, dy) => {
      let d = 0
      for (let k = 1; k <= floor; k++) {
        const hit = document.elementFromPoint(cx + dx * k, cy + dy * k)
        if (!hit || !(el === hit || el.contains(hit))) break
        d = k
      }
      return d
    }
    const w = Math.round(reach(-1, 0) + reach(1, 0) + 1)
    const h = Math.round(reach(0, -1) + reach(0, 1) + 1)
    if (r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) {
      if (r.width < floor || r.height < floor) small.push({ el, r, w: Math.round(r.width), h: Math.round(r.height) })
    } else if (w < floor - 1 || h < floor - 1) small.push({ el, r, w, h })
  }
  scrollTo(0, 0)
  // WCAG 2.5.8 spacing exception: an undersized target passes when a 24px circle
  // on its centre clears every other target and every other undersized target's circle.
  // The 44px touch floor has none.
  if (floor === 24) {
    // Probing scrolled some targets into view: compare every rect in one frame (scrolled to the top).
    for (const s of small) s.r = s.el.getBoundingClientRect()
    const centre = (r) => [r.left + r.width / 2, r.top + r.height / 2]
    const targets = [...document.querySelectorAll(TARGETS)].filter((e) => vis(e) && !inert(e)).map((e) => ({ e, t: e.getBoundingClientRect() }))
    const clear = (s) => {
      const [cx, cy] = centre(s.r)
      return targets.every(({ e, t }) => {
        if (e === s.el) return true
        const dx = Math.max(t.left - cx, 0, cx - t.right)
        const dy = Math.max(t.top - cy, 0, cy - t.bottom)
        return Math.hypot(dx, dy) >= 12
      }) && small.every((o) => {
        if (o === s) return true
        const [ax, ay] = centre(s.r), [bx, by] = centre(o.r)
        return Math.hypot(ax - bx, ay - by) >= 24
      })
    }
    const pass = small.filter(clear)
    for (const s of pass) small.splice(small.indexOf(s), 1)
  }
  res.facts.smallTargets = small.length
  for (const s of small.slice(0, 8)) {
    const name = (s.el.getAttribute('aria-label') || s.el.textContent || s.el.tagName).trim().slice(0, 40)
    // The probe stops at the floor in each direction (2 × floor + 1 in all); a side that hit that cap reads its drawn size.
    const side = (hit, drawn) => (hit < 2 * floor + 1 ? hit : drawn > hit ? Math.round(drawn) : `≥${hit}`)
    add('R-VIS-025', vw < 768 ? 'medium' : 'low', `target “${name}” hit area ${side(s.w, s.r.width)}×${side(s.h, s.r.height)}px (floor ${floor}px)`, boxOf(s.el))
  }
  if (small.length > 8) add('R-VIS-025', 'low', `…and ${small.length - 8} more targets under ${floor}px`)

  // Silent truncation (R-VIS-030): clipped text with no way to read it.
  for (const el of root.querySelectorAll('*')) {
    if (!vis(el) || !el.childNodes.length) continue
    const s = getComputedStyle(el)
    const bareClip = (s.overflowX === 'hidden' || s.overflowX === 'clip') && s.whiteSpace === 'nowrap' && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
    const clipped = (s.textOverflow === 'ellipsis' || s.webkitLineClamp !== 'none' || bareClip) && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)
    if (!clipped) continue
    if (el.title || el.closest('[title],[aria-label],[data-state]') || el.getAttribute('aria-describedby')) continue
    add('R-VIS-030', 'medium', `“${el.textContent.trim().slice(0, 40)}” is cut off with no full value`, boxOf(el))
  }

  // Raw values on screen (R-INF-019): a missing value, unfilled template or mojibake printed as text.
  // Whole body, so a shell greeting counts; code samples and editable text do not.
  const RAW = /\b(?:undefined|NaN|null|NULL)\b|Invalid Date|\[object [A-Z]\w*\]|\{\{\s*[\w.$-]+\s*\}\}|�/g
  // Seen: one of the matched text's boxes survives every clipping ancestor, stays on the page, and no ancestor hides it.
  const seen = (rects, el) => {
    let boxed = el
    while (boxed && getComputedStyle(boxed).display === 'contents') boxed = boxed.parentElement
    // checkVisibility (Chromium 105+) covers hidden, transparent and display:none ancestors; the run checks for it at launch.
    if (!boxed || !boxed.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false
    for (const q of rects) {
      let [l, t, r, b] = [q.left, q.top, q.right, q.bottom]
      if (r <= 0 || b + scrollY <= 0) continue
      for (let a = el; a && a !== document.documentElement && r - l > 1.5; a = a.parentElement) {
        const s = getComputedStyle(a)
        if ((s.clip && s.clip !== 'auto') || (s.clipPath && /inset\((?:50|100)%/.test(s.clipPath))) { r = l; break }
        if (!/hidden|clip/.test(s.overflowX + ' ' + s.overflowY)) continue
        const c = a.getBoundingClientRect()
        ;[l, t, r, b] = [Math.max(l, c.left), Math.max(t, c.top), Math.min(r, c.right), Math.min(b, c.bottom)]
      }
      if (r - l > 1.5 && b - t > 1.5) return true
    }
    return false
  }
  const raw = []
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    const el = n.parentElement
    if (!el || el.closest('code, pre, kbd, samp, script, style, noscript, template, textarea, [contenteditable]')) continue
    // Each match is measured on its own characters, so a visible prefix does not vouch for a clipped suffix.
    for (const m of n.textContent.matchAll(RAW)) {
      const range = document.createRange()
      range.setStart(n, m.index)
      range.setEnd(n, m.index + m[0].length)
      if (seen([...range.getClientRects()], el)) { raw.push({ el, hit: m[0], text: n.textContent }); break }
    }
  }
  // Text fields show their value or placeholder, input buttons their value, a select its option's label: text a person reads too.
  // el.type is the browser's reading of the type attribute, so type="" or a misspelt type counts as text.
  const SHOWS_VALUE = new Set(['text', 'search', 'email', 'url', 'tel', 'number', 'button', 'submit', 'reset'])
  for (const el of document.body.querySelectorAll('input, textarea, select')) {
    if (el.tagName === 'INPUT' && !SHOWS_VALUE.has(el.type)) continue
    const shown = el.tagName === 'SELECT' ? el.selectedOptions[0]?.label ?? '' : el.value || (el.matches(':placeholder-shown') ? el.placeholder : '')
    const hit = shown.match(new RegExp(RAW.source))
    if (hit && seen([el.getBoundingClientRect()], el)) raw.push({ el, hit: hit[0], text: shown })
  }
  for (const { el, hit, text } of raw.slice(0, 5)) add('R-INF-019', 'medium', `raw “${hit}” on screen in “${text.trim().slice(0, 40)}”; unless the page means to show it, fix the binding, formatter, encoding or missing-value fallback`, boxOf(el))
  if (raw.length > 5) add('R-INF-019', 'medium', `…and ${raw.length - 5} more raw values on screen`)

  // Chart scale (R-VIS-043): bars on a shared baseline need a readable scale.
  // A date axis is not a scale: only quantities count.
  const QUANTITY = /^[\sRM$€£¥%+\-−.,\dkKmM]*\d[\sRM$€£¥%+\-−.,\dkKmM]*$/
  const chartFindings = (host, bars, scale) => {
    if (!scale) add('R-VIS-043', 'medium', `chart draws ${bars.length} bars with no numeric scale`, boxOf(host))
    const widest = Math.max(...bars.map((r) => r.width))
    if (widest > T.barWidthMax) add('R-VIS-043', 'low', `chart bars are ${Math.round(widest)}px wide (a mark is about 48-56px)`, boxOf(host))
  }
  for (const svg of root.querySelectorAll('svg')) {
    const sr = svg.getBoundingClientRect()
    if (!vis(svg) || sr.width < 200 || sr.height < 100) continue
    // A mark counts as a bar only if it is visible and shaped like a box. Invisible: no visible fill (none,
    // fully transparent, fill-opacity 0; a <rect> may show by its stroke instead), or an ancestor at
    // opacity 0 / visibility hidden (hover targets).
    // Box: a <rect>, or a <path>/<polygon> whose outline length is within 12% of its box perimeter or
    // whose two bottom corners are filled (pill tops), and whose top is flat: a row a quarter down
    // (25/50/75% of the width) and a row near the top (central 30-70%) lie inside the fill. Arcs,
    // circles, triangles, wavy areas and stepped areas fail one of these.
    const shown = (m) => {
      for (let e = m; e && e !== svg; e = e.parentElement) {
        const st = getComputedStyle(e)
        if (+st.opacity === 0 || st.visibility === 'hidden') return false
      }
      const st = getComputedStyle(m), clear = (c) => c === 'none' || /^rgba\(.*,\s*0\)$/.test(c)
      if (!clear(st.fill) && +st.fillOpacity !== 0) return true
      // An outlined <rect> is still a bar; an outlined path is a line or an icon.
      return m.tagName.toLowerCase() === 'rect' && !clear(st.stroke) && +st.strokeOpacity !== 0 && parseFloat(st.strokeWidth) > 0
    }
    const barLike = (m) => {
      if (!shown(m)) return false
      if (m.tagName.toLowerCase() === 'rect') return true
      const b = m.getBBox(), per = 2 * (b.width + b.height)
      if (!(per > 0)) return false
      const inFill = (fx, fy) => m.isPointInFill(new DOMPoint(b.x + b.width * fx, b.y + b.height * fy))
      const boxy = Math.abs(m.getTotalLength() / per - 1) < 0.12 || (inFill(0.03, 0.97) && inFill(0.97, 0.97))
      return boxy && [0.25, 0.5, 0.75].every((f) => inFill(f, 0.25)) && [0.3, 0.4, 0.5, 0.6, 0.7].every((f) => inFill(f, 0.08))
    }
    const marks = [...svg.querySelectorAll('rect, path, polygon')].filter(barLike).map((m) => m.getBoundingClientRect()).filter((r) => r.width >= 4 && r.height >= 8 && r.width < sr.width * 0.5)
    const byBase = new Map()
    for (const r of marks) { const k = Math.round(r.bottom / 3); byBase.set(k, [...(byBase.get(k) ?? []), r]) }
    const bars = [...byBase.values()].sort((a, b) => b.length - a.length)[0] ?? []
    if (bars.length < 3 || new Set(bars.map((r) => Math.round(r.height))).size < 2) continue
    const scale = [...svg.querySelectorAll('text')].some((t) => QUANTITY.test(t.textContent.trim()))
    chartFindings(svg, bars, scale)
  }
  // The same chart built from plain elements: empty children on one baseline.
  for (const box of root.querySelectorAll('div, ul, ol')) {
    const kids = [...box.children].filter(vis)
    if (kids.length < 3 || kids.some((k) => k.textContent.trim() || k.querySelector('svg, img, input, button'))) continue
    const leaf = (e) => (e.children.length === 1 ? leaf(e.children[0]) : e)
    const rs = kids.map((k) => leaf(k).getBoundingClientRect())
    if (rs.some((r) => r.width < 4 || r.height < 8) || new Set(rs.map((r) => Math.round(r.bottom))).size > 1 || new Set(rs.map((r) => Math.round(r.height))).size < 2) continue
    const near = box.closest('[data-slot=card], figure, section, article') ?? box.parentElement
    const labels = [...near.querySelectorAll('*')].filter((e) => !e.children.length && QUANTITY.test(e.textContent.trim()))
    chartFindings(box, rs, labels.length >= 2)
  }

  // Row-height jumps (R-VIS-030): real-length text with no clamp breaks the list's rhythm.
  for (const parent of root.querySelectorAll('tbody, div, ul, ol, section, article')) {
    const kids = [...parent.children].filter((k) => vis(k) && (k.tagName === 'TR' || (k.className && k.className === parent.lastElementChild.className)))
    if (kids.length < 4) continue
    const hs = kids.map((k) => k.getBoundingClientRect().height).sort((a, b) => a - b)
    const med = hs[hs.length >> 1]
    const longText = kids.some((k) => k.textContent.trim().length > 120)
    const lineCount = (k) => {
      let most = 0
      for (const e of k.querySelectorAll('*')) {
        if (e.children.length || e.textContent.trim().length < 120 || !vis(e)) continue
        const rg = document.createRange()
        rg.selectNodeContents(e)
        most = Math.max(most, new Set([...rg.getClientRects()].map((r) => Math.round(r.top))).size)
      }
      return most
    }
    const wrapped = kids.filter((k) => lineCount(k) >= 3).length
    if (wrapped >= kids.length / 2) {
      add('R-VIS-030', 'low', `${wrapped} of ${kids.length} rows wrap a cell to 3 or more lines; clamp it and keep the full value one interaction away`, boxOf(kids[0]))
      break
    }
    if (longText && med > 0 && hs[hs.length - 1] >= med * 1.6 && hs[hs.length - 1] > 80) {
      add('R-VIS-030', 'low', `row heights jump from ${Math.round(med)}px to ${Math.round(hs[hs.length - 1])}px on long text; clamp it and keep the full value one interaction away`, boxOf(kids[0]))
      break
    }
  }

  // Focal block (R-VIS-036): one block holds at least 45% of the first viewport.
  {
    const vh = innerHeight
    const mainW = root.getBoundingClientRect().width
    const share = (el) => {
      const r = el.getBoundingClientRect()
      return (Math.min(r.bottom, vh) - Math.max(r.top, 0)) / vh
    }
    const candidates = [...root.querySelectorAll('table, figure, section, article, svg, canvas, img, form, dl, ul, ol, [data-slot=card], [role=region], [role=grid], [role=table]')]
    for (const el of root.querySelectorAll('div')) {
      const s = getComputedStyle(el)
      if ((s.display === 'grid' || s.display === 'flex') && el.children.length >= 6) candidates.push(el)
    }
    let best = { share: 0 }
    const blocks = []
    for (const el of candidates) {
      // A wrapper around the title and other blocks is not a block; a hero with its own h1 is.
      if (!vis(el) || el.getBoundingClientRect().width < mainW * 0.3 || (el.querySelector('h1') && el.querySelector('table, section, article, form, canvas, [data-slot=card]'))) continue
      const v = share(el)
      blocks.push({ el, v })
      if (v > best.share) best = { share: v, what: el.tagName.toLowerCase() }
    }
    // Two equal heroes side by side are not a focal moment.
    const big = blocks.filter((b) => b.v >= 0.3)
    for (const a of big) for (const b of big) {
      if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue
      const ra = a.el.getBoundingClientRect()
      const rb = b.el.getBoundingClientRect()
      if (ra.left < rb.left && ra.right <= rb.left + 1 && Math.abs(ra.top - rb.top) < 8 && Math.abs(ra.height - rb.height) < 16 && Math.abs(ra.width - rb.width) < mainW * 0.08 && !res.findings.some((f) => f.msg.startsWith('two equal')))
        add('R-VIS-036', 'medium', `two equal blocks side by side (${Math.round(ra.width)}px and ${Math.round(rb.width)}px) claim the first viewport; one must lead`, boxOf(a.el))
    }
    const form = [...root.querySelectorAll('form')].find((f) => vis(f) && share(f) >= 0.4)
    res.facts.focalBlock = { share: +best.share.toFixed(2), what: best.what ?? null, form: !!form }
  }

  // Facts for the colour/focal pass.
  const bg = getComputedStyle(document.body).backgroundColor
  res.facts.bodyBackground = bg
  const probe = document.createElement('span')
  probe.style.color = `var(${signatureVar || '--primary'})`
  const tokenName = signatureVar || '--primary'
  res.facts.signatureDefined = !!(getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim() || getComputedStyle(document.body).getPropertyValue(tokenName).trim())
  // A sentinel parent shows when var() did not yield a colour (the probe then inherits it).
  const SENTINEL = 'rgb(1, 2, 3)'
  const holder = document.createElement('span')
  holder.style.color = SENTINEL
  holder.append(probe)
  document.body.append(holder)
  // A bare-channel token (shadcn / Tailwind v3: "24 95% 53%") is no colour on its own: read it the way CSS wraps it.
  // Pick the wrapper by the token's shape: "24 95% 53%" is hsl, "37 99 235", "220 0 50" and "0 0 255" are rgb (oklch() would misread them), "0.67 0.17 50" is oklch.
  const ch = (getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim() || getComputedStyle(document.body).getPropertyValue(tokenName).trim()).split(/[\s,/]+/)
  // hsl saturation is a percentage; oklch lightness and chroma never exceed 1, so a first or second channel above 1 is rgb, and so are three integers with the last above 1 (pure blue).
  const big = (v) => v != null && !/%$/.test(v) && parseFloat(v) > 1
  const rgbShape = big(ch[0]) || big(ch[1]) || (ch.length >= 3 && ch.slice(0, 3).every((v) => /^\d+$/.test(v)) && big(ch[2]))
  const order = /%$/.test(ch[1] ?? '') ? ['hsl', 'oklch', 'rgb'] : rgbShape ? ['rgb', 'hsl', 'oklch'] : ['oklch', 'hsl', 'rgb']
  for (const fn of order) {
    if (getComputedStyle(probe).color !== SENTINEL) break
    probe.style.color = `${fn}(var(${tokenName}))`
  }
  const signatureColour = getComputedStyle(probe).color
  holder.remove()
  if (signatureColour === SENTINEL) res.facts.signatureDefined = false // unreadable: claim nothing
  // Chromium serialises color-mix(), lab() and the like as oklab()/color(): hand the pixel pass plain rgb.
  const [sr, sg, sb] = rgba(signatureColour)
  res.facts.signature = res.facts.signatureDefined === false ? null : `rgb(${sr}, ${sg}, ${sb})`
  probe.remove()
  const mr = root.getBoundingClientRect()
  res.facts.mainRect = { x: Math.max(0, mr.left), y: Math.max(0, mr.top), w: Math.min(mr.width, vw), h: Math.min(mr.height, innerHeight) }
  const foot = [...root.querySelectorAll('footer')].find((f) => vis(f) && f.getBoundingClientRect().top < innerHeight)
  res.facts.voidArea = { x: res.facts.mainRect.x, w: res.facts.mainRect.w, y: res.facts.mainRect.y, bottom: foot ? foot.getBoundingClientRect().top : innerHeight }
  res.facts.renderedText = (document.body.innerText || '').trim().length
  res.facts.renderedMedia = [...document.body.querySelectorAll('img, svg, canvas, video')].filter(vis).length
  // Style signatures (R-VIS-000 / R-VIS-015): the same role looks the same on every page.
  const sig = (el) => {
    if (!el) return null
    const c = getComputedStyle(el)
    return [c.fontSize, c.fontWeight, c.letterSpacing, c.textTransform, c.color].join(' ')
  }
  // R-VIS-049 (machine subset): first-arrival stagger. Load-time keyframe
  // animations with a positive delay. Infinite loops belong to R-SYN-007 /
  // R-VIS-029(6); interaction-driven transitions are not measurable at rest.
  // vis() is deliberately NOT applied: an entrance waiting out its delay with
  // fill both sits at opacity 0, which is the state being counted.
  {
    const staggered = [...document.body.querySelectorAll('*')].filter((el) => {
      const s = getComputedStyle(el)
      if (s.animationName === 'none' || s.animationIterationCount === 'infinite') return false
      return (parseFloat(s.animationDelay) || 0) > 0
    })
    if (staggered.length) {
      const end = Math.max(...staggered.map((el) => (parseFloat(getComputedStyle(el).animationDelay) || 0) + (parseFloat(getComputedStyle(el).animationDuration) || 0)))
      res.facts.stagger = { count: staggered.length, lastEndMs: Math.round(end) }
      if (staggered.length > T.staggerCountMax || end > T.staggerBudgetMs)
        add('R-VIS-049', 'medium', staggered.length + ' elements arrive each on their own delay, the last ending at ' + Math.round(end) + 'ms (keep the group under ' + T.staggerCountMax + ' items and inside ' + T.staggerBudgetMs + 'ms)')
    }
  }
  // R-VIS-050 facts: which element scrolls in this shell, and whether its
  // gutter is reserved. The cross-page comparison runs in the report phase.
  {
    const docEl = document.documentElement
    let scroller = null
    if (docEl.scrollHeight > docEl.clientHeight + 1) scroller = docEl
    else {
      const inner = document.querySelector('main')
      if (inner) {
        const s = getComputedStyle(inner)
        if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && inner.scrollHeight > inner.clientHeight + 1) scroller = inner
      }
    }
    const gut = getComputedStyle(scroller ?? docEl).scrollbarGutter
    res.facts.frame = { scrolls: !!scroller, gutterReserved: /^stable/.test(gut) }
  }
  res.facts.styles = {
    h1: sig(h1),
    tableHeader: sig([...root.querySelectorAll('thead th')].find(vis)),
  }
  return res
}

// ---- pixel pass: focal map and colour, computed from the screenshot ----------
function measurePixels([dataUrl, area, signature, voidArea]) {
  return new Promise((done) => {
    const img = new Image()
    img.onload = () => {
      const W = img.width
      const H = img.height
      const c = document.createElement('canvas')
      c.width = W
      c.height = H
      const g = c.getContext('2d', { willReadFrequently: true })
      g.drawImage(img, 0, 0)
      const px = g.getImageData(0, 0, W, H).data
      const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
      // OKLab for perceptual lightness/chroma/hue.
      const oklab = (r, gg, b) => {
        r = lin(r); gg = lin(gg); b = lin(b)
        const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * gg + 0.0514459929 * b)
        const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * gg + 0.1073969566 * b)
        const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * gg + 0.6299787005 * b)
        return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]
      }
      // Background = most common quantised colour.
      const hist = new Map()
      for (let i = 0; i < px.length; i += 16) {
        const k = (px[i] >> 3) << 10 | (px[i + 1] >> 3) << 5 | px[i + 2] >> 3
        hist.set(k, (hist.get(k) ?? 0) + 1)
      }
      const bgk = [...hist].sort((a, b) => b[1] - a[1])[0][0]
      const bgLab = oklab(((bgk >> 10) & 31) << 3, ((bgk >> 5) & 31) << 3, (bgk & 31) << 3)
      // Colour: chromatic pixels (OKLCH chroma > 0.06) and their hues.
      let chromatic = 0
      const hues = new Array(12).fill(0)
      const cell = 24 // px; blur scale for the focal map
      const GX = Math.ceil(W / cell)
      const GY = Math.ceil(H / cell)
      const weight = new Float64Array(GX * GY)
      // Signature hue from the token (measureDom resolves it to rgb()).
      let sigHue = null
      let sigChroma = 0
      const rgb = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(signature || '')
      if (rgb) {
        const [, a2, b2] = oklab(+rgb[1], +rgb[2], +rgb[3])
        sigChroma = Math.hypot(a2, b2)
        sigHue = ((Math.atan2(b2, a2) * 180) / Math.PI + 360) % 360
      }
      const SC = 8 // signature cell size
      const SX = Math.ceil(W / SC)
      const sigCells = new Uint8Array(SX * Math.ceil(H / SC))
      let sigPixels = 0
      const rowInk = new Int32Array(H)
      const openW = 16, openH = 10
      const opening = new Float64Array(openW * openH)
      const inArea = (x, y) => !area || (x >= area.x && x < area.x + area.w && y >= area.y && y < area.y + area.h)
      for (let y = 0; y < H; y += 2) {
        for (let x = 0; x < W; x += 2) {
          const i = (y * W + x) * 4
          const [L, a, b] = oklab(px[i], px[i + 1], px[i + 2])
          const C = Math.hypot(a, b)
          if (voidArea && x >= voidArea.x && x < voidArea.x + voidArea.w && (Math.abs(L - bgLab[0]) > 0.03 || C > 0.05)) {
            rowInk[y]++
            opening[Math.min(openH - 1, Math.floor((y / H) * openH)) * openW + Math.min(openW - 1, Math.floor(((x - voidArea.x) / voidArea.w) * openW))]++
          }
          if (C > 0.06) {
            chromatic++
            const hue = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360
            hues[Math.floor(hue / 30)]++
            if (sigHue !== null && sigChroma > 0.04 && C > 0.08 && Math.abs(((hue - sigHue + 540) % 360) - 180) < 20 && inArea(x, y)) {
              sigPixels++
              sigCells[Math.floor(y / SC) * SX + Math.floor(x / SC)] = 1
            }
          }
          // Visual weight: lightness distance from the page plus chroma,
          // counted inside the content area only (chrome is not the page).
          if (!inArea(x, y)) continue
          const d = Math.abs(L - bgLab[0]) + 1.5 * Math.max(0, C - 0.02)
          weight[Math.floor(y / cell) * GX + Math.floor(x / cell)] += d
        }
      }
      const total = (W * H) / 4
      // Smooth the grid (3×3 box) so a heading or a chart reads as one region.
      const sm = new Float64Array(GX * GY)
      for (let y = 0; y < GY; y++)
        for (let x = 0; x < GX; x++) {
          let s = 0
          for (let dy = -2; dy <= 2; dy++)
            for (let dx = -2; dx <= 2; dx++) {
              const yy = y + dy
              const xx = x + dx
              if (yy >= 0 && yy < GY && xx >= 0 && xx < GX) s += weight[yy * GX + xx]
            }
          sm[y * GX + x] = s
        }
      const max = Math.max(...sm)
      // Peak regions: connected cells ≥ 75% of the maximum.
      const seen = new Uint8Array(GX * GY)
      const regions = []
      for (let i = 0; i < sm.length; i++) {
        if (seen[i] || sm[i] < max * 0.75) continue
        const q = [i]
        seen[i] = 1
        let x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0, peak = 0
        while (q.length) {
          const j = q.pop()
          const x = j % GX
          const y = (j / GX) | 0
          x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y)
          peak = Math.max(peak, sm[j])
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const xx = x + dx
            const yy = y + dy
            const k = yy * GX + xx
            if (xx >= 0 && xx < GX && yy >= 0 && yy < GY && !seen[k] && sm[k] >= max * 0.75) {
              seen[k] = 1
              q.push(k)
            }
          }
        }
        regions.push({ x: x0 * cell, y: y0 * cell, w: (x1 - x0 + 1) * cell, h: (y1 - y0 + 1) * cell, peak: +(peak / max).toFixed(2) })
      }
      regions.sort((a, b) => b.peak - a.peak)
      // Draw the focal map: dim everything, keep the heat.
      g.fillStyle = 'rgba(0,0,0,0.55)'
      g.fillRect(0, 0, W, H)
      for (let y = 0; y < GY; y++)
        for (let x = 0; x < GX; x++) {
          const v = sm[y * GX + x] / max
          if (v < 0.35) continue
          g.fillStyle = `rgba(255,${Math.round(220 - 200 * v)},0,${(v * 0.85).toFixed(2)})`
          g.fillRect(x * cell, y * cell, cell, cell)
        }
      g.lineWidth = 3
      g.strokeStyle = '#00e5ff'
      g.font = 'bold 18px sans-serif'
      g.fillStyle = '#00e5ff'
      regions.forEach((r, i) => {
        g.strokeRect(r.x, r.y, r.w, r.h)
        g.fillText(String(i + 1), r.x + 4, r.y + 20)
      })
      // Places where the signature appears: connected groups of signature cells.
      let places = 0
      const SY = Math.ceil(H / SC)
      for (let i = 0; i < sigCells.length; i++) {
        if (sigCells[i] !== 1) continue
        places++
        const q = [i]
        sigCells[i] = 2
        while (q.length) {
          const j = q.pop()
          const x = j % SX
          const y = (j / SX) | 0
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
              const xx = x + dx
              const yy = y + dy
              const k = yy * SX + xx
              if (xx >= 0 && xx < SX && yy >= 0 && yy < SY && sigCells[k] === 1) {
                sigCells[k] = 2
                q.push(k)
              }
            }
        }
      }
      // First-viewport void (R-VIS-042): the longest run of rows with no ink.
      // A band between content is a hole; space after the last block only matters
      // when the content used less than half of the screen.
      const blank = { mid: { size: 0, from: 0 }, tail: 0 }
      if (voidArea) {
        const need = (voidArea.w / 2) * 0.01
        let run = 0
        for (let y = Math.floor(voidArea.y / 2) * 2; y < Math.min(H, voidArea.bottom); y += 2) {
          if (rowInk[y] < need) run += 2
          else {
            if (run > blank.mid.size) blank.mid = { size: run, from: y - run }
            run = 0
          }
        }
        blank.tail = run
      }
      const chromaticShare = chromatic / total
      const hueBins = hues
        .map((n, i) => ({ hue: i * 30, share: chromatic ? n / chromatic : 0 }))
        .filter((h) => h.share > 0.08)
        .sort((a, b) => b.share - a.share)
      done({ blank, opening: [...opening], regions, chromaticShare: +chromaticShare.toFixed(4), hueBins, signature: { hue: sigHue, chroma: +sigChroma.toFixed(3), places, share: +(sigPixels / total).toFixed(4) }, focalMap: c.toDataURL('image/png') })
    }
    img.src = dataUrl
  })
}

// ---- run ------------------------------------------------------------------------
// Preflight: a server that is not running is a setup problem, not a page result.
try {
  await fetch(cfg.base, { redirect: 'manual', signal: AbortSignal.timeout(5000) })
} catch (e) {
  console.error(`nothing answers at ${cfg.base} (${e.cause?.code ?? e.message}). Start the project's dev or preview server, then run this again.`)
  process.exit(2)
}
const chromium = await loadChromium()
let browser
try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
} catch (e) {
  console.error(`browser launch failed: ${e.message}`)
  process.exit(2)
}
// The raw-value check (R-INF-019) needs Element.checkVisibility; without it the run would crash as if it had findings.
{
  const probe = await browser.newPage()
  const ok = await probe.evaluate(() => typeof Element.prototype.checkVisibility === 'function')
  await probe.close()
  if (!ok) {
    console.error('this browser lacks Element.checkVisibility (Chromium 105+); point CHROME_PATH at a newer build.')
    await browser.close()
    process.exit(2)
  }
}
const base = cfg.base.replace(/\/$/, '')
const report = { label, base, at: new Date().toISOString(), pages: [] }
const sheets = new Map()
// Contact sheet (R-VIS-044): every opening at thumbnail size, for the eye.
function drawSheet(items) {
  return new Promise(async (done) => {
    const imgs = await Promise.all(items.map((it) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = it.url })))
    const tw = imgs[0].width > 800 ? 360 : 195
    const th = Math.round((tw * imgs[0].height) / imgs[0].width)
    const cols = tw === 360 ? 4 : 7
    const c = document.createElement('canvas')
    c.width = cols * (tw + 12) + 12
    c.height = Math.ceil(imgs.length / cols) * (th + 34) + 12
    const g = c.getContext('2d')
    g.fillStyle = '#808080'
    g.fillRect(0, 0, c.width, c.height)
    g.font = '14px sans-serif'
    imgs.forEach((im, n) => {
      const x = 12 + (n % cols) * (tw + 12)
      const y = 12 + Math.floor(n / cols) * (th + 34)
      g.fillStyle = '#fff'
      g.fillText(items[n].name, x, y + 14)
      g.drawImage(im, x, y + 20, tw, th)
    })
    done(c.toDataURL('image/png'))
  })
}
const scratch = await (await browser.newContext()).newPage()

for (const theme of cfg.themes ?? ['light']) {
  for (const width of cfg.viewports ?? [1440]) {
    const height = width < 768 ? 844 : 900
    for (const page of cfg.pages) {
      const touch = width < 768 // narrow widths render as a touch device: pointer: coarse applies
      const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch })
      if (cfg.cookies?.length) await ctx.addCookies(cfg.cookies.map((c) => ({ url: base, ...c })))
      const p = await ctx.newPage()
      for (const s of page.setup ?? []) await p.goto(base + s).catch(() => {})
      const seen = []
      p.on('response', (r) => seen.push(r.url()))
      // React's default onCaughtError: an error boundary swapped the page for its fallback.
      const crashed = []
      p.on('console', (m) => { if (m.type() === 'error' && /The above error occurred in (the <[^>]+> component|one of your React components)/.test(m.text())) crashed.push(m.text().match(/<[^>]+>(?= component)/)?.[0] ?? 'an unnamed component') })
      const nav = await p.goto(base + page.url, { waitUntil: 'networkidle' }).catch((e) => ({ failed: e.message }))
      await p.waitForTimeout(cfg.waitMs ?? 1000)
      if (cfg.themeMode === 'class') {
        await p.evaluate((t) => { const c = document.documentElement.classList; c.remove('light', 'dark'); c.add(t) }, theme)
        await p.waitForTimeout(100)
      }
      if (cfg.hide?.length) await p.addStyleTag({ content: `${cfg.hide.join(',')}{display:none!important}` })
      const id = `${page.name}-${theme}-${width}`
      // A page that was not really measured must not read as clean.
      const clean = (u) => new URL(u, base).pathname.replace(/\/$/, '') || '/'
      let invalid = null
      if (nav?.failed) invalid = `could not load: ${nav.failed.slice(0, 80)}`
      else if (nav?.status?.() >= 400) invalid = `HTTP ${nav.status()}`
      else if (!page.allowRedirect && clean(p.url()) !== clean(page.url)) invalid = `redirected to ${clean(p.url())}; a login or error page is not the page you asked for`
      if (!invalid) {
        const q = await p.evaluate(() => ({
          t: (document.body?.innerText ?? '').trim().length,
          m: document.querySelectorAll('img, svg, canvas, video').length,
          ...(() => {
            // Page content: <main>'s text minus its nav/header/footer/aside chrome, and whether it still holds content shapes.
            const m = document.querySelector('main, [role=main]') ?? document.body
            if (!m) return { main: '', shape: 0 }
            let main = m.innerText
            for (const c of m.querySelectorAll('nav, header, footer, aside')) main = main.replace(c.innerText, '')
            return { main: main.trim(), shape: [...m.querySelectorAll('form, table, ul, ol, input:not([type=hidden]), select, textarea, canvas, img, video')].filter((e) => !e.closest('nav, header, footer, aside')).length }
          })(),
        }))
        const fbRe = page.fallbackText ?? cfg.fallbackText
        const fb = fbRe != null ? new RegExp(fbRe, 'i').exec(q.main)?.[0] : null
        // Production React logs no boundary message, so the app's own fallback copy (fallbackText) is the signal there.
        // It counts only when the fallback is about all <main> holds: a help page quoting the copy is still a page.
        if (fb && q.main.replace(fb, '').trim().length < 200 && !q.shape) invalid = `the app's error fallback is showing (“${fb}”); a component crashed, so this is not the page`
        // A dev-build boundary log empties the page only when it took <main> with it; a widget fallback leaves the page measurable.
        else if (crashed.length && q.main.length < 200 && !q.shape) invalid = `a component crashed while rendering (React error boundary caught it in ${crashed[0]}) and <main> holds only ${q.main.length} characters with no form, table, list, input or media: read as the fallback, not the page (a short page that is complete trips this too; check the screenshot)`
        else if (q.t < 20 && q.m === 0) invalid = 'nothing rendered: blank page'
      }
      if (!invalid && cfg.expectAsset && !seen.some((u) => u.includes(cfg.expectAsset))) invalid = `served build lacks ${cfg.expectAsset}: wrong directory or stale preview`
      if (invalid) {
        report.pages.push({ id, page: page.name, theme, width, facts: {}, invalid: true, findings: [{ rule: 'AUDIT', severity: 'high', msg: invalid }] })
        console.log(`${id.padEnd(34)} AUDIT ${invalid}`)
        await ctx.close()
        continue
      }
      const shot = await p.screenshot()
      writeFileSync(join(out, `${id}.png`), shot)
      const dom = await p.evaluate(measureDom, [THRESHOLDS, cfg.signatureVar ?? '--primary'])
      const pix = await scratch.evaluate(measurePixels, [`data:image/png;base64,${shot.toString('base64')}`, dom.facts.mainRect, dom.facts.signature, dom.facts.voidArea])
      writeFileSync(join(out, `${id}-focal.png`), Buffer.from(pix.focalMap.split(',')[1], 'base64'))
      const findings = [...dom.findings]
      if (crashed.length) findings.push({ rule: 'AUDIT-PARTIAL', severity: 'medium', msg: `part of the page crashed (React error boundary caught it in ${crashed[0]}); that area shows its fallback, the rest was measured` })
      const sheetKey = `${theme}-${width}`
      sheets.set(sheetKey, [...(sheets.get(sheetKey) ?? []), { name: page.name, url: `data:image/png;base64,${shot.toString('base64')}` }])
      const opening = pix.opening
      delete pix.opening
      if (!page.allowVoid && pix.blank.mid.size >= Math.max(THRESHOLDS.viewportVoidPx, height * 0.2))
        findings.push({ rule: 'R-VIS-042', severity: 'medium', msg: `${pix.blank.mid.size}px blank band between content from y=${pix.blank.mid.from} in the first viewport` })
      if (!page.allowVoid && pix.blank.tail >= height * 0.5)
        findings.push({ rule: 'R-VIS-042', severity: 'medium', msg: `content stops early: the last ${pix.blank.tail}px of the first viewport is blank (${Math.round((pix.blank.tail / height) * 100)}% of the screen)` })
      // Name each heat region by the component under it, then merge regions
      // that sit in one container: six bars of one chart are one moment.
      const named = await p.evaluate((regions) => regions.map((r) => {
        const el = document.elementFromPoint(r.x + r.w / 2, r.y + r.h / 2)
        const box = el?.closest('[data-slot=card], figure, table, dl, header, section, [role=region], h1, h2, button, a') ?? el
        const title = box?.querySelector?.('[data-slot=card-title], h2, h3, caption, dt')?.textContent ?? box?.textContent ?? ''
        const key = box ? `${box.tagName}@${Math.round(box.getBoundingClientRect().left)},${Math.round(box.getBoundingClientRect().top)}` : 'none'
        return { ...r, key, what: `${box?.tagName.toLowerCase() ?? '?'} “${title.trim().replace(/\s+/g, ' ').slice(0, 40)}”` }
      }), pix.regions)
      const merged = []
      for (const r of named) if (!merged.some((m) => m.key === r.key)) merged.push(r)
      // R-VIS-036: one focal moment. Peaks within 90% of the top compete.
      const rivals = merged.filter((r) => r.peak >= 0.9)
      const fb = dom.facts.focalBlock
      if (page.shape !== 'form' && !fb.form && fb.share < THRESHOLDS.focalShareMin)
        findings.push({ rule: 'R-VIS-036', severity: 'low', msg: `no block holds ${Math.round(THRESHOLDS.focalShareMin * 100)}% of the first viewport (largest: ${fb.what ?? 'none'} at ${Math.round(fb.share * 100)}%); first attention lands on ${merged[0]?.what ?? 'nothing'}` })
      const flat = merged.filter((r) => r.peak >= 0.75).length >= 4
      if (page.focus && merged[0]) {
        const inFocus = await p.evaluate(([sel, r]) => {
          const el = document.elementFromPoint(r.x + r.w / 2, r.y + r.h / 2)
          return !!el?.closest(sel)
        }, [page.focus, merged[0]])
        if (!inFocus) findings.push({ rule: 'R-VIS-036', severity: 'medium', msg: `first attention lands on ${merged[0].what}, not on the intended ${page.focus}`, box: merged[0] })
      }
      if (flat) findings.push({ rule: 'R-VIS-036', severity: 'low', msg: `no focal moment: ${merged.filter((r) => r.peak >= 0.75).length} regions carry about the same weight` })
      else if (rivals.length > 1) findings.push({ rule: 'R-VIS-036', severity: 'medium', msg: `${rivals.length} places compete for first attention: ${rivals.map((r) => r.what).join(' vs ')}`, box: rivals[1] })
      pix.regions = merged
      // R-VIS-037: a signature exists and colour is not a rainbow.
      const sg = pix.signature
      if (!dom.facts.signatureDefined) {
        // No such token: nothing was measured. Saying "neutral grey" here would be invented.
      } else if (sg.chroma <= 0.04) findings.push({ rule: 'R-VIS-037', severity: 'medium', msg: `the signature token (${cfg.signatureVar ?? '--primary'}) is neutral grey: the product has no colour signature` })
      else if (sg.places === 0) findings.push({ rule: 'R-VIS-037', severity: 'low', msg: 'the signature colour appears nowhere in the content area' })
      else if (sg.places > 40) findings.push({ rule: 'R-VIS-037', severity: 'low', msg: `the signature colour appears in ${sg.places} places: no longer a signature` })
      if (pix.hueBins.length > 3) findings.push({ rule: 'R-VIS-018', severity: 'low', msg: `${pix.hueBins.length} hue families each over 8% of the colour on screen` })
      report.pages.push({ id, page: page.name, theme, width, shell: page.shell, facts: { ...dom.facts, opening, firstViewportBlank: pix.blank, chromaticShare: pix.chromaticShare, hueBins: pix.hueBins, signaturePlaces: pix.signature, focalRegions: pix.regions.slice(0, 4) }, findings })
      const tag = findings.length ? findings.map((f) => f.rule).join(' ') : 'clean'
      console.log(`${id.padEnd(34)} ${tag}`)
      await ctx.close()
    }
  }
}
for (const [key, items] of sheets) {
  const url = await scratch.evaluate(drawSheet, items)
  writeFileSync(join(out, `contact-${key}.png`), Buffer.from(url.split(',')[1], 'base64'))
}
await browser.close()
// A requested theme that changed nothing measured the same theme twice.
if ((cfg.themes ?? []).length > 1) {
  const groups = new Map()
  for (const pg of report.pages) {
    if (pg.invalid) continue
    const k = `${pg.page}-${pg.width}`
    groups.set(k, [...(groups.get(k) ?? []), pg])
  }
  for (const g of groups.values())
    if (g.length > 1 && new Set(g.map((pg) => pg.facts.bodyBackground)).size === 1)
      g[g.length - 1].findings.push({ rule: 'AUDIT', severity: 'high', msg: `themes ${g.map((pg) => pg.theme).join('/')} rendered the same background; set "themeMode": "class" if the theme is class-based` })
}
// R-VIS-044: screens whose first-viewport block layout is nearly identical.
{
  const groups = new Map()
  for (const pg of report.pages) {
    if (!pg.facts.opening) continue
    const k = `${pg.theme}-${pg.width}`
    groups.set(k, [...(groups.get(k) ?? []), pg])
  }
  const cos = (a, b) => {
    let d = 0, x = 0, y = 0
    for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; x += a[i] * a[i]; y += b[i] * b[i] }
    return x && y ? d / Math.sqrt(x * y) : 0
  }
  for (const g of groups.values()) {
    const parent = g.map((_, i) => i)
    const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])))
    for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) if (cos(g[i].facts.opening, g[j].facts.opening) > 0.985) parent[find(i)] = find(j)
    const clusters = new Map()
    g.forEach((pg, i) => clusters.set(find(i), [...(clusters.get(find(i)) ?? []), pg]))
    for (const c of clusters.values())
      if (c.length >= 3) c[0].findings.push({ rule: 'R-VIS-044', severity: 'low', msg: `${c.length} pages open with one layout: ${c.map((pg) => pg.page).join(', ')}. Fine only if they share one job.` })
  }
  for (const pg of report.pages) delete pg.facts.opening
}
// Cross-page consistency (R-VIS-000 / R-VIS-015): one role, one look. The
// majority style per role and width is the system; pages that differ drifted.
for (const role of ['h1', 'tableHeader']) {
  const groups = new Map()
  for (const pg of report.pages) {
    const v = pg.facts.styles?.[role]
    if (!v) continue
    const k = `${pg.theme}-${pg.width}`
    if (!groups.has(k)) groups.set(k, new Map())
    const g = groups.get(k)
    g.set(v, [...(g.get(v) ?? []), pg])
  }
  for (const g of groups.values()) {
    if (g.size < 2) continue
    const [major] = [...g.entries()].sort((a, b) => b[1].length - a[1].length)
    for (const [v, pages] of g) {
      if (v === major[0]) continue
      for (const pg of pages) pg.findings.push({ rule: role === 'h1' ? 'R-VIS-000' : 'R-VIS-015', severity: 'medium', msg: `${role} drifts from the system (${major[1].length} pages): “${v}” vs “${major[0]}”` })
    }
  }
}
// Frame stability (R-VIS-050): pages that share a shell keep one frame.
// Opt-in: mark pages with "shell": "<id>" in the config; unmarked pages are
// never compared. One page scrolling while a sibling does not, with no
// scrollbar gutter reserved on the scroller, moves the frame between pages.
{
  const groups = new Map()
  for (const pg of report.pages) {
    if (!pg.shell || pg.invalid || !pg.facts.frame) continue
    const k = pg.shell + '-' + pg.theme + '-' + pg.width
    groups.set(k, [...(groups.get(k) ?? []), pg])
  }
  for (const g of groups.values()) {
    if (g.length < 2) continue
    const mixedScroll = g.some((pg) => pg.facts.frame.scrolls) && g.some((pg) => !pg.facts.frame.scrolls)
    if (!mixedScroll || g.every((pg) => pg.facts.frame.gutterReserved)) continue
    for (const pg of g)
      pg.findings.push({ rule: 'R-VIS-050', severity: 'medium', msg: 'the frame moves between ' + g.map((p) => p.page).join(' / ') + ': one page scrolls and another does not, and the scroller reserves no scrollbar gutter' })
  }
}
writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 1))
const byRule = {}
for (const pg of report.pages) for (const f of pg.findings) byRule[f.rule] = (byRule[f.rule] ?? 0) + 1
console.log(`\n${report.pages.length} renders · ${Object.values(byRule).reduce((a, b) => a + b, 0)} findings`, byRule)
console.log(`report: ${join(out, 'report.json')}`)
for (const key of sheets.keys()) console.log(`contact sheet: ${join(out, `contact-${key}.png`)}`)
const invalidCount = report.pages.filter((pg) => pg.findings.some((f) => f.rule === 'AUDIT')).length
if (invalidCount) {
  console.log(`MEASUREMENT INVALID: ${invalidCount} renders were not really measured (rule AUDIT). Fix the config or the route before reading any other result.`)
  process.exit(2)
}
const total = Object.values(byRule).reduce((a, b) => a + b, 0)
if (total > 0) {
  console.log(`NOT CLEAN: ${total} findings. Fix each one or name why it stays; do not report this run as verified.`)
  process.exit(1)
}
console.log('CLEAN on what this script measures. Composition is not measured: open the contact sheets and judge R-VIS-036, 040 and 044 by eye before claiming a visual result.')
