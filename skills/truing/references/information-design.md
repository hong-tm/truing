# Information design for operational pages

Read this first for any dashboard, list, ledger, board or detail surface. It answers: what must this page help someone find, compare, decide and do, and how do they get from a summary to the records behind it?

Styling comes after this file. A page that passes here and looks plain is acceptable. A page that looks designed and fails here is not.

Evidence labels: **owner** = stated by the product owner in a blind comparison of four builds (the rental app, 2026-11-06; one person, one product). **corpus** = the NotebookLM extraction, practitioner advice, not measured. **doc** = published product or design-system documentation. These are heuristics, not measurements. Links are in [sources.md](sources.md#information-design-sources).

## Contents

- [Start with the task map](#start-with-the-task-map)
- R-INF-001 Overview shows what needs a person now
- R-INF-002 Every number opens its records
- R-INF-003 A list opens with its own summary
- R-INF-004 List tools match how the records get looked up
- R-INF-005 Colour marks a different action
- R-INF-006 Highlight on request, stay neutral by default
- R-INF-007 Every mark carries something the text does not
- R-INF-008 One action, one control
- R-INF-009 Time-shaped data gets a time shape
- R-INF-010 Peek first, and keep peek stable
- R-INF-011 The shell finds and counts
- R-INF-012 Say what a number counts
- R-INF-013 A problem on screen has a real next action
- R-INF-014 One name per state on every page
- R-INF-015 Selection is a state with a scope
- R-INF-016 A search that matches nothing is a failed lookup
- R-INF-017 A record page leads with identity, status and its actions
- R-INF-018 Each role gets its own task map
- R-INF-019 The page keeps its priorities at the data's extremes

## Start with the task map

Before any layout change, write one table for each page. Include it in the report.

| Who comes | To answer or do what | Records behind it | Next action | Where the full list lives |
|---|---|---|---|---|

Completion criterion: every block on the page maps to a row, and every row has a next action or an explicit "read only". Delete, merge or demote blocks with no row, subject to the preservation rule in SKILL.md.

Then read two things about how the data is used:

- **Recurring lookups:** the names, statuses, dates and groupings people use to find a record. These become search, sort, tabs and filters (R-INF-004).
- **Real states:** list every state the data holds, then group them by what the person does next. Two states with the same next action are one state (R-INF-005).

## R-INF-001

**An overview shows what needs a person now, with the records named, before it shows totals and trends.**

- Action: Put a short named list (who, which record, how urgent, the action) above or beside aggregates. Rank modules by how often and how urgently they get used. Each module ends in a path to its full list.
- Evidence: owner liked a dashboard that listed expiring customers and upcoming appointments directly, and called "Open in full list" and "View more" good. corpus: rank by functional priority, top-left first (Finance Dashboard redesign). doc: frequently checked dashboards should be "denser, more glanceable" (Linear).
- Near miss: a strategy page reviewed monthly can lead with trends and annotations.
- Check: from the first viewport, name the next three people to contact without opening another page.

## R-INF-002

**Every aggregate opens the records behind it.**

- Action: Make counts, chart segments, legend items and sidebar badges links or filters that land on those exact records, with the filter visible. The landing count must equal the number clicked.
- Evidence: doc: Linear Insights drill down from a segment by filtering the view, and the table mirrors the graph. owner liked the nav badge showing 2 appointments to handle. corpus: Apple charts, small preview opens a detail view.
- Near miss: a figure with no record list behind it, such as a static capacity limit, stays plain text.
- Check: click each number; compare landing count and active filter.

## R-INF-003

**A list opens with a summary of its own records, and the summary is the way in.**

- Action: Above a list, show the few counts or groupings someone would otherwise work out by reading rows: how many need attention, how many belong to one customer, how many are in each state. Prefer counts that double as filters.
- Evidence: owner liked the lease counts, the customers-with-several-stalls strip and the attention card. corpus: show result yield on controls before selection (INSANE Gap).
- Near miss: a short list of five records needs no summary. Do not add one to fill space.
- Check: each summary figure answers a named question in the task map and equals the rows it filters to.

## R-INF-004

**List tools match how the records actually get looked up.**

- Action: Provide search over the fields people recall, sort on the fields people rank by, and tabs with counts for the states people switch between. Tabs for exclusive states, filters for combinable attributes, header filters on wide tables. Default the sort to the most urgent order. Keep group headers visible when grouping. When filters apply as a batch (a sheet or drawer with one confirm control), that control states the result count ("Show 41 records"), so the person sees an over-narrow filter before leaving the sheet.
- Evidence: owner liked sort, tabs and search on the tenant list, and said a list with only one highlight was unremarkable. corpus: header filters (Why Data Table Filters Work Better in Headers), interactive tables (Dashboard UI in 8 minutes), top 20% filters on the primary view (WWDC17). doc: Linear separates filters, which refine the list, from display options, which change what each item shows.
- Near miss: a chronological audit log keeps its order. A ten-row settings list needs no tools.
- Check: complete three real lookups by name, state and urgency; each takes one control.
- Check: change each filter while on page 2 or later: the list returns to page 1, and every tab count equals the rows that tab shows under the current filters.

## R-INF-005

**Colour marks a different action. States that lead to the same action share one colour.**

- Action: Sort states by next action, not by database value. Give strong colour only to states that need action now, a quiet tone to what is merely available, and neutral to everything else. Split a state only if a person acts differently on it. Show plain text when no action follows: a settled state ("Paid", "No bill") is plain text or the badge's quiet variant, never a disabled button and never a saturated fill. When this ordering and R-VIS-001's severity order disagree, this one decides which state gets the strong variant; R-VIS-001 owns the component and its legibility.
- Evidence: owner, on three of four builds: too many colours and states on the occupancy and stall views. doc: Carbon: avoid status indicators "when no user action is required", plain text instead, and more than five or six "can overwhelm users". corpus: neutral chips by default, colour only for active states (weirdly perfect UI).
- Near miss: a heatmap or chart whose colour encodes a measured value is data, not status.
- Check: for each colour in view, state the action it asks for. Two colours with the same answer merge. A page whose default view is mostly saturated tiles fails. A settled state rendered as a disabled control fails here (it is text); the disabled-control walk itself is R-VIS-020's, and a control the role can never enable is R-INF-018's.

## R-INF-006

**Highlight on request. The default view stays neutral, and choosing a category lights up its members.**

- Action: On boards and maps, render items neutrally with their state in text or a small marker. Selecting a state, tab or legend item highlights its members and dims the others, and the selection is visible. Default selection is the one the page's job needs.
- Evidence: owner liked choosing a category to get automatic highlighting, while disliking the same page's many default colours. doc: Linear Insights highlights related rows on hover or selection.
- Near miss: one urgent state may stay coloured by default if it needs action now.
- Check: each state can be highlighted and cleared by keyboard and pointer, and state stays readable with colour removed.

## R-INF-007

**Every mark carries something the text beside it does not.**

- Action: For each bar, strip, dot or icon repeated in rows, name what it adds. Remove it if the adjacent text already says the same thing, or if readers cannot compare it across rows on a stated scale.
- Evidence: owner, on two builds: the coloured bars in each lease row had no real use.
- Near miss: a bar with a stated, shared scale that lets people compare rows quickly, such as usage against a quota.
- Check: remove the mark and answer the row's question. If nothing is lost, it stays removed.

## R-INF-008

**One action, one control.**

- Action: Do not offer one action twice in a row or panel. A menu with one item is a button. Keep a visible button for the frequent action, and a menu only for two or more further actions.
- Evidence: owner, on one build: Remind beside a menu whose only item sends a reminder, "多此一举". corpus: at most 2 header CTAs (6 Things), one primary per card (Turn Claude Code into a Design Genius).
- Near miss: a global create button plus an empty-state create button are in different contexts and both stay.
- Check: list each row's controls and menu items. No two perform the same operation, and no menu has one item.

## R-INF-009

**Time-shaped data gets a time shape.**

- Action: Show appointments, due dates and bookings as an agenda or calendar strip when people plan by date, and sort by proximity. Use absolute date plus relative time when urgency matters.
- Evidence: owner liked appointments presented like a calendar and a direct upcoming list. corpus: move time-delineated data to timelines (3 dashboard UI flaws).
- Near miss: a list with two or three items needs no calendar grid. An agenda is enough.
- Check: answer "what is on next Tuesday?" and "what is next?" at a glance.

## R-INF-010

**Peek first, and keep the peek stable.**

- Action: Use one level of detail on hover or focus, near the item, and full detail in a designed panel on selection. A peek uses the app's neutral surface tokens in both themes, not a brand fill and not an inverted one. Moving between adjacent items updates the content in place. Never fall back through the idle state in the gaps between items. Keep a side sheet's fields grouped by task, with its actions at a stable place. A peek is hidden until pointer or focus arrives — a tooltip open on load, before any hover or focus, is a defect on any chart or dense grid.
- Evidence: owner: tooltip stayed white in dark mode; tooltip "太丑"; content "一闪一闪" while hovering across stalls; a centred tooltip was only so-so; the side sheet needed rework. corpus: adjacent tooltips appear instantly after the first (Why the best software must LIE), popover and modal hierarchy (Dashboard UI in 8 minutes).
- Near miss: a static explanatory tooltip on one icon has no sweep to stabilise.
- Check: run `scripts/roughness-probe.mjs` (overlay-theme, overlay-fill, hover-idle-flash), then look at it in both themes. Before the first hover or focus, no tooltip is open.

## R-INF-011

**The shell finds and counts.**

- Action: Group navigation by task, and show pending counts on the items that have work waiting. Provide a jump control (Ctrl/Cmd K) once the product has enough pages to warrant it, backed only by real pages and records. The sidebar scrolls independently and keeps the account and rare items reachable at short window heights.
- Evidence: owner liked the Quick Access control and the appointments badge, and reported a sidebar scrolling problem on one build (exact behaviour not yet reproduced). corpus: sidebar as the global spine with rare items at the bottom (Dashboard UI in 8 minutes).
- Near miss: a three-page tool does not need a command palette.
- Check: with the window 560px tall, reach every nav item and the account menu. Open the jump control by keyboard, reach a page and return focus.

## R-INF-012

**Say what a number counts.**

- Action: When two reasonable definitions exist, show the parts instead of picking silently, for example "16 of 20 let, 2 past end date". Use the same definition across overview, list and board. Pair key numbers with one comparison where it helps the decision.
- Evidence: the rental app builds showed 80% and 70% for one occupancy because they counted expired leases differently. doc: Linear pairs key numbers with context such as this week versus last week.
- Near miss: "Consider expanding capacity" under a number is advice with no basis unless the rule behind it is stated. Remove it or state it.
- Check: the same concept produces the same figure on every page, and the label states the denominator.

## R-INF-013

**A problem on screen has a real next action, next to it.**

- Action: For each overdue, unpaid, pending or failing record, give the action that moves it on in the same row or panel, so the person handles it where they see it. Use only actions the backend supports. If the action that finishes the job does not exist (for example, no admin mark-paid endpoint), offer the nearest real one (a reminder through an existing email endpoint) and report the missing endpoint as a product gap. Never add a button that only looks like it works.
- Evidence: owner, the rental app round 2 (2026-11-08): three independent reviewers found unpaid utility bills that could only be read; the fix was a Remind button on the existing reminder endpoint, and mark-paid was reported, not faked. corpus: Touch-It-Once (商业思考 notebook): handle an item at the point of first contact.
- Near miss: a read-only report page with no owner action passes when its task-map row says "read only".
- Check: for every attention state in the task map, name the control that acts on it on the same screen and the endpoint it calls — one the caller's role may actually call (a control that returns 403 for this user is not a real action). When the endpoint or its permissions cannot be observed from the source, record the action as unverified, not clean.

## R-INF-014

**One name per state, on every page.**

- Action: List the raw values of each status field, including null and false, and map each to one label. Use that label and tense on the overview, list, board and detail; the badge variant (colour) is owned by R-VIS-001. For a derived status, state the predicate: one predicate per label, so the same input always produces the same label. Put the mapping in one shared helper.
- Evidence: the rental app E3 (2026-11-08): the overview showed rejected appointments (`false`) as "waiting for reply" because it treated null and false the same, while the list said Pending/Approved/Rejected; stall tiles said "N days over" while the tenant list said "Ended N days ago".
- Near miss: a short form ("3d over") on a dense tile is fine when it is the same state and wording family as the long form.
- Check: for each status field, grep the labels used across pages; each raw value — or each predicate result, for derived statuses — maps to exactly one label and one badge variant on every page. When the raw values or the predicates cannot be observed from the source, record the mapping as unverified, not clean. A page that shows the record but omits its state word also fails: a missing label is not a consistent label.

## R-INF-015

**A selection is a state with a scope: the rows show it, one bar names the count and the object, and every action in the bar acts on exactly that set.**

- Action: (1) selected rows keep a visible tint while the list scrolls; (2) while anything is selected, one bar shows the count and the object ("3 bills selected"); (3) each action in the bar carries verb and scope ("Remind 3 selected") and operates on exactly the selected set; (4) one control clears the selection and the bar leaves at zero; (5) when a filter is active, the bar says whether an action means the selected rows or all rows matching the filter.
- Evidence: corpus: contextual bulk-action bars on multi-item selection [batch 7, "EVERYTHING you need to know to build a Dashboard UI in 8 minutes"]; a soft tint across selected rows for instant feedback, and text paired with icons on bulk action buttons [batch 21, "UI Design Tips for a Better Data Table UX"]; checkboxes as the control type for multi-select [batch 17, "The Easy Way to Design UIs"]. Clause (5) is synthesis, unvalidated.
- Near miss: R-VIS-009 owns the single-row action column; R-VIS-007 owns an action label's object; R-SYN-019 owns batch confirm and undo; R-INF-004 owns the filters. A list that offers no multi-select needs none of this.
- Check: select rows, scroll (tint persists), read the bar (count and object), run each action against a copy of the data (exactly the selected set changes), clear (the bar leaves).

## R-INF-016

**A search or filter that matches nothing is a failed lookup, not an empty dataset.**

- Action: On zero matches, (1) restate the query and show the active filters; (2) give one control that clears them and returns to the full list; (3) offer what the product can compute: a corrected spelling, the count without filters, or the nearest broader group. Keep this state separate from the first-use empty state (R-VIS-031), which teaches how records arrive.
- Evidence: measured: Baymard, "No Results" pages: about half of benchmarked sites leave the person at a dead end, and generic search tips are rarely read ([source](https://baymard.com/research-articles/no-results-page)). corpus: apple_design_all_in_one.md separates an empty view from an empty search result. Proposed independently by two council reviewers (2026-11-10).
- Near miss: a list that is empty because no record exists yet is R-VIS-031, with a create action, not a clear-filters action.
- Check: search each list for a nonsense string, and filter to an empty combination. The page names the query and filters, one control restores the full list, and no state is a bare "No results".

## R-INF-017

**A record page leads with identity, status and the actions on the whole record, in one header.**

- Action: The header holds the record's name, its state in the shared badge (R-VIS-001), the labelled way back to the list (R-SYN-020) and the one frequent whole-record action; rarer actions go in one menu — with exactly one rarer action, a button (R-INF-008), never a one-item menu. Below it, what defines the record takes the wide column, and metadata, history and related records take the narrow one or follow after. The header action stays reachable while the body scrolls on long records. No action sits only at the bottom of the page.
- Evidence: doc: Shopify Polaris, resource details layout: the page header "spans the full width of the page to show merchants that these actions represent the page as a whole", with a two-thirds primary column ([source](https://polaris.shopify.com/patterns/resource-details-layout)). corpus: "A Better UX Design for Large Data Tables" (overview versus detail). Proposed independently by two council reviewers (2026-11-10); R-VIS-034 only says when detail leaves the table.
- Near miss: a peek panel or drawer (R-INF-010) is a summary, not a record page; it needs the name, state and one action, not two columns.
- Check: open a record from a list at 1440 and 390. Name, state and the main action are visible without scrolling; scroll to the bottom and the action is still reachable; going back lands on the list with filters intact.

## R-INF-018

**Each role gets its own task map, and every task on it is reachable from that role's shell.**

- Action: Write the task map once per role that can sign in. For each row, confirm the role's navigation reaches it. A control the role can never use is left out or replaced by a line that says who can do it ("Ask an admin to change the rate"); it is not a disabled button (R-VIS-020, R-VIS-009). Disable a control only for a condition this person can change, and state the condition beside it. Labels show product words, not raw enum values ("Tenant", not `rental`).
- Evidence: field test, the rental app tenant and user roles (2026-11-10): giving feedback was possible only from the signed-out page, 7 of 9 controls on the tenant bills page were disabled buttons for settled states, and the profile showed "Role: rental". doc: Dynatrace interaction states allows hiding when elements "don't provide value for the user" and requires a visible reason on anything disabled ([source](https://developer.dynatrace.com/design/foundations/interaction-states/)).
- Near miss: an upgrade or request path may show a locked feature on purpose; it states the unlock step, so it is not a dead control. A control disabled for a condition this person can change is R-VIS-020's, not a role defect.
- Check: sign in as each role. Walk that role's task map from its own navigation; every row is reachable. List the disabled controls and name the step that enables each. Grep rendered labels for raw role or status enum values. When the roles or their permissions cannot be observed from the source, record the role walk as unverified, not clean.

## R-INF-019

**The page keeps its priorities at the data's extremes: none, one, many, missing, and the largest realistic value.**

- Action: Keep the task map's priorities at each of five data points.
  1. **None.** An attention block with nothing due becomes one quiet line that says so ("No overdue bills"). It does not hold the top slot as a large empty frame; the next block moves up. A list or chart with no records yet is R-VIS-031. A lookup that matches nothing is R-INF-016.
  2. **One.** A count and its noun agree ("1 bill", not "1 bills"). A summary strip, legend or grouping with one member becomes the plain fact, unless the person filters or acts with it.
  3. **Many.** A preview block on a page with other blocks shows a fixed number of records in R-INF-004's sort order, with the count of all of them (R-INF-003) and the way to the full list (R-INF-001). It stops before it pushes the task map's must-see rows or the main action out of the first viewport. Balancing the cap across a card grid is R-VIS-042's.
  4. **Missing.** A field the record does not have shows the product's one "not set" mark, the same on every page; where the product tells unknown from not applicable, each keeps its own mark. A status field's missing value is a state with its own label (R-INF-014). Raw `null`, `undefined`, `NaN`, a bare `true` or `false`, `Invalid Date`, `[object Object]`, a replacement character (�), a currency sign with no amount, or an unfilled template key never renders. An unknown value is never shown as 0 or summed as 0; a total over partly missing values says it covers the known ones.
  5. **Largest.** The largest realistic value keeps its row aligned and its action visible: the column keeps its alignment and the row its baseline (R-VIS-026, R-VIS-039). Format and truncation are R-VIS-005's and R-VIS-030's.
- Evidence: owner, 2026-11-16, on a redesign whose checks were green: "感觉没变好呢，空间利用变差了。内容不对齐，有乱码". Empty space, misalignment, clipped labels and garbled text showed only at production data volume. The five points are synthesis, unvalidated.
- Near miss: a zero the data holds (a counted 0 open tickets) is a real value and shows as 0. A fixed-length series (twelve months) has no "many" end.
- Check: seed or route the data for each point: none, one, more than the block shows, a record with every optional field empty, and the largest realistic value (a seven-figure amount, a 120-character name, an unbroken URL). Then one near-production mix of many, long and partly missing. Screenshot each at 1440×900 and 390×844. At each, the task map's must-see rows and the main action are in the first viewport, and the blocks shown keep their relative order (at 390 a lower block may drop below the fold). A preview's count matches the full list's total, and its path opens that list. Every count noun agrees with its number. Grep the rendered text and field values for the raw forms in point 4 (render-audit reports most of them as R-INF-019). Each match fails unless the page means to show it, as a developer tool shows `null` in a `code` element; name each such match. Name a point the data cannot reach as skipped, and one you could not build as unverified.
