# Geometry encodes meaning

Part of [visual-craft.md](../visual-craft.md). Read the index first; open this file only when its pattern applies. Why each rule exists: [evidence.md](evidence.md).

## R-VIS-008

**Every column gets an explicit share; one column absorbs slack; the action column is sized from its control.**

- Scope: data tables with a per-row action.
- Action: fixed layout with percentage shares summing to 100; the action column's share derived from its control width plus padding; exactly one content column takes the largest share; below the width where shares fit, switch to the stacked layout rather than squeezing. Forms follow the same anti-squeeze principle: a form that renders too small for its fields (a New Charge form in the round) is a layout defect, not a style choice.
- Reason: slack has to land somewhere; between the last fact and the action it reads as an empty strip, inside one content column it reads as air.
- Exceptions: two-dimensional data keeping native proportions may scroll instead of reflowing; order-critical audit tables may keep auto layout in a scroll container.
- Tradeoff: fixed shares can waste space on short content; the flexible column absorbs it.
- Check: measure each cell at 1280, 1440, 1920 and the narrowest supported four-column width; no clipped controls, no row-height jumps.
- Near miss: a short uniform table needs no shares at all.

## R-VIS-009

**A row action is a labeled control in a reserved column; identical actions keep identical width; rows without the action leave the cell empty.**

- Scope: operational lists with one action per row.
- Action: verb-labeled control, right-aligned, one size across all rows; empty cell (not a dash) where the action does not apply; icon-only triggers need a header label, tooltip, and accessible name.
- Density: solid primary (brand-fill) buttons appear at most once per view, reserved for the urgent state the view exists to act on (an expiring lease, an unread request); recurring per-row actions use the outline or ghost variant, or the named menu under Exceptions. A column of N solid buttons reads as N primary calls to action, which the view does not have.
- Reason: a consistent column of named controls is scannable; mixed widths or ghost icons read as noise.
- Exceptions: several secondary actions per row may use a named menu with an accessible name.
- Tradeoff: labeled buttons cost horizontal space an icon would not.
- Check: measure every action control's width at 1440; one value; permission-empty rows have no disabled ghost.
- Near miss: an icon-only action is fine when header, tooltip, and accessible name all name it.

## R-VIS-011

**The page hangs on one alignment rail: breadcrumb, page title, and table left edges share one x; a control sits next to the region it controls.**

- Scope: page chrome on operational surfaces: breadcrumb, page header, primary content container, shell controls.
- Action: (1) one content-rail token drives the left edge of breadcrumb, page title, and the primary content block; verify the computed x values match at every breakpoint, not just at design width; (2) a control that affects a region lives adjacent to that region — the sidebar toggle belongs at the sidebar's edge, a column filter at that column's header; (3) a misalignment measured at one width is a defect even when every element is individually correct.
- Reason: the eye checks the left rail first; a 12px step between breadcrumb and title reads as unfinished even when no single component is wrong. Distance between a control and its target breaks the cause-effect reading.
- Exceptions: full-bleed surfaces (boards, maps) may define their own rail; drawers and overlays align to their own container, not the page rail. Where the page gutter cannot hold the shell toggle (usually phones), a top bar may lead with the toggle, as the Material top app bar does: the toggle's icon stands on the rail within 2px and the bar's title follows it; the h1 and the content still share the rail.
- Tradeoff: a strict rail forbids some expressive compositions; that is the point on operational surfaces.
- Check: at 1440 and one narrow width, read the computed left offsets of breadcrumb, h1, and content; assert one value. Locate each shell control and name the region it controls.
- Near miss: an intentionally inset quote or aside may break the rail once per page, not per row.

## R-VIS-017

**Spacing sits on a 4/8-point grid and a page uses at most six type sizes, with dashboard headings capped near 24px; no more than 40% of rendered characters are under 13px.**

- Scope: new pages and repair passes where the design system's own scale already encodes the grid; this rule audits against it rather than inventing new steps.
- Action: (1) read the system's spacing scale and confirm every gap is a scale step (in Tailwind, that is the default 4px-based scale — no `p-[18px]`); (2) count distinct computed font sizes on the page: at most six, and a dense operational page should keep its largest heading near or below 24px, letting the KPI statistic (R-VIS-010) be the one larger element; (3) grid columns follow the system's responsive utilities, not per-page column counts.
- Reason: a grid and a size cap are cheap insurance against the drift that per-page improvisation produces; the corpus repeats them across at least three independent sources, and the measured the rental app round agrees.
- Exceptions: showcase surfaces (landing, editorial) may exceed the 24px cap deliberately; a display moment is a decision, not a default.
- Tradeoff: a size cap constrains expressive hierarchy; operational surfaces rarely regret it.
- Check: count computed font sizes on the rendered page (target ≤6); list the largest heading size on operational pages; grep the diff for arbitrary spacing values. Responsive-direction audit: list computed paddings and heights at 1440 and 390 — a value that grows as the viewport shrinks (`px-12 md:px-0`), or a fixed pixel height on a responsive container, fails unless the reason is stated.
- Near miss: six sizes is the cap, not the goal — the measured page used four.

