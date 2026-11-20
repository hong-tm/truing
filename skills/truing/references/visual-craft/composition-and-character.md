# Composition and character

Part of [visual-craft.md](../visual-craft.md). This is the pass that follows hygiene. The other six patterns make a surface correct. This one decides whether it looks designed. Why each rule exists: [evidence.md](evidence.md).

## R-VIS-036

**Each screen has one focal moment, built as a deliberate contrast of scale and density against a quieter field.**

- Scope: any composed page after the structure is settled, operational dashboards included.
- Action (choose a page shape first, then build the focal moment positively, not only by quieting the rest):
  1. **Pick the shape from the job**: board, ledger, overview, form, or story ([table and wireframes](../../examples/composition-pass.md)). The shape names the focal block.
  2. **Build the focal block up**: the focal block holds at least 45% of the first viewport's height (a board or table usually more; `render-audit` measures it). Give it the largest scale or the most air; everything else is caption-scale context.
  3. **Then quiet the field**: remove competing weight from secondary regions, such as filled cards, a second large number, or extra accent color.
  4. **Check across pages** (R-VIS-044) before reporting: open the thumbnails side by side; every page's focal block should be identifiable in the small render. Demoting everything is not composition — a page of quiet blocks with one medium number still fails this rule.
- System bound: keep the contrast inside the system's own scale (R-VIS-000, R-VIS-027).
- Reason: a page where every block has equal weight reads as a list of parts, not a composition. The eye needs one entry point before it can read the rest.
- Exceptions: a pure data-entry form or a settings page has no focal moment by design. Use its primary action as the anchor and do no more.
- Tradeoff: emphasis on one element demotes others; confirm with the owner when two elements claim the same priority (Truing step 3).
- Check: blur the screenshot (about 8px Gaussian blur) or squint at it. Exactly one region is still identifiable in the blurred image. If two regions compete, or none stands out, the check fails. This is a judgement on a screenshot, not a timing measurement; `render-audit` only measures the 45% share.
- Near miss: a dashboard with a large KPI row and a large chart side by side fails even when both are well made. Two equal heroes do not make a focal moment.

## R-VIS-037

**Character comes from one signature drawn from the product's own tokens, used at full strength in a few chosen places; stripping color to look "clean" is a regression, not restraint.**

- Scope: any surface that has a brand or primary token, or sits inside a product that has one; repair passes that are tempted to neutralize everything.
- Action: (1) find the signature the product already owns, such as the primary color, the logo hue, the system radius, or the display face; (2) apply it at full strength to one element class only, for example primary actions and the key chart series; (3) keep structure neutral (R-VIS-018), but never set the signature to grey; (4) when a pass removes hue, list each removal and its reason in the report; (5) define the signature once, as one brand variable per theme, and derive the places from it (primary action, first chart series, focus accent). Two literals of the same hue in two tokens are two signatures waiting to drift (R-VIS-000); (6) on a generated surface, name one decision only this product would have made — a look a model would produce unprompted is a template, not a signature.
- Reason: restraint means giving color fewer jobs, not taking color away. A product with no signature looks like a template, however tidy it is.
- Exceptions: a brand that is monochrome by definition. Its signature is then type or geometry, and the same one-signature rule applies.
- Tradeoff: one signature limits variety; resist adding a second accent to "liven up" a page.
- Check: name the signature in one sentence. Count where it appears: few chosen places pass. Zero places, or everywhere, fails. Compare a greyscale render with the color render; the color render must carry information that the greyscale render loses.
- Near miss: a sidebar logo gradient kept in color while everything else is neutral passes, because it is the signature. Gradient fills on every card fail.

## R-VIS-038

**Judge aesthetics only from renders shown side by side, and report a pass that only tidies tokens as hygiene, not as a visual improvement.**

- Scope: every redesign or polish report.
- Action: (1) capture before and after screenshots of the same page at the same width and theme; (2) put them side by side, or give the reader a toggle; (3) sort each change as hygiene (tokens, alignment, consistency) or composition (focal moment, signature, rhythm); (4) claim a visual improvement only when a composition change is visible in the pair.
- Reason: hygiene makes later work cheaper, but a reader does not see it. Calling it an aesthetic gain spends trust that the next report will need.
- Exceptions: a pure bug fix (overflow, broken state) needs only an after render and a before/after metric.
- Tradeoff: the paired capture adds a step; it is the cheapest way to stop a disputed verdict before it starts.
- Check: the report contains the pair (or a toggle link) and a hygiene/composition split. A report that claims "looks better" without the pair fails.
- Near miss: a report that says "alignment fixed, composition unchanged" passes. It is honest even when it shows no aesthetic gain.

## R-VIS-040

**The product has a face: its name and scope in the shell, the current place visible, and one element only this product has.**

