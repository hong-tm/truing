# Capability survives transformation

Part of [visual-craft.md](../visual-craft.md). Read the index first; open this file only when its pattern applies. Why each rule exists: [evidence.md](evidence.md).

## R-VIS-003

**An interactive table keeps its controls: search, filter, and sort are never dropped in a redesign, and on wide tables they attach to the columns they act on.**

- Scope: operational data tables with more than roughly ten rows or multiple columns.
- Action: (1) inventory the source page's table controls before restyling and carry every one through the redesign; (2) prefer column-header-embedded filter and sort affordances over a separate filter bar when columns are the filter dimensions; (3) a redesign that simplifies the chrome but drops a working control is a regression, not a cleanup.
- Reason: stripping controls while polishing the frame is the "stripped-controls fallacy": the table looks better and does less.
- Exceptions: a read-only summary table of five rows may need no controls; a destructive-control removal still needs the owner's decision (workflow rule, not this card).
- Tradeoff: header-embedded filters cost header complexity; keep one icon, one affordance per column.
- Check: list the source table's controls and the redesigned table's controls side by side; confirm none missing and each reachable in one click.
- Near miss: adding controls the source never had is a feature decision, not a rule violation — flag it, do not silently add it.

## R-VIS-006

**Row height comes in exactly two density tiers; within a surface, one tier applies everywhere.**

- Scope: table and list rows across an operational product.
- Action: define at most two row-density tokens (for example compact and comfortable) derived from the system's spacing scale; a surface picks one and applies it to every row; row height may vary with content (a second meta line), never with alignment or per-row styling; padding, not line-count luck, sets the rhythm (kept from the measured the rental app table: 20px vertical padding, top-aligned cells, stable 85px rows).
- Reason: four heights read as four different products; two named tiers are learnable and defensible, everything in between is drift.
- Exceptions: a dense financial grid may justify a third, owner-approved tier.
- Tradeoff: two tiers can under-serve an unusual surface; that surface argues for a token change, not a one-off height.
- Check: measure row heights across pages; every value must match a named tier token.
- Near miss: a single-line numeric table with centered cells (spreadsheet feel) is a tier choice, not a violation.

## R-VIS-023

**When a table collapses to cards on mobile, the table header disappears entirely and each card inlines its own labels.**

- Scope: responsive conversion of data tables below the width where columns fit.
- Action: a list of comparable records may instead become two-line rows below about 640-768px (identity and key figure on line 1, the other fields in small muted text on line 2, nothing dropped), which scans faster than labelled cards; a table may stay a table only if it scrolls inside its own frame. Never leave a clipped table. For cards: (1) at the card breakpoint, remove the shared table header — the card layout replaces it; (2) inside each card, inline every field with its own micro-label (R-VIS-015 style) in a key-value reading order; (3) record ID plus row actions go in the card header; (4) keep search/filter/sort reachable at the top of the viewport (R-VIS-003 still applies on mobile).
- Reason: a column-header strip with no columns under it is a leftover from a layout that no longer exists; it answers a question the cards already inline.
- Exceptions: a card list that keeps genuine multi-column rows at that width is not a conversion and keeps its header.
- Tradeoff: inlined labels cost vertical space on every card; the alternative (a floating header) costs comprehension.
- Check: at 390px, confirm no table-header strip remains above card lists; read one card top to bottom and confirm each value has its label.
- Near miss: one sticky toolbar holding search and filters is not a table header and must survive. A value that splits inside a cell at any width is R-VIS-005 clause (5), not a header problem.

## R-VIS-032

**A form mirrors the output it produces and opens with the high-probability answer already selected.**

- Scope: create and edit forms on operational surfaces.
- Action: (1) order and shape fields to match the record the user will see after saving — same field order, same grouping, same label grammar; (2) preselect the most likely value for each field where a defensible default exists, and show the terms of the default next to it; (3) choose input controls by entry precision and frequency, exact values get text or stepper inputs, never a slider; (4) a constrained field and its "Other" free text are two controls: the free text appears only when Other is chosen and writes to its own field — the enumerated value survives; a free-text box that pre-fills or overwrites the enum fails.
- Reason: a form whose structure matches its result lets the user verify by recognition instead of re-reading; and since most users keep defaults, a wrong default is a decision made for them.
- Exceptions: search and filter forms (no persistent output); legally required neutral defaults.
- Tradeoff: mirroring locks field order to the output layout; when the output itself is being redesigned, mirror the new order, not the legacy one.
- Check: place the rendered form beside the rendered record it creates; confirm same order and labels; list every defaulted field and its rationale. Choose Other, type a custom value, submit, and read the saved record: the category is still an enum value and the custom text sits in its own field.
- Near miss: a smart default the user cannot see (hidden state) is not a default, it is a silent decision — surface it or remove it.

## R-VIS-034

**A wide table stays scannable by showing summary fields and moving detail to a row-level view; time-derivable data rolls up into sparklines and status columns.**

- Scope: tables whose natural column count pushes past comfortable scanning (roughly eight to ten columns) or whose columns carry derivable detail.
- Action: (1) keep in the row only what the reader compares across rows: identity, one or two key facts, status, action; (2) derivable history becomes a sparkline or a status chip; granular attributes move to a row-level detail (expansion, dialog, or drawer) reachable from the action column; (3) when removing a column from the row, keep it reachable — the detail view inherits the rest.
- Reason: a table with every attribute competes with itself; the scan compares rows, the detail view explains one — those are two different layouts, and the slim-table-plus-detail pattern gives each its own.
- Exceptions: audit and reconciliation tables that must show every stored field inline, in a scroll container (R-VIS-008's exception).
- Tradeoff: moving detail behind an interaction costs a click for full inspection; the comparison task it preserves happens on every page load.
- Check: count the table's columns; list which are comparison fields and which moved to detail; open one row's detail and confirm every removed column is present.
- Near miss: R-VIS-005's mobile stacking and this card's desktop slimming serve the same goal at different widths; both can apply to one table.
