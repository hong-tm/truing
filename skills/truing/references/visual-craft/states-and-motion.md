# Every state is designed

Part of [visual-craft.md](../visual-craft.md). Read the index first; open this file only when its pattern applies. Why each rule exists: [evidence.md](evidence.md).

## R-VIS-012

**An overlay is sized for its content, opens without breaking the page behind it, names its verb, and returns focus.**

- Scope: confirm dialogs, sheets, drawers on operational surfaces.
- Action: (1) size a desktop confirmation to its content (roughly 420–480px); (2) while a dialog, sheet or drawer is open, the page behind must not gain a horizontal scrollbar — lock body overflow in both axes and verify by measurement, not by memory of the library default; (3) label the primary control with its verb; (4) focus the safe control on open, return focus to the opener on close; (5) a dialog, sheet or drawer opens through deliberate activation of its trigger; (6) an overlay's height is bounded by the viewport (`max-height`, never a fixed pixel height on a responsive container) and scrolls internally — at 390 with the viewport shrunk to 400px, every action stays reachable under a raised keyboard.
- Reason: an overlay is one decision; a visible horizontal scrollbar appearing behind it announces a broken page and invites interaction with it.
- Exceptions: form-bearing dialogs take the width of their fields; full-width drawers on phones.
- Tradeoff: scroll-locking the body can shift layout if a scrollbar occupied width; compensate with scrollbar-gutter or padding, not by skipping the lock.
- Check: open each overlay and assert `document.scrollingElement.scrollWidth <= clientWidth`; verify focus on open and after close in both dialog and drawer branches. Tab through the page and verify that dialogs, sheets and drawers stay closed until their trigger is activated. Shrink the viewport to 390x400 under an open overlay: its content scrolls inside it and the primary action stays reachable.
- Near miss: a page that horizontally scrolls before the overlay opens has a separate pre-existing defect; fix it too, but do not blame the overlay.

## R-VIS-013

**Loading shows the shape that is coming; empty and error states carry the loaded page's type scale.**

- Scope: operational lists, tables, and charts with network data.
- Action: three to five skeleton rows using the loaded row's padding and control width inside a container matching the final frame; empty and error copy at body size with the page's gap, from one shared wording set, with one recovery control in the same error block. R-VIS-031 governs whether an empty state offers a recovery action. Charts follow R-VIS-004 for rendering.
- Reason: a loading state is the same page with unknown content; changing its shape makes first paint a different layout; five empty-state wordings is a missing component, not five choices.
- Exceptions: sub-200ms local data may skip the skeleton; an inline refetch keeps the existing rows until the new content lands (R-SYN-023 owns the wait).
- Tradeoff: skeletons cost markup and can lie about row count; three to five rows is enough.
- Check: capture loading, empty, error at 1440 and 390; compare container rects with the loaded state; count distinct empty-state strings app-wide (target: one per context).
- Near miss: a static page with nothing to load needs no skeleton.

## R-VIS-020

**Every interactive component ships all four states — default, hover, active, disabled — and a changing number animates its change.**

- Scope: every interactive component on a repaired or new surface; live-updating statistics and KPI numbers.
- Action: (1) audit default, hover, active, disabled (plus focus and error for inputs) for each control, styled through the component's variant definition (R-VIS-000); (2) a disabled or collapsed state still needs an accessible name and reason, and exists only for a condition the person can change: an action their role never has is left out (R-VIS-009, R-INF-018), and a settled state is text (R-INF-005); (3) when a displayed number changes (toggle period, refresh), animate the transition — slide or cross-fade digits within roughly 150–300ms with an ease-out — under a reduced-motion guard; (4) never let a state exist only in code.
- Reason: a missing state is discovered by the user at the worst moment; an unanimated number change reads as a possible error, and reviewers cannot tell whether the value updated.
- Exceptions: static surfaces; reduced-motion users get the change without motion (WCAG 2.3.3 handling stays in accessibility-and-responsive.md).
- Tradeoff: state work multiplies per control; a shared component makes it one-time (that is the point of R-VIS-000).
- Check: tab through and hover-press every control on the changed surface; screenshot each state in both themes; trigger a KPI update and confirm a visible transition.
- Near miss: focus-visible styling is governed by the WCAG card (R-WCAG-2-4-7); this card demands it exists, not its exact form.

