# Information and attention

Use this branch when the question is not whether a control works, but whether the page should contain it, where it belongs, and what the reader's eye should find first. These rules govern quantity and placement before styling. Apply them before arranging pixels: a well-styled unnecessary block is still unnecessary.

Evidence note: R-SYN-009 to R-SYN-012 are agent synthesis from general interaction-design practice. They are not derived from the supplied research corpus and carry no research citation. Treat them as conditional heuristics, not measurements of attention. Two later clauses carry owner statements (2026-11-18): R-SYN-009's tooltip clause and R-SYN-010's merged-card near miss. R-SYN-002 is promoted synthesis with its own provenance record.

## R-SYN-009

Establish necessity before styling anything.

- Evidence: agent-synthesis; not corpus-derived.
- Scope: operational-ui, showcase-landing, showcase-reading; any page where blocks compete for the reader's attention.
- Action: List every block on the page. For each, name the decision, action, or required disclosure it supports, using only supplied facts. A block that supports none is removed, not restyled. Restyling an unnecessary block is not a repair. A block that states a capability, a required disclosure, or a disputed claim is removed only after the relevant owner's decision (R-SYN-003). The inventory reaches copy inside a kept block: each subtitle or helper line names a supplied fact or a task-map row — copy whose removal changes no task answer is filler and is removed, not restyled. Tooltips, hover cards, info icons and help popovers are copy too. Keep them when the added content supports a task and the visible surface does not already supply it. Examples include an icon-only control's name, a truncated value's full text (R-VIS-030), or a definition or condition the label cannot hold. One that repeats its label, or the same definition beside every instance of a repeated label, is filler. A limit the person must read before acting goes beside the control, not behind a hover. R-INF-010 covers the behavior of a kept tooltip.
- Reason: Styling work on a block with no task tends to add emphasis to content that competes with the task that matters. Removing it tends to be the smaller change with the larger effect.
- Exceptions: Keep blocks that carry an obligation, a required disclosure, a rare but important task, an accessibility aid, or a factual source note, even when they look decorative or low-value.
- Tradeoff: Removing a block can destroy orientation or evidence that the reader needs later.
- Alternative: Demote or regroup a block whose fact must survive but whose prominence is wrong.
- Near miss: An understated source note, a legal line beside a control, or a rarely used but critical action is not filler and must survive the necessity pass.
- Check: Produce a block inventory with one line per block and the task it supports. Every surviving line names a task; every deleted block gets a reason. List every tooltip, info icon, hover card and help popover with the task it supports and the content it adds. A link preview earns its place if the extra context helps the reader decide whether to follow the link. For the right treatment, use the [component selection pass](visual-craft/states-and-motion.md#component-selection-pass).
- Strength and units: conditional heuristic; not empirical proof or WCAG requirement. No prescribed block count.
- Trail: agent synthesis for this version; no corpus provenance. Tooltip clause: owner, 2026-11-18, "tooltip 感觉在很多没必要的地方滥用了".

## R-SYN-010

A container must earn its frame.

- Evidence: agent-synthesis; not corpus-derived.
- Scope: any surface that uses cards, panels, or bordered boxes to group content.
- Action: Justify each card-like container by one of two conditions. Either it groups two or more parallel items that share the same field set and are scanned or compared together, or it marks a genuinely separate object the reader must act on as a unit, such as a payment summary or a single destructive confirmation. Otherwise remove the frame and let the content sit in the page flow.
- Reason: A frame claims that what is inside belongs together and is comparable to its siblings. A frame around one paragraph, one number, or a single sentence makes a false claim and adds visual weight without information.
- Exceptions: A status or alert container that communicates state change; a container that marks irreversibility; a container required by an existing component system where the alternative is a larger inconsistency.
- Tradeoff: Removing frames can make dense parallel data harder to compare; keeping a weak frame on a single item costs the reader a visual decision that returns nothing.
- Alternative: Group with spacing and a shared heading before drawing a border, and group parallel items into one container with a header row instead of several small ones. Views of one thing the reader does not compare side by side can become tabs or a segmented control.
- Near miss: One stat tile is unnecessary when it stands alone, and justified when it sits with another comparable number in the same arrangement. Merging weak cards into one larger card is not the repair while the old panels survive inside it.
- Check: Count containers, nested ones included. For each, state either its two or more parallel peers with the shared field set, or its separate-object reason. A container around prose, a single figure, or a single link fails this check. Count a panel by its visual boundary, not its border: a panel inside a frame that already groups the same items fails, and so does one kept by its own background, spacing or repeated title after its border was removed.
- Strength and units: conditional heuristic; not empirical proof or WCAG requirement. The two-item floor is a working heuristic, not a measured threshold; no other card count is prescribed.
- Trail: agent synthesis for this version; no corpus provenance. Merged-card near miss: owner, 2026-11-18, "依然是卡片，只是更大的卡片。这不行".

## R-SYN-011

Place information with the decision it supports.

- Evidence: agent-synthesis; not corpus-derived.
- Scope: operational-ui, showcase-landing, showcase-reading; any control or claim that depends on a fact stated elsewhere.
- Action: Order the page by the sequence a reader must understand, decide, and act. Put the fact that justifies a control next to that control. Do not order by source document order, database order, or visual symmetry when those differ from the reader's sequence.
- Reason: A reader who must leave the control to find its justification tends to either abandon the action or act without the fact. Proximity is usually the cheapest form of explanation.
- Exceptions: Long-form reading where a narrative order carries meaning; reference pages where grouped lookup beats decision order.
- Tradeoff: Decision order can break a conventional layout or an existing information architecture that other pages depend on.
- Alternative: Keep the existing order and repeat the single decisive fact beside the control instead of moving the whole section.
- Near miss: A terms line under a submit button belongs there even when the layout would be tidier with it in the footer; a source note beside a number belongs there even when a footnote would look cleaner.
- Check: For every control, name the fact a reader needs to use it correctly and confirm that fact appears with or before the control at both wide and narrow widths. A control whose justification lives in another section fails.
- Strength and units: conditional heuristic; not empirical proof or WCAG requirement. No prescribed layout.
- Trail: agent synthesis for this version; no corpus provenance.

## R-SYN-012

One attention target per view.

- Evidence: agent-synthesis; not corpus-derived.
- Scope: any rendered surface.
- Action: Per viewport, allow at most one visually dominant element, the primary task or the single most important current status. Reduce everything else by removing emphasis, not by adding emphasis elsewhere to rebalance, and do not drop text or control contrast below the project's accessibility target.
- Reason: Emphasis is relative. Adding a second loud element does not restore balance; it removes the reader's ability to tell which item is the reason the page exists.
- Exceptions: Two or more simultaneous critical alarms that are each current and actionable may share prominence; a deliberate campaign headline may dominate a landing page.
- Tradeoff: A single dominant element can bury a secondary but frequent action.
- Alternative: After clarifying grouping or copy (R-SYN-002), demote by size, weight, and saturation in that order, and use position before color for the secondary action.
- Near miss: A large heading that carries the page's only real message is the intended dominant element, not competition; two equally loud primary buttons are the defect.
- Check: Render at narrow and wide widths and at enlarged text. List every element that reads as visually dominant, whether by size and position alone or by size plus saturation plus contrast. More than one competing primary element fails unless an exception above applies. Do not claim a measured gaze path or fixation order.
- Strength and units: conditional heuristic; not empirical proof or WCAG requirement. No prescribed geometry, colour, or type scale.
- Trail: agent synthesis for this version; no corpus provenance.

## R-SYN-002

Repair competing hierarchy without flattening it. Inspect type, alignment, spacing, grouping, imagery, and contrast in the actual page. Existing tokens and effective identity constrain repairs. No approved record establishes a mandatory palette, typeface, spacing scale, geometry, card count, or layout style. A cosmetic preference alone is insufficient evidence of a defect.

- Evidence: agent-synthesis; promoted-synthesis.
- Scope: operational-ui, showcase-reading, showcase-landing; locating an action or understanding headline and supporting meaning. Audience: people performing the named task; domain familiarity must be inspected. Platform: web; no native unit transfer.
- Action: Compare emphasis with neighboring elements; demote competing secondary emphasis or clarify roles while preserving supporting facts and meaningful identity.
- Reason: Relative emphasis and a headline overwhelming its subline are text-supported observations, not measured gaze paths.
- Exceptions: Multiple critical alarms may need simultaneous prominence; a dramatic readable campaign heading can be correct.
- Tradeoff: Reducing competition may weaken intended expression or status salience.
- Alternative: Clarify grouping or copy before changing type size, color or layout.
- Near miss: Keep the restrained tea identity and editorial section order when they already serve the task.
- Check: Render wide, narrow and enlarged text; confirm primary task, support, critical status and reading order remain available without claiming measured attention.
- Strength and units: conditional heuristic; not empirical proof or WCAG requirement. no prescribed geometry or timing.
- Trail: [R-SYN-002 provenance](sources.md#r-syn-002); C-T6-002, C-T6-006, C-T6-008; b9fbdca8-ee15-41f2-bc3c-e1e8f35d7d8a, 706278d5-405d-4bb1-ab57-de60521d56b7, ffd0344c-97ad-4414-a47b-70e35389b501.
