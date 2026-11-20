# Visual craft — index

Use this branch only after [information-design.md](information-design.md) on operational pages, when the information structure is settled (blocks exist, content is placed, one element holds attention) and the question is whether the surface looks resolved. It applies to any surface that already has a design system; work through that system, never around it. These rules do not replace WCAG-scoped checks in [accessibility-and-responsive.md](accessibility-and-responsive.md) or state-model checks in [interaction-and-states.md](interaction-and-states.md).

The 52 rules (R-VIS-000..051) reduce to seven patterns. Read this index, decide which patterns the task touches, and open only those files. Every number in the cards is a working heuristic or a measurement from named evidence, never a universal law.

## Fast path

1. **Measure the render, then scan the source.** When a browser can run, start with `node scripts/render-audit.mjs <config.json>`. It opens every page at desktop and touch widths and measures what a reader sees: the left rail, the type sizes in use, the title-to-number ratio, numeric alignment, row alignment, hit areas found by hit-testing, silent truncation, sideways scroll, the focal map, signature placement, and style drift between pages. It writes a screenshot and a focal map for each finding. Then run `node scripts/craft-audit.mjs <src-dir>` (no dependencies) for source-only leads. The render findings are defects to confirm on the screenshot; the source hits are only leads. Remove your own harness overlays with `hide` in the config. A finding that comes from mock data or a tool you cannot change stays in the report, named as such; it never counts as fixed. (Project post-mortems with measured numbers live in VALIDATION.md, not here.)
2. **Fix hygiene in pattern order 1 → 6.** Earlier patterns remove causes that later patterns would only treat as symptoms: one shared component fixes a badge on every page. Land each fix in its owner, not at the call site: a type ratio becomes named type roles in the theme, a signature becomes one brand variable, a repeated style becomes a utility or component (R-VIS-000; the shadcn/Tailwind v4 recipe is in its card). Then pixel-diff the refactor against the previous build: only the intended change may differ.
3. **Composition pass (pattern 7), only on request or on a showcase surface.** Do not run it by default on operational pages: in a blind owner comparison, the build made with this pass as a required step had the fewest audit findings and was rated the most ordinary. Write the brief and pick the shape in [composition-pass.md](../examples/composition-pass.md). Open the `contact-<theme>-<width>.png` sheets the audit writes. A clean audit is not a designed page: the script cannot see a plain one.
4. **Re-run the render audit after the fix.** A fix can move something else, and only the re-run shows it.
5. **Report with a render pair.** Show before/after at the same width and theme. Sort every change as hygiene or composition (R-VIS-038).

## The seven patterns

### 1. One system, one source → [system-and-single-source.md](visual-craft/system-and-single-source.md)

Every repeated decision has exactly one owner: one token, one component, one formatter, one computed number. Local fixes drift; owned decisions converge.

| Rule | Check in one line |
|---|---|
| R-VIS-000 design-system-native | Bracketed arbitrary values and inline widths each carry a scope comment, or they do not exist. |
| R-VIS-001 one status badge | One badge component; every status maps to a severity-ordered variant; legible in both themes. |
| R-VIS-002 one number, one truth | The same total on two pages comes from one source and matches. |
| R-VIS-005 shared formatters | Dates/money/counts go through system formatters with tabular figures; `font-mono` only on IDs; a value never splits across lines (currency, date, ID). |
| R-VIS-014 one type scale | Largest number aims for 1.3x to 1.5x the title, at most 40px, owned by named roles. Above 1.5x fails the audit; below 1.3x is a quiet-page smell, not a finding. |
| R-VIS-016 one spacing scale | Section gaps > inner gaps; no in-between values. |
| R-VIS-022 concentric radii | Inner radius = outer radius − padding; steps from the system scale. |
| R-VIS-033 identity + one icon family | Avatar never alone; icons share one stroke family. |

### 2. Geometry encodes meaning → [geometry-and-alignment.md](visual-craft/geometry-and-alignment.md)

Position and distance are information. Shared edges say "these belong to one page"; gaps say how closely things relate; alignment says how to compare.

| Rule | Check in one line |
|---|---|
| R-VIS-008 column shares | Every column has a share; one absorbs slack; action column sized from its control. |
| R-VIS-009 reserved action column | Row action is a labeled control in its own column; equal widths. |
| R-VIS-011 one alignment rail | Breadcrumb, h1, and table left edges share one x; a control sits beside what it controls. |
| R-VIS-017 4/8 grid, ≤6 sizes | Spacing on the grid; at most six type sizes; dashboard headings near 24px. |
| R-VIS-026 numbers right-aligned | Numeric columns right-aligned; names left-aligned. |
| R-VIS-028 three proximity tiers | Label–value tight, within-group close, between-group far; nothing between. |
| R-VIS-039 one row line | Cells in a row share a first line or a centre, never a mix; controls take their label's baseline. |
| R-VIS-050 frame stays put | The element that scrolls reserves its gutter (root: `scrollbar-gutter: stable`); clientWidth, h1 x and first-cell x match on a short and a long page. |

### 3. Hierarchy by restraint → [hierarchy-and-restraint.md](visual-craft/hierarchy-and-restraint.md)

Make emphasis from weight, lightness, and scarcity before you add size or color. Give color fewer jobs; do not take color away.