## R-VIS-026

**Numeric columns are right-aligned so digits compare by place value; record names are left-aligned and carry the row's weight.**

- Scope: any data table or metric card showing quantities, money, or counts.
- Action: (1) right-align every numeric column so units, then tens, then hundreds stack vertically; (2) left-align record names and set them at the row's strongest text weight so the eye anchors on the entity first, then scans right to the numbers; (3) pair with tabular figures (R-VIS-005) so alignment survives live updates.
- Reason: place-value alignment lets the eye compare a column of amounts without reading any of them; center- or left-aligned numbers destroy exactly that.
- Exceptions: single-value KPI blocks (R-VIS-010) center or left-align by composition, not by accident.
- Tradeoff: right-aligned headers over right-aligned numerals look odd at first; headers follow their column's alignment or use the label grammar of R-VIS-015.
- Check: in a rendered table, confirm every numeric cell's right edge aligns and record names share one weight distinct from body cells.
- Near miss: an ID column formatted as a number is an identifier (R-VIS-005) and left-aligns with the mono font, not as a quantity.

## R-VIS-028

**The gap encodes the relationship: a label sits tight to its value, values sit close inside a group, groups sit far apart — three proximity tiers, no values between.**

- Scope: composed pages, forms, tables, card interiors.
- Action: (1) assign every gap to one of three tiers: within a label-value stack (tightest), within a group (middle), between groups (widest), using the system's spacing scale; (2) when unsure whether two things belong together, set the gap first and let the answer read off the page; (3) prefer a wider tier gap over a divider line when grouping alone would do.
- Reason: the reader uses distance as the grouping signal before reading a single word; a gap that matches no relationship teaches the wrong grouping.
- Exceptions: dense grids where tier gaps cannot fit may reintroduce separators (R-VIS-016's tradeoff) rather than compress tiers.
- Tradeoff: strict proximity can leave a page looking under-filled at low content density; widen the top tier, never insert middle values.
- Check: measure the three tiers on one page; confirm each gap belongs to a tier and no gap sits between two tiers (R-VIS-016's no-in-between rule).
- Near miss: a 1–2px optical nudge against an icon is a correction, not a fourth tier.

## R-VIS-039

**Cells in one table row follow one vertical model: every first line on one line, or every block on one centre, never a mix.**

- Scope: data tables and lists with mixed cell content: text, avatars, badges, buttons.
- Action: (1) choose one model per table: `vertical-align: baseline` when any cell wraps to two lines, middle when every cell is one line; (2) controls and avatars take their baseline from their label: an icon-led button takes its icon out of flow, and an identity cell aligns the avatar to the name with `align-items: baseline`; (3) measure the first-line centres across the row after the change, because the fix itself can move a cell.
- Reason: the eye reads a row along one line. A control a few pixels off that line reads as belonging to the next row, or as broken.
- Exceptions: a card-mode row on narrow screens (header hidden) stacks its content and has no shared line.
- Tradeoff: baseline alignment can push a 32px avatar a few pixels below its two-line block; the name, not the avatar, is what the row reads.
- Check: `render-audit.mjs` reports R-VIS-039 when the first-line spread and the block-centre spread both exceed 3px in any row.
- Near miss: a whole row middle-aligned against a two-line cell is a consistent model and passes.

## R-VIS-050

**The page frame does not move between pages.**

- Scope: app shells with a sidebar or header and pages of different lengths.
- Action: (1) find the element that actually scrolls — the root, or an inner main inside a fixed shell — and reserve its scrollbar gutter (`scrollbar-gutter: stable` on that element) so a short page and a long page have the same content width; when the root never scrolls, reserve the gutter on the inner scroller that appears and disappears between pages; (2) table cells, toolbars and pagers inside a panel use the panel's own inset (one token or shared class), so the first column lines up with text in a plain panel; (3) within one page, R-VIS-011 owns the rail; what this card adds is between pages: the header and first panel sit at the same x on every page of one shell.
- Reason: switching pages is a before/after comparison. A 15px jump of the right edge or a 4px shift of the first column reads as a different, broken page even when each page looks fine alone.
- Exceptions: phones with overlay scrollbars need no gutter; the rule still holds for insets.
- Tradeoff: a stable gutter leaves an empty strip on short pages on desktop systems with classic scrollbars.
- Check: source first — name the element that scrolls in this shell and confirm the gutter is reserved on it. Then open two pages of different length at 1366x700 with scrollbars visible (Playwright: launch with `ignoreDefaultArgs: ['--hide-scrollbars']`); the scroller's `clientWidth` is the discriminator and must match, with the h1 left edge and first table cell text left edge as the inset checks.
- Near miss: a full-bleed map or canvas page may drop the panel inset; it still keeps the header and gutter.
