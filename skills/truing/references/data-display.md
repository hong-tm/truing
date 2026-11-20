# Data display

Use this branch when the surface's job is showing data: what a chart's title says, at what scale a chart lives, where filtering attaches, and how a table row is scanned in one pass. It sits on top of base rules that live elsewhere: chart honesty is [R-VIS-004](visual-craft/honest-content.md), numeric alignment is [R-VIS-026](visual-craft/geometry-and-alignment.md), control preservation is [R-VIS-003](visual-craft/tables-forms-responsive.md), wide-table slimming is [R-VIS-034](visual-craft/tables-forms-responsive.md), and KPI scope is [R-VIS-024](visual-craft/honest-content.md). Open those pattern files when the base is in question; this file adds the layer that makes a data surface behave like one.

Evidence note: R-SYN-013 to R-SYN-017 are agent synthesis from the owner's NotebookLM corpus (172 sources, extracted 2026-11-03): the WWDC22 chart session, a 2,108-dashboard survey, and two table-craft sources. They are conditional heuristics, not measurements. Three corpus recommendations were rejected on contradiction with existing cards: creative chart forms for core metrics (R-VIS-004 keeps familiar forms), icon-only row actions (R-SYN-005 keeps accessible labels), and conversion percentages as rule content (the package's evidence discipline wins). R-SYN-024 (v10.8, 2026-11-11) is two-site council synthesis backed by the NotebookLM kpi and dark answers; its provenance is sources.md's NOTE-v10.8-council.

## R-SYN-013

State a chart's takeaway in its title, not its subject.

- Evidence: agent-synthesis; corpus-derived.
- Scope: chart titles on operational surfaces, plus a KPI block's headline, which is read the same way (R-VIS-024 scopes the number itself).
- Action: Write the title as a complete sentence stating direction, magnitude, and scope when computable ("Sales for the past 30 days are up 12%, totaling 1,234 units"). A bare subject ("Sales trend") or an axis restatement ("Sales by day") fails. Every claim in the sentence must be derivable from the data shown.
- Reason: The title is read first. A subject-name title forces the reader to decode the axes to learn what the chart already knows; a skimmer who stops at the title leaves with nothing.
- Exceptions: A sparkline inside another block takes a micro-label — the block's headline carries the takeaway. A user-configured chart keeps the user's label. Exploratory sandboxes keep the question, not a conclusion.
- Tradeoff: Sentence titles are longer; keep to one line and fold the total into the sentence rather than a second line.
- Alternative: Keep the noun label and put the takeaway in a bound subtitle — acceptable only when subtitle and chart are one component that cannot be dropped independently.
- Near miss: R-VIS-024 already scopes KPI numbers; this card governs the title's wording, not its layout.
- Check: Read each chart title aloud; if it could sit unchanged above a chart of the opposite trend, it fails.
- Strength and units: conditional heuristic; not empirical proof. No measured comprehension lift; no prescribed sentence length.
- Trail: corpus-derived [second-sequence batch 2 (111-115), "WWDC22: Design app experiences with charts | Apple"]; v9.2 synthesis, owner-approved.

## R-SYN-014

Let a chart live at one of three scales, each keeping its promise: small static, medium interactive, large investigation.