| Rule | Check in one line |
|---|---|
| R-VIS-010 composed headline stat | One number, one micro-label, one supporting fact, no frame. |
| R-VIS-015 quiet labels | One label style, sentence case by default, 12px or larger, 4.5:1. |
| R-VIS-018 color restraint | Neutral surface ladder (60-30-10 is marketing-page only); one accent per group; semantic color stays; no global desaturation. |
| R-VIS-019 display tracking | Large display type has negative tracking and tight leading; body text does not. |
| R-VIS-021 depth per theme | Light: layered soft shadows. Dark: surface steps. Borders visible in both. |
| R-VIS-027 weight before size | New hierarchy comes from weight and lightness inside the scale first. |
| R-VIS-046 card tiers | Inside a card: hook > context > finisher; no two same-weight elements. |

### 4. Show only what is true → [honest-content.md](visual-craft/honest-content.md)

The surface never claims more than the data knows: no invented percentage, no bare number without context, no label that hides its consequence.

| Rule | Check in one line |
|---|---|
| R-VIS-004 honest charts | Chart type fits the data shape; `--chart` tokens; a real empty state. |
| R-VIS-007 consequence labels | Labels state what happens; no action without its object. |
| R-VIS-024 KPI with baseline | Every KPI says what it compares against. |
| R-VIS-030 real-length content | Truncation with the full value one interaction away; no placeholder text ships. |
| R-VIS-051 preview realness | A demo or screenshot names the product part it reuses; a generic mock, gray wireframe or boxed shrink fails. |
| R-VIS-035 honest progress | Determinate only when the end is computable. |

### 5. Every state is designed → [states-and-motion.md](visual-craft/states-and-motion.md)

A surface is the set of all its states. Loading, empty, hover, disabled, open overlay, and the motion between them get the same care as the happy path.

| Rule | Check in one line |
|---|---|
| R-VIS-012 overlay behavior | Sized for content; page behind does not scroll sideways; verb in title; focus returns. |
| R-VIS-013 loading/empty shape | Skeleton matches the coming shape; empty/error keep the page's type scale. |
| R-VIS-020 four states + numeric motion | Default/hover/active/disabled all exist; changing numbers animate. |
| R-VIS-025 full-size hit areas | Small visual, ≥44px touch target. |
| R-VIS-029 motion budget | 150–300ms micro, ≤~600ms panels; ease-out in, ease-in out; reduced motion honored. |
| R-VIS-031 teaching empty state | What is absent, with one next action when available. |
| R-VIS-047 overlay weight | Popover adjusts, modal blocks, toast reports, page moves; weight matches the job. |
| R-VIS-048 motion keeps place | Leaves toward its origin; input redirects from the current position; transform and opacity first. |
| R-VIS-049 motion sequence | One thing leads; stagger first arrival of a few items only, never refilter or refresh; controls work throughout. |

### 6. Capability survives transformation → [tables-forms-responsive.md](visual-craft/tables-forms-responsive.md)

A redesign, a narrow viewport, or a denser layout may change the form of a capability, but never remove it.

| Rule | Check in one line |
|---|---|
| R-VIS-003 table controls kept | Search/filter/sort survive the redesign. |
| R-VIS-006 two density tiers | Exactly two row heights; one per surface. |
| R-VIS-023 mobile card conversion | Header gone; each card inlines its labels. |
| R-VIS-032 form mirrors output | Form order matches the output; likely answer preselected; never squeezed. |
| R-VIS-034 overview/detail split | Wide tables show summary columns; detail moves to a row view. |

### 7. Composition and character → [composition-and-character.md](visual-craft/composition-and-character.md)

The pass that runs after hygiene. One focal moment, one signature, a face for the product, and an honest render-pair verdict. Hygiene removes reasons to distrust a page; this pattern gives it something to look at, so spend at least as long here.

| Rule | Check in one line |
|---|---|
| R-VIS-036 one focal moment | Blurred screenshot: one region stands out in under a second. |
| R-VIS-037 one signature, full strength | Name the signature in one sentence; it appears in a few chosen places, never greyed out. |
| R-VIS-038 render-pair verdict | Report has before/after renders and a hygiene vs composition split. |
| R-VIS-040 the product has a face | Cover the title: can you name the product and the place? One element only this product has. |
| R-VIS-041 finding and job | The subline states today's fact; one primary control does the job. |
| R-VIS-042 no stretched voids | Rows balance by content; nothing blank over 64px inside a card. |
| R-VIS-043 charts show scale | Y ticks, faint grid, bars no wider than a mark. |
| R-VIS-044 openings fit jobs | Thumbnails of all pages: can you tell their jobs apart? |
| R-VIS-045 columns earn place | No column repeats the viewer or is empty in every row. |

## The render audit

What it measures per rule, its known weak spots, and how far to trust it: [render-audit.md](../scripts/render-audit.md). Read that only when you run the script or dispute a finding.

## Rule IDs in this version

R-VIS-036..038 came in v6, R-VIS-039 in v7, R-VIS-040..045 in v8. v8 rewrote R-VIS-014 and R-VIS-015 and clarified R-VIS-023. v9 added no rules: it adds measurements for existing ones and moves each card's evidence to [evidence.md](visual-craft/evidence.md). v9.2 added R-VIS-046 (three-tier card reading) and revised R-VIS-018 (a neutral surface ladder replaces the 60-30-10 backbone on data surfaces). v9.3 added R-VIS-047 (overlay weight classes). v10.1 added R-VIS-048 and R-VIS-049 (motion place and sequence). v10.2 added R-VIS-050 (the page frame does not move between pages). v10.3 added no R-VIS rule; a held-out audit reshaped R-VIS-048..050 and moved R-VIS-050's index entry to pattern 2.