## R-VIS-025

**Small controls keep full-size hit areas: the visual stays small, the touch target does not.**

- Scope: icon buttons, checkbox rows, and other sub-44px interactive elements on touch-capable surfaces.
- Action: (1) keep the visual at its designed size; (2) extend the hit area to at least 44px with an invisible overlay or padding, not by growing the icon; (3) suppress the enlarged hit-box on `@media (pointer: fine)` so mouse hover does not trigger early; (4) never compensate by adjusting parent padding or gaps.
- Reason: touch accuracy does not scale down with the design; inflating the visible control instead makes the UI chunky and breaks the visual rhythm.
- Exceptions: targets that already exceed 44px.
- Tradeoff: hit-box overlays are invisible markup; keep them in the shared component, not per page.
- Check: on a touch profile, confirm the hit rect of every small control is at least 44px; on a fine pointer, confirm no early hover triggers.
- Near miss: a 24px icon with 32px spacing between neighbours may already satisfy the intent if the wrapper is the target; measure the wrapper, not the glyph.

## R-VIS-029

**Motion has a budget and a direction: micro-transitions 150–300ms, panels up to ~600ms, ease-out for entries, ease-in for exits, never linear, reduced-motion honored, and only named properties transition.**

- Scope: any transition or animation added during repair or new-page work on an operational surface.
- Action: (1) keep micro-interactions (hovers, chips, tooltips) inside roughly 150–300ms; (2) panels, modals, and page-level transitions inside roughly 200–600ms, with ease-out on entry and ease-in on exit, and an exit shorter than its entry: closing gets out of the way; (3) never use linear easing for interactive motion; (4) name the transitioned properties, never `transition: all`; (5) guard with `prefers-reduced-motion` and animate only transform and opacity by default; (6) a panel opened many times a day (sheet, drawer, command menu) stays at the low end of the band — entry around 300ms or less; a duration at the top of the 200–600ms band on such a surface is a finding; (7) a hover state change keeps the glyph's bounding box fixed: compare the icon's box at rest and on hover — a shift (jitter) fails.
- Reason: these bounds are the cross-source consensus for motion that registers without waiting; direction (ease-out in, ease-in out) matches how physical objects arrive and leave; everything outside the budget either goes unseen or blocks.
- Exceptions: decorative brand moments on showcase surfaces, and progress-driven motion whose duration is the data (R-VIS-035).
- Tradeoff: a budget is a smell test, not a law — a 320ms hover that feels right beats a 300ms one that does not; note the deviation in the component.
- Check: inspect computed transition durations and timing functions on the changed surface; confirm a reduced-motion fallback exists and no `transition: all` remains. Hover a control whose icon or affordance swaps: its box does not move.
- Near miss: WCAG 2.3.3 handling (animation-from-interactions) stays in accessibility-and-responsive.md; this card sets the craft default, not the conformance bar. R-VIS-048 and R-VIS-049 cover where motion goes and in what order.

## R-VIS-031

**An empty state tells the reader what is absent and gives them a next step when one exists.**

- Scope: zero-record views of tables, lists, charts, and permission-gated surfaces.
- Action: Name the absent records in the reader's vocabulary. When the empty region is the main task, use the project's Empty component or equivalent. Add a line of guidance if the arrival path is unclear, and put one primary action in the region when the reader can start or restore that path. If permission or connection explains the state, name that cause and give a recovery action only when one is available. Use shared wording per context and the loaded page's type scale (R-VIS-013).
- Reason: a blank panel answers no question and offers no next step, so the user cannot tell emptiness from breakage; a teaching empty state converts a dead end into an onboarding moment.
- Exceptions: states that are empty for under a heartbeat (filters mid-clear) may show the skeleton instead.
- Tradeoff: A quiet line can carry a secondary chart's empty state. Give media or a frame space only when it helps the main task.
- Check: Exercise the reachable empty, permission and connection states. The reason is clear, any actionable next step works, and an empty secondary region leaves room for the page's primary content.
- Near miss: R-INF-016 owns zero matches and filter recovery. R-INF-019 owns missing fields and quiet attention blocks with nothing due.

## Component selection pass

