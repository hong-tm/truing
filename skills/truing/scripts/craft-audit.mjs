#!/usr/bin/env node
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const USAGE = 'usage: node craft-audit.mjs <src-dir> [--json] [--max N]\nStatic leads for Truing visual-craft rules. Hits are leads to inspect, not verdicts.';
const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(USAGE); process.exit(args.length ? 0 : 2); }
const root = args.find((a) => !a.startsWith('--'));
const asJson = args.includes('--json');
const maxIdx = args.indexOf('--max');
const MAX = maxIdx >= 0 ? Number(args[maxIdx + 1]) || 8 : 8;
if (!existsSync(root) || !statSync(root).isDirectory()) { console.error(`not a directory: ${root}`); process.exit(2); }

const EXT = new Set(['.tsx', '.jsx', '.ts', '.js', '.vue', '.svelte', '.html', '.css']);
const SKIP = new Set(['node_modules', 'dist', 'build', '.git', '.next', 'coverage', '.turbo']);
const files = [];
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (EXT.has(extname(e.name)) && !/\.(test|spec|stories)\./.test(e.name)) files.push(p);
  }
};
walk(root);

const checks = [
  { id: 'arbitrary-value', rule: 'R-VIS-000', what: 'bracketed arbitrary utility values (selector variants like data-[state=open] excluded)', re: /\b[a-z][\w:-]*-\[[^\]\s]+\]/g, markup: true, keep: (m) => !/(^|:)(data|aria|supports|has|group|peer|not|nth[\w-]*)-\[/.test(m) },
  { id: 'inline-size', rule: 'R-VIS-000', what: 'inline style sizes in px/rem', re: /style=\{\{[^}]*\b(width|height|padding|margin|gap|fontSize)\s*:\s*['"`]?\d+(\.\d+)?(px|rem)?/g, markup: true },
  { id: 'raw-hex', rule: 'R-VIS-000 / R-VIS-018', what: 'raw hex colors outside stylesheets', re: /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-fA-F])/g, markup: true },
  { id: 'raw-role-size', rule: 'R-VIS-000 / R-VIS-014', what: 'raw heading/statistic sizes at call sites (own them as named type tokens in the theme)', re: /(?<![\w-])text-(lg|xl|[2-9]xl)\b/g, markup: true },
  { id: 'raw-palette', rule: 'R-VIS-000 / R-VIS-018', what: 'palette colour classes at call sites (use semantic tokens such as bg-primary, text-muted-foreground)', re: /\b(bg|text|border|from|via|to|fill|stroke|ring|outline|decoration|accent|caret)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d{2,3}\b/g, markup: true },
  { id: 'font-mono', rule: 'R-VIS-005', what: 'font-mono uses (allowed on identifiers only)', re: /\bfont-mono\b/g },
  { id: 'transition-all', rule: 'R-VIS-029', what: 'transition-all (animate named properties instead)', re: /\btransition-all\b/g },
  { id: 'desaturate', rule: 'R-VIS-018 / R-VIS-037', what: 'global greyscale or desaturation', re: /(?<!font-smoothing:\s*)\b(grayscale|saturate-0)\b|filter:\s*grayscale/g }, // font smoothing is not colour,
];
const spreads = [
  { id: 'type-sizes', rule: 'R-VIS-017', what: 'distinct text sizes (target <= 6)', re: /\btext-(xs|sm|base|lg|xl|[2-9]xl|\[[\d.]+(px|rem)\])\b/g, limit: 6 },
  { id: 'radius-steps', rule: 'R-VIS-022', what: 'distinct radius classes (should follow the system scale)', re: /\brounded(-(none|sm|md|lg|xl|2xl|3xl|full|\[[^\]]+\]))?\b(?!-)/g, limit: 4 },
];

const VENDORED = /(^|\/)components\/ui\//;
const report = { root, filesScanned: files.length, checks: {}, spreads: {} };
for (const c of checks) report.checks[c.id] = { rule: c.rule, what: c.what, count: 0, vendored: 0, hits: [] };
const spreadSets = Object.fromEntries(spreads.map((s) => [s.id, new Map()]));

for (const f of files) {
  const rel = relative(root, f);
  const isCss = extname(f) === '.css';
  const lines = readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const c of checks) {
      if (c.markup && isCss) continue;
      const m = (line.match(c.re) || []).filter(c.keep || (() => true));
      if (!m.length) continue;
      const r = report.checks[c.id];
      if (VENDORED.test(rel)) { r.vendored += m.length; continue; }
      r.count += m.length;
      if (r.hits.length < MAX) r.hits.push(`${rel}:${i + 1}  ${m.slice(0, 3).join(' ')}`);
    }
    for (const s of spreads) {
      for (const m of line.matchAll(s.re)) {
        const set = spreadSets[s.id];
        set.set(m[0], (set.get(m[0]) || 0) + 1);
      }
    }
  });
}
for (const s of spreads) {
  const set = spreadSets[s.id];
  report.spreads[s.id] = { rule: s.rule, what: s.what, distinct: set.size, over: set.size > s.limit, values: [...set.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}×${n}`) };
}

if (asJson) { console.log(JSON.stringify(report, null, 2)); process.exit(0); }
const out = [`# craft-audit: ${root}`, `files scanned: ${files.length}`, ''];
for (const [id, r] of Object.entries(report.checks)) {
  out.push(`## ${id} (${r.rule}) — ${r.count} in app code${r.vendored ? `, ${r.vendored} in vendored components/ui (review separately)` : ''}`, r.what);
  for (const h of r.hits) out.push(`  ${h}`);
  if (r.count > r.hits.length) out.push(`  … ${r.count - r.hits.length} more`);
  out.push('');
}
for (const [id, s] of Object.entries(report.spreads)) {
  out.push(`## ${id} (${s.rule}) — ${s.distinct} distinct${s.over ? '  ← over target' : ''}`, s.what, `  ${s.values.join('  ') || '(none)'}`, '');
}
console.log(out.join('\n'));