- Evidence: agent-synthesis; corpus-derived.
- Scope: charts wherever the same data may appear at more than one size — tiles, KPI blocks, detail views.
- Action: Keep small static previews to shape, trend, and at most a last value — no grid lines, no axis labels, no interactivity. Give medium charts axis labels, hover or range selection, and bounded width. Reserve real canvas for large investigation views. Keep geometry, colors, and shape identical across tiers, so the small one is a promise of the large one. Core metrics use familiar forms (line, bar — R-VIS-004); a novel form is an owner-approved signature moment, not a default.
- Reason: Axes on a thumbnail are noise at that size; interactivity missing from a full-canvas chart wastes the canvas; sameness across tiers is what makes the ladder legible as one dataset.
- Exceptions: A product with a single medium chart may skip the ladder. Bespoke editorial visualization is R-VIS-004's exception territory.
- Tradeoff: One chart at three sizes costs component work; token-driven chart components (R-VIS-004's chart tokens) pay it back once.
- Alternative: A two-tier ladder (preview plus interactive) for products without an investigation view — name the missing tier as a gap.
- Near miss: A sparkline with a last-value dot is a small-tier chart doing its job, not a broken medium one.
- Check: List every chart instance with its tier; confirm each has — or deliberately lacks — axes, labels, and interaction per its tier, and that tiers of the same dataset share shape and color.
- Strength and units: conditional heuristic; tier boundaries are component decisions, not pixel laws.
- Trail: corpus-derived [second-sequence batch 2 (111-115), "WWDC22: Design app experiences with charts | Apple"]; v9.2 synthesis, owner-approved.

## R-SYN-015

Pair the surface's primary trend view with what to do about it.

- Evidence: agent-synthesis; corpus-derived.
- Scope: the main chart or metric view of an operational surface — the one the page exists for — not every chart.
- Action: Render one recommended next step or flagged anomaly as a short callout next to the primary trend, naming a direction and an action ("Late payments rising in Zone B — send reminders to 12 accounts"), not a restatement of the number. When no defensible recommendation exists, show the most notable fact and label what is missing rather than inventing one. Keep the callout secondary to the chart's focal point (R-SYN-012).
- Reason: A dashboard's job ends at a decision; an isolated historical chart stops one step short and hands the interpretation work back to the reader.
- Exceptions: Exploratory analytics where the user brings the question; owner-recorded display-only views.
- Tradeoff: A wrong or obvious recommendation costs more trust than none; derive it from a rule the product can defend and surface that rule on inspection.
- Alternative: An annotated peak or threshold marker on the chart itself — data, not recommendation — when the next step cannot be derived.
- Near miss: An annotation is data; this card asks for the step after the data.
- Check: On the primary view, name the paired recommendation and the rule that generated it; if neither exists, the page says why the view has none.
- Strength and units: conditional heuristic; corpus save/export multipliers are folklore and deliberately not repeated as promises.
- Trail: corpus-derived [batch 11, "I Studied 2,108 Dashboards To Find What Sticks"]; v9.2 synthesis, owner-approved.

## R-SYN-016

Put a filter in the column it filters; a filter bar repeating the column titles is a defect.

- Evidence: agent-synthesis; corpus-derived.
- Scope: operational tables whose filter dimensions are the columns themselves.
- Action: Attach per-column filter and sort affordances inside the column header — one icon, one affordance per column (R-VIS-003). Do not mount a separate bar above the table whose dropdowns restate column titles. Free-text search may stay in the toolbar; cross-table scope filters (date range, tenant) may stay above when they cut across tables, labeled as scope, not as column filters. A filter set applies one way — every control live, or one batched apply — never both; and no two controls hold the same filter job (a device filter beside a devices tab is one control too many).
- Reason: Header-attached filters collapse two scanning passes into one; a duplicated filter bar makes the reader match two lists that name the same things.
- Exceptions: At narrow widths where the table becomes cards and the header is gone (R-VIS-023), filters move to one filter control or sheet, which is then the only place they live. The cross-table scope bar; a table component that cannot yet host header filters makes the bar a named gap to fix, not a design choice to keep.
- Tradeoff: Header menus can hide the active filter set; echo active filters as removable chips in or directly under the toolbar so state stays visible.
- Alternative: A single toolbar search when the table has one dominant filter dimension.
- Near miss: R-VIS-003 already prefers header-embedded filters; this card names the duplicated top bar as the failure mode and keeps cross-table scope filters legal.
- Check: For each filterable column, find its filter control inside that column's header; count filter controls outside the table that name a column — target zero.
- Strength and units: conditional heuristic; the two-pass-to-one-pass claim is a rationale, not a measured time saving.
- Trail: corpus-derived [second-sequence batch 1 (106-110), "Why Data Table Filters Work Better in Headers"]; v9.2 synthesis, owner-approved.

## R-SYN-017

Make a table row scannable in one pass: anchored identity, tinted header, visible sort, chips for states that need action.

- Evidence: agent-synthesis; corpus-derived.
- Scope: operational tables with more than roughly ten rows.
- Action: Make the record's identity cell the row's visual anchor — the strongest in-row weight where rows are dense. Tint the header row one surface step above the body so columns are located without reading. Carry the active sort as a visible cue (icon plus accent) on the header, not only in DOM order. Where R-INF-005 says a status needs colour, render it as a shape-and-color chip (R-VIS-001), never colored text alone; a status with no action stays plain text (which states get colour is R-INF-005's call, not this card's). Give a selected row a soft tint across its full width.
- Reason: Each cue removes one re-scan: the anchor answers which record, the tint answers where columns start, the sort cue answers why this order, the chip answers which rows need something without reading a word.
- Exceptions: R-VIS-006's density tiers and R-VIS-034's slim-table pattern govern height and columns; mono identifiers keep font-mono and are anchored some other way or not at all.
- Tradeoff: Tint and chips add weight to a dense surface; both come from system tokens, so the cost is paid once, not per page.
- Alternative: R-VIS-034's two-line rows at narrow widths carry the same scannability without a table.
- Near miss: R-INF-005 decides how many states get colour, and this card decides how the coloured ones render. Numeric right-alignment is R-VIS-026's rule; bolding every cell to "help scanning" removes the anchor and fails this card.
- Check: Cover the data rows and confirm columns are still locatable from the header alone; read three rows, naming each record's anchor, its status (chip if it needs action, otherwise plain text), and the active sort column.
- Strength and units: conditional heuristic; tint step and chip shapes come from the system's tokens, not new values.
- Trail: corpus-derived [batch 21, "UI Design Tips for a Better Data Table UX"; batch 15, "The 3 dashboard UI flaws that give away you've NEVER built one"]; v9.2 synthesis, owner-approved.

## R-SYN-024

Encode the claimed comparison in the marks, not the reader's arithmetic.

- Evidence: agent-synthesis; corpus-derived.
- Scope: charts and KPI blocks whose title or headline claims a difference — a gap, a drop, an overshoot.
- Action: When the takeaway is a difference, draw the difference: a filled band between the two series (or between the series and its zero baseline) so the magnitude reads as area, never two normalized ramps the reader must subtract. Keep lines straight or softly grid-mapped; no spline smoothing that moves peak and valley positions. Axis anchoring a comparison is R-VIS-043's (zero-anchored, truncation barred for difference questions); the number a bound chart must end at is R-VIS-002's; the title's wording is R-SYN-013's.
- Reason: a difference read off two ramps requires the mechanism ("last month climbed higher") to be explained before the chart answers; the filled region answers in one glance, and a zero-anchored slope keeps a claimed percentage the visible slope.
- Exceptions: a sparkline inside a block whose printed number carries the magnitude (R-SYN-013's micro-label); an exploratory surface where the user brings the question.
- Tradeoff: a filled band spends one more channel; when only the delta matters it replaces the second line rather than adding to it.
- Alternative: Two series with the gap annotated at the endpoint — data, not fill — when the chart library cannot fill between series.
- Near miss: R-VIS-004 owns chart type and tokens; this card owns whether the comparison itself is in the marks.
- Check: Hide the title and state the takeaway from the marks alone — if it needs the mechanism explained, it fails. A difference question answered by a min-anchored or normalized pair of ramps fails.
- Strength and units: conditional heuristic; no measured comprehension lift.
- Trail: two-site council round 2026-11-11 (the operations app G4; NotebookLM kpi/dark answers 2026-11-11); see [sources.md NOTE-v10.8-council](sources.md#note-v108-council).

---

## What this file does not settle

1. No rule here is validated on a second product; the sources are practitioner videos and one vendor session, not experiments.
2. R-SYN-015's callout needs a product-defensible rule behind it (see the R-INF-012 near miss); without one the honest state is the notable fact, and a fabricated recommendation is worse than none.
3. Whether sentence titles lift comprehension on this product is unmeasured; R-SYN-013 is a floor for wording, not a performance claim.