1. Define the job and the input modes it needs. Inventory relevant local components via the UI exports, registry or framework configuration. Read the candidate implementations and representative call sites, including project-specific wrappers.
2. Shortlist candidates by behavior. Read the matching project or library skill and its relevant component docs where available. If either is unavailable, use local source, stories or tests for the missing guidance. Check the project's installed primitive before copying an example. For shadcn/ui, `components.json` and the local imports identify the setup, and the [shadcn skill](https://ui.shadcn.com/docs/skills) describes the available read-only discovery commands.
3. Choose the smallest option that fits. Record the component or inline treatment, the decisive difference from the nearest candidate, and the source consulted. If a local option fits, reuse it. Check the intended trigger and dismissal. With keyboard and touch, open deliberate disclosures, read their details or operate their controls, and close them. Verify the main task in both modes, including when a Hover Card preview is skipped.

| Job | Treatment |
|---|---|
| Duplicate visible text | Remove the overlay under [R-SYN-009](../information-and-attention.md#r-syn-009). |
| Short, noninteractive hint | Tooltip. An icon-only control keeps its own accessible name, and the tooltip is available on keyboard focus. |
| Optional preview of a link destination | Hover Card. Keep the link usable on its own and make the same information available at the destination. The preview may be skipped on touch or by assistive technology. [shadcn Hover Card](https://ui.shadcn.com/docs/components/base/hover-card). |
| Secondary details or controls that people need to open deliberately | Use an explicit trigger for a Popover or inline disclosure. Follow R-VIS-047 for overlay weight. |
| Limit or instruction needed before acting | Put the fact beside the control under [R-SYN-011](../information-and-attention.md#r-syn-011). |
| Main record region has no data yet | Use R-VIS-031 and the project's equivalent of [shadcn Empty](https://ui.shadcn.com/docs/components/base/empty). |

## R-VIS-047

**An overlay's weight matches its job: a popover for a light choice, a modal for blocking work, a toast for a result — and a new page for a permanent context shift.**

- Scope: popovers, dialogs, sheets, toasts, and navigations on operational surfaces.
- Action: (1) a popover serves a small non-blocking choice tied to its trigger (display settings, a quick filter), closes on outside click, and never traps focus; (2) a modal serves multi-step or consequence-bearing work that must complete or cancel — R-VIS-012 owns its sizing, focus return, and scroll lock; (3) a toast carries a completed result, at most one action (undo, R-SYN-019), never a question or a form; toasts arrive from one screen edge and stack in arrival order, the newest covering the oldest; (4) a permanent context shift navigates to a page with a back path (R-SYN-020) instead of stacking overlays; (5) a light edit behind a modal, a question inside a toast, or a permanent shift stacked as an overlay is a weight mismatch and a defect.
- Reason: overlay weight is a promise about interruption — a modal says "stop", a popover says "adjust", a toast says "done", a page says "you have moved"; misusing the weight makes the product feel nagging or unresponsive.
- Exceptions: confirmations for irreversible actions (R-SYN-019) are modals by design; legally mandated flows.
- Tradeoff: a popover's space is small; when its content outgrows two or three controls, promote to a modal rather than cramming.
- Check: inventory every overlay on the surface; name its class and its job; confirm no light edit behind a modal, no question in a toast, no permanent shift stacked as an overlay.
- Near miss: R-VIS-012 governs dialogs, sheets and drawers. The component selection pass covers triggers for optional hints and explicit disclosures.

## R-VIS-048

**Motion keeps people oriented: an element leaves toward where it came from, and a new input redirects it from where it is now.**

- Scope: overlays, drawers, expanding rows, drag, swipe, reorder, and toggles on any surface that animates them.
- Action: (1) enter from the trigger or a named screen edge and leave the same way (a side drawer returns to its edge; do not shrink a whole drawer into a table cell); (2) accept input during motion: reopening a closing panel continues from its current position, with no jump and no wait for the first animation to end; (3) use a spring for motion the pointer or finger drives or can interrupt, because it carries velocity through a change of target, and use the R-VIS-029 curves for everything else; an operational spring that visibly overshoots its resting place is a defect (showcase surfaces may overshoot on purpose); no damping number is prescribed; (4) animate `transform` and `opacity` first; animating `height`, `top`, `width`, or `box-shadow` needs a stated reason and a look at dropped frames on the changed surface.
- Reason: position tells people what a surface is and how to undo it, and a panel that vanishes in place loses that. Motion that blocks or jumps on interruption makes the page feel slower than it is. Steady frames matter more than a high refresh rate, and layout-affecting properties are the usual cause of dropped frames.
- Exceptions: when the origin is gone or off screen (the row was deleted, the view changed), fade in place. With reduced motion, replace travel with a short fade or an instant change, keeping every state. Showcase surfaces may use visible overshoot on purpose.
- Tradeoff: For toggles (hover, focus, a button opening a panel), a CSS transition is enough: it retargets from the current value while the element stays rendered, though it does not carry velocity; `@keyframes` do not retarget. An element leaving through `display: none`, `<dialog>`, or a framework unmount needs `transition-behavior: allow-discrete` with `@starting-style`, or exit handling in JS. Motion the pointer drives needs a spring library. Spring presets differ per library, so no stiffness or damping value is prescribed here. CSS `linear()` can approximate a spring curve but does not carry velocity; it is a curve, not the linear motion R-VIS-029 forbids.
- Check: source first — for each enter/exit pair, the closed transform points at the anchored edge (a right-anchored drawer closes with `translateX(100%)`, not `-100%`); then in the render, open and close at half way and reverse: no jump, no queued replay. For pointer-driven motion, reverse the direction mid-motion and watch the resting place: a visible overshoot past it on an operational surface is the defect. Close a panel and name the control or edge it returned to. During the motion, list `document.getAnimations()` and name each animated property; layout-affecting ones also need a frame trace (DevTools performance panel or a CDP trace).
- Near miss: R-VIS-029 sets the duration and direction; R-VIS-012 sets the overlay's focus and scroll behaviour; this card sets where the motion goes and what interrupting it does.

## R-VIS-049

**When several things move together, one leads and the rest follow. A sequence that explains no order moves as one.**

- Scope: first arrival of a group (a view's cards, a menu's items, a panel and its contents) and small results that carry a follow-up (a count that changes after its row lands).
- Action: (1) the container leads and its contents overlap the end of its motion, so nothing pops in late and the total stays short; (2) stagger at most a handful of items — about five — arriving together for the first time, and keep the whole sequence inside the R-VIS-029 budget: the last item starts before the budget ends (the budget is the decider, not the count: with 600 ms and 150 ms steps, the fourth item is the last to start inside it); (3) never stagger on refilter, sort, pagination, polling refresh, or theme change, and never across a long list; (4) use follow-through (one child settling slightly after its parent) for one element that reports a result, not for every element; (5) keep anticipation (a small reverse move before the action) and exaggeration off operational controls, because both delay the response; (6) choose the curve by job: entries decelerate, exits accelerate, in-place state changes ease in and out, and steady mechanical motion such as a spinner may be linear; (7) every control works as soon as it is visible, and no action waits for the sequence to end (R-SYN-006, R-SYN-007).
- Reason: order is the only thing a sequence adds. On a surface people revisit all day, a staggered entrance becomes a delay they watch again each time, so its value falls with frequency of use.
- Exceptions: showcase and first-run surfaces may use longer sequences, anticipation, and character curves, since people see them rarely. A single first-load entrance on an operational page is fine only as one group move under (2)'s count and budget; a stagger that fails (2) is not saved by being first-load.
- Tradeoff: a page with no sequence can feel abrupt on first load, while one with a sequence can feel slow by the tenth. When unsure on an operational page, leave it out: this skill's owner test favoured usefulness over expression.
- Check: source first — count the staggered selectors and their delays; the last delay plus its duration must sit inside the R-VIS-029 budget, and the count inside (2). Then slow the animations to 10% (browser animation panel, or set `playbackRate = 0.1` on each item from `document.getAnimations()`, with screenshots when headless) and describe the order in one sentence; if the sentence is "everything comes in", remove the stagger. Refilter and refresh: nothing staggers. Click a visible control during the sequence: it responds.
- Near miss: R-VIS-020's number animation is a single element reporting a change, not a sequence. R-VIS-035 covers progress, whose timing is data.