- Scope: any app screen with a shell.
- Action: (1) product mark and name at the top of the shell, with the workspace or role under it; labels visible by default on desktop; (2) the active item marked with the brand's pale tint; (3) one element built from the product's own objects (a floor plan, a route, a pipeline) in the lead block, using real data; (4) people keep a stable identity tint.
- Reason: correctness does not say whose product this is; a stranger's first question is what am I looking at.
- Exceptions: a host app that owns the shell; embedded widgets.
- Tradeoff: a labelled sidebar costs width. Keep it collapsible and remember the choice.
- Check: cover the page title in a screenshot. Can you still name the product and the place? Would the lead block fit a competitor unchanged?
- Near miss: a logo alone is not a face.

## R-VIS-041

**The title row says the finding and offers the job.**

- Scope: overviews and queues where something needs doing today.
- Action: the line under the title is the one fact that most needs attention, computed from the data, and falls back to a plain description when nothing does. The most frequent job is one primary control on the title row's right edge, named for what it does, shown only when there is work.
- Reason: a screen with no next step reads as a report.
- Exceptions: reference pages and settings.
- Tradeoff: a computed sentence needs a calm fallback and must stay true; build it from the same variables as the figures beside it.
- Check: read the subline aloud. Is it true today? Does the button do what the subline implies?
- Near miss: "Manage rental and send email to tenants" describes the interface, not the data.

## R-VIS-042

**Cards in a row end together because their content balances, not because a frame stretched over nothing.**

- Scope: any multi-column card grid.
- Action: choose the column structure from content height: stack short blocks against a tall one, cap lists to a shared row count, or let a card keep its own height. Only an action or a total may pin to a stretched card's foot. The last incomplete row of a card grid gets a named treatment — fill it with real content, rebalance the column count, or merge it into one deliberate full-width block that carries its own reason for spanning; an orphan stretched to the row width by default, or left stranded in place, fails.
- Reason: a stretched void reads as a loading failure.
- Exceptions: an empty-state sentence with reference data may fill a block.
- Tradeoff: real data lengths vary. Check the short and the long state.
- Check: `render-audit` reports a card band over 64px and a first-viewport blank run; confirm on the screenshot. Render N±1 items per breakpoint: no orphan is stretched or stranded.
- Near miss: blank space around a deliberately sparse single figure is not a void.

## R-VIS-043

**Every quantity chart shows its scale, and bars stay the width of a mark.**

- Scope: cartesian charts on operational pages.
- Action: y ticks in 3-5 round steps, faint horizontal gridlines, one hue per chart unless parts of a whole, a maximum bar width (aim for 48-56px; `render-audit` fails above 64px), no legend for a single series. Anchor a quantity axis at zero; a range that starts above zero labels the omission, and when the reader's question is a difference, a truncated axis is barred. Bar rounding sits on the value end and flips with the sign — a negative bar's outer corner stays outer; an unflipped radius array fails.
- Reason: a chart without a scale decorates; a chart with one answers.
- Exceptions: a sparkline inside a row whose number is printed beside it.
- Tradeoff: ticks take width; on a phone keep them in their own lane.
- Check: can you read an approximate value from the chart alone? Is any bar wider than its label? Render the series' maximum and minimum: outer corners stay outer. Read the axis range: a difference question on a min-anchored axis fails.
- Near miss: value labels on every bar may replace the axis when there are six bars or fewer.

## R-VIS-044

**Each page's opening fits its job: a suite of screens must not be one template rendered many times.**

- Scope: any product with several screens.
- Action: name each page's job in one line (overview, queue, ledger, board, form). A queue or list opens with its rows and a quiet count line. A large statistic stays on pages where that number is what the visitor came for. When two pages share a block sequence and different jobs, change one block.
- Reason: identical openings make every page look equally important, and the reader stops seeing any of them.
- Exceptions: pages with the same job may share a sequence.
- Tradeoff: more than one opening pattern to maintain. Keep each in a shared component.
- Check: open the `contact-<theme>-<width>.png` sheet from `render-audit`. Can you tell the jobs apart?
- Near miss: consistent shell, type and tokens are not sameness; only the block sequence is.

## R-VIS-045

**A table column earns its place: no column that repeats the viewer, and no column that is empty in every row.**

- Scope: tables whose scope depends on role or data.
- Action: drop identity columns when the view is scoped to one person. Render an action column only when at least one visible row has an action. An empty table shows a teaching empty state (R-VIS-031), never headers over nothing.
- Reason: an empty or repeating column spends the widest resource on nothing.
- Exceptions: a fixed layout shared with print or export.
- Tradeoff: columns can appear as data changes; a row with no action must still align.
- Check: for each role, scan each column top to bottom. Does any column hold the same value or nothing?
- Near miss: a sparse column with some real values stays.
