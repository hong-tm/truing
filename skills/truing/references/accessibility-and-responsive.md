# Accessibility and responsive checks

Use only the criteria relevant to the actual trigger and selected conformance target. These twelve saved records are a bounded subset, not a complete accessibility audit. Each card preserves its actual A, AA, or AAA level. No native point, dp, prototype spring, or fixture target size becomes a CSS requirement.

## Contents

- [R-WCAG-2-1-1](#r-wcag-2-1-1)
- [R-WCAG-2-4-3](#r-wcag-2-4-3)
- [R-WCAG-2-4-7](#r-wcag-2-4-7)
- [R-WCAG-1-4-10](#r-wcag-1-4-10)
- [R-WCAG-1-4-4](#r-wcag-1-4-4)
- [R-WCAG-2-3-3](#r-wcag-2-3-3)
- [R-WCAG-2-5-8](#r-wcag-2-5-8)
- [R-WCAG-4-1-3](#r-wcag-4-1-3)
- [R-WCAG-3-3-1](#r-wcag-3-3-1)
- [R-WCAG-3-3-2](#r-wcag-3-3-2)
- [R-WCAG-4-1-2](#r-wcag-4-1-2)
- [R-WCAG-1-4-13](#r-wcag-1-4-13)

## Shared interpretation

All cards use the saved W3C WCAG 2.2 Recommendation dated 12 December 2024. The published criterion controls the requirement; these are original-language paraphrases. Source metadata includes its dated public section and saved-wording hash. No fresh online verification or full conformance claim follows. Every alternative must meet the applicable criterion; implementation freedom is not permission to trade accessibility away. APG remains informative.

## R-WCAG-2-1-1

keyboard.

- Evidence: standard-saved-record; promoted-saved-standard.
- Scope: operational-ui, showcase-reading, showcase-landing; GAP-2 / task 7 and IS-3: keyboard. Audience: users of web content, including disabled users. Platform: web.
- Action: Keyboard operation without timed keystrokes.
- Reason: Apply the saved W3C criterion at its actual conformance level and scope; the record is normative text, not a practitioner preference or empirical outcome.
- Exceptions: Path-dependent underlying functions are excepted; ordinary text input is not.
- Tradeoff: Satisfy the applicable criterion without assuming an example implementation or a new aesthetic is mandatory.
- Alternative: Choose any implementation that meets the actual criterion; native semantics may avoid unnecessary custom widgets.
- Near miss: Path-dependent underlying functions are excepted; ordinary text input is not.
- Check: Operate every function by keyboard without specific keystroke timing; examine the underlying path-dependent-function exception, not merely the input device.
- Strength and units: WCAG 2.1.1, Level A, W3C WCAG 2.2 Recommendation 12 December 2024. no prototype timing or native unit transfer.
- Trail: [R-WCAG-2-1-1 provenance](sources.md#r-wcag-2-1-1); ext-wcag-2-1-1.

Essential scope detail: The exception follows the underlying function, not the input device. Handwriting recognition used for ordinary text entry does not exempt text entry from keyboard access. Additional mouse or other input methods remain allowed.

## R-WCAG-2-4-3

focus-order.

- Evidence: standard-saved-record; promoted-saved-standard.
- Scope: operational-ui, showcase-reading, showcase-landing; GAP-2 / task 7 and IS-3: focus-order. Audience: users of web content, including disabled users. Platform: web.
- Action: Preserve meaning and operability in sequential focus order when that order matters.
- Reason: Apply the saved W3C criterion at its actual conformance level and scope; the record is normative text, not a practitioner preference or empirical outcome.
- Exceptions: No universal pixel-order rule follows where sequence does not affect meaning or operation.
- Tradeoff: Satisfy the applicable criterion without assuming an example implementation or a new aesthetic is mandatory.
- Alternative: Choose any implementation that meets the actual criterion; native semantics may avoid unnecessary custom widgets.
- Near miss: No universal pixel-order rule follows where sequence does not affect meaning or operation.
- Check: Traverse sequential focus and compare meaning and operability with the intended task.
- Strength and units: WCAG 2.4.3, Level A, W3C WCAG 2.2 Recommendation 12 December 2024. no prototype timing or native unit transfer.
- Trail: [R-WCAG-2-4-3 provenance](sources.md#r-wcag-2-4-3); ext-wcag-2-4-3.

## R-WCAG-2-4-7

focus-visible.

- Evidence: standard-saved-record; promoted-saved-standard.
- Scope: operational-ui, showcase-reading, showcase-landing; GAP-2 / task 7 and IS-3: focus-visible. Audience: users of web content, including disabled users. Platform: web.
- Action: Provide a keyboard mode with a visible focus indicator.
- Reason: Apply the saved W3C criterion at its actual conformance level and scope; the record is normative text, not a practitioner preference or empirical outcome.
- Exceptions: The criterion does not prescribe a brand color or ring geometry.
- Tradeoff: Satisfy the applicable criterion without assuming an example implementation or a new aesthetic is mandatory.
- Alternative: Choose any implementation that meets the actual criterion; native semantics may avoid unnecessary custom widgets.
- Near miss: The criterion does not prescribe a brand color or ring geometry.
- Check: Inspect visible keyboard focus in an actual keyboard mode.
- Strength and units: WCAG 2.4.7, Level AA, W3C WCAG 2.2 Recommendation 12 December 2024. no prototype timing or native unit transfer.
- Trail: [R-WCAG-2-4-7 provenance](sources.md#r-wcag-2-4-7); ext-wcag-2-4-7.

## R-WCAG-1-4-10

reflow.

- Evidence: standard-saved-record; promoted-saved-standard.
- Scope: operational-ui, showcase-reading, showcase-landing; GAP-2 / task 7 and IS-3: reflow. Audience: users of web content, including disabled users. Platform: web.
- Action: Retain content and function without two-dimensional scrolling at 320 CSS px width for vertical reading or 256 CSS px height for horizontal reading.
- Reason: Apply the saved W3C criterion at its actual conformance level and scope; the record is normative text, not a practitioner preference or empirical outcome.
- Exceptions: Parts requiring two-dimensional layout for usage or meaning, including tables and maps, are excepted.
- Tradeoff: Satisfy the applicable criterion without assuming an example implementation or a new aesthetic is mandatory.
- Alternative: Choose any implementation that meets the actual criterion; native semantics may avoid unnecessary custom widgets.
- Near miss: Parts requiring two-dimensional layout for usage or meaning, including tables and maps, are excepted.
- Check: Check vertical content at 320 CSS pixels and horizontal content at 256 CSS pixels equivalent; retain information/function without two-dimensional scrolling except genuinely two-dimensional parts.
- Strength and units: WCAG 1.4.10, Level AA, W3C WCAG 2.2 Recommendation 12 December 2024. CSS pixels.
- Trail: [R-WCAG-1-4-10 provenance](sources.md#r-wcag-1-4-10); ext-wcag-1-4-10.

Essential scope detail: For vertical scrolling, use width equivalent to 320 CSS pixels; for horizontal scrolling, use height equivalent to 256 CSS pixels. These correspond respectively to 1280-wide and 1024-high starting viewports at 400% zoom. Parts requiring two-dimensional layout for meaning or use are excepted, including explanatory maps or diagrams, video, games, presentations, data tables rather than individual cells, and interfaces that need toolbars visible during manipulation. Keep scrolling local to the necessary part where possible.

## R-WCAG-1-4-4

resize-text.

- Evidence: standard-saved-record; promoted-saved-standard.
- Scope: operational-ui, showcase-reading, showcase-landing; GAP-2 / task 7 and IS-3: resize-text. Audience: users of web content, including disabled users. Platform: web.
- Action: Support text resizing up to 200 percent without loss of content or functionality and without assistive technology.
- Reason: Apply the saved W3C criterion at its actual conformance level and scope; the record is normative text, not a practitioner preference or empirical outcome.
- Exceptions: Captions and images of text are excepted.
- Tradeoff: Satisfy the applicable criterion without assuming an example implementation or a new aesthetic is mandatory.
- Alternative: Choose any implementation that meets the actual criterion; native semantics may avoid unnecessary custom widgets.
- Near miss: Captions and images of text are excepted.
- Check: Resize text to 200 percent without assistive technology and check content/function; captions and images of text are excepted.
- Strength and units: WCAG 1.4.4, Level AA, W3C WCAG 2.2 Recommendation 12 December 2024. percent text resize.
- Trail: [R-WCAG-1-4-4 provenance](sources.md#r-wcag-1-4-4); ext-wcag-1-4-4.

## R-WCAG-2-3-3

animation-from-interactions.

- Evidence: standard-saved-record; promoted-saved-standard.
- Scope: operational-ui, showcase-reading, showcase-landing; GAP-2 / task 7 and IS-3: animation-from-interactions. Audience: users of web content, including disabled users. Platform: web.
- Action: Allow disabling interaction-triggered motion animation unless essential to functionality or conveyed information.
- Reason: Apply the saved W3C criterion at its actual conformance level and scope; the record is normative text, not a practitioner preference or empirical outcome.
- Exceptions: Essential motion is excepted; this is AAA, not AA or a ban on every animation.
- Tradeoff: Satisfy the applicable criterion without assuming an example implementation or a new aesthetic is mandatory.
- Alternative: Choose any implementation that meets the actual criterion; native semantics may avoid unnecessary custom widgets.
- Near miss: Essential motion is excepted; this is AAA, not AA or a ban on every animation.
- Check: First establish interaction-triggered motion animation; check it can be disabled unless essential to functionality or information. Do not apply this criterion to continuous, page-load or unknown-trigger effects by inference.
- Strength and units: WCAG 2.3.3, Level AAA, W3C WCAG 2.2 Recommendation 12 December 2024. no prototype timing or native unit transfer.
- Trail: [R-WCAG-2-3-3 provenance](sources.md#r-wcag-2-3-3); ext-wcag-2-3-3.

## R-WCAG-2-5-8

target-size-minimum.

- Evidence: standard-saved-record; promoted-saved-standard.
- Scope: operational-ui, showcase-reading, showcase-landing; GAP-2 / task 7 and IS-3: target-size-minimum. Audience: users of web content, including disabled users. Platform: web.
- Action: Evaluate pointer targets against 24 by 24 CSS px together with the actual exception tests.
- Reason: Apply the saved W3C criterion at its actual conformance level and scope; the record is normative text, not a practitioner preference or empirical outcome.
- Exceptions: Spacing, equivalent control, inline, unmodified user-agent control and essential/legal presentation exceptions apply.
- Tradeoff: Satisfy the applicable criterion without assuming an example implementation or a new aesthetic is mandatory.
- Alternative: Choose any implementation that meets the actual criterion; native semantics may avoid unnecessary custom widgets.
- Near miss: Spacing, equivalent control, inline, unmodified user-agent control and essential/legal presentation exceptions apply.
- Check: Measure pointer targets in CSS pixels; evaluate 24 by 24 and each spacing, equivalent, inline, unmodified user-agent and essential/legal exception before judging.
- Strength and units: WCAG 2.5.8, Level AA, W3C WCAG 2.2 Recommendation 12 December 2024. CSS pixels.
- Trail: [R-WCAG-2-5-8 provenance](sources.md#r-wcag-2-5-8); ext-wcag-2-5-8.

Essential scope detail: For an undersized target, center a 24 CSS pixel diameter circle on its bounding box. The spacing exception requires that circle to intersect neither another target nor the circle of another undersized target. Other exceptions are an equivalent conforming control on the same page; a target in a sentence or constrained by non-target text line height; an unmodified user-agent-sized control; and an essential or legally required presentation. A spatial value selector, such as a slider or color picker, counts as one target. Interpret inline line height perpendicular to text flow, including vertical writing.

## R-WCAG-4-1-3

status-messages.

- Evidence: standard-saved-record; promoted-saved-standard.
- Scope: operational-ui, showcase-reading, showcase-landing; GAP-2 / task 7 and IS-3: status-messages. Audience: users of web content, including disabled users. Platform: web.
- Action: Make markup status messages programmatically determinable through role or properties so assistive technology can present them without receiving focus.
- Reason: Apply the saved W3C criterion at its actual conformance level and scope; the record is normative text, not a practitioner preference or empirical outcome.
- Exceptions: Not every content change is a status message.
- Tradeoff: Satisfy the applicable criterion without assuming an example implementation or a new aesthetic is mandatory.
- Alternative: Choose any implementation that meets the actual criterion; native semantics may avoid unnecessary custom widgets.
- Near miss: Not every content change is a status message.
- Check: Inspect markup status role/properties and verify presentation without receiving focus with actual assistive technology; DOM alone does not prove speech.
- Strength and units: WCAG 4.1.3, Level AA, W3C WCAG 2.2 Recommendation 12 December 2024. no prototype timing or native unit transfer.
- Trail: [R-WCAG-4-1-3 provenance](sources.md#r-wcag-4-1-3); ext-wcag-4-1-3.

## R-WCAG-3-3-1

error-identification.

- Evidence: standard-saved-record; promoted-saved-standard.
- Scope: operational-ui, showcase-reading, showcase-landing; GAP-2 / task 7 and IS-3: error-identification. Audience: users of web content, including disabled users. Platform: web.
- Action: Identify automatically detected input errors and describe them in text.
- Reason: Apply the saved W3C criterion at its actual conformance level and scope; the record is normative text, not a practitioner preference or empirical outcome.
- Exceptions: The antecedent is automatic detection of an input error, not a mandate to invent validation.
- Tradeoff: Satisfy the applicable criterion without assuming an example implementation or a new aesthetic is mandatory.
- Alternative: Choose any implementation that meets the actual criterion; native semantics may avoid unnecessary custom widgets.
- Near miss: The antecedent is automatic detection of an input error, not a mandate to invent validation.
- Check: For automatically detected input errors, identify the item and describe the error in text. Generic network errors are not automatically input errors.
- Strength and units: WCAG 3.3.1, Level A, W3C WCAG 2.2 Recommendation 12 December 2024. no prototype timing or native unit transfer.
- Trail: [R-WCAG-3-3-1 provenance](sources.md#r-wcag-3-3-1); ext-wcag-3-3-1.

## R-WCAG-3-3-2

labels-or-instructions.

- Evidence: standard-saved-record; promoted-saved-standard.
- Scope: operational-ui, showcase-reading, showcase-landing; GAP-2 / task 7 and IS-3: labels-or-instructions. Audience: users of web content, including disabled users. Platform: web.
- Action: Provide labels or instructions when content requires user input.
- Reason: Apply the saved W3C criterion at its actual conformance level and scope; the record is normative text, not a practitioner preference or empirical outcome.
- Exceptions: This does not require decorative labels above non-input content.
- Tradeoff: Satisfy the applicable criterion without assuming an example implementation or a new aesthetic is mandatory.
- Alternative: Choose any implementation that meets the actual criterion; native semantics may avoid unnecessary custom widgets.
- Near miss: This does not require decorative labels above non-input content.
- Check: Check labels or instructions when content requires user input.
- Strength and units: WCAG 3.3.2, Level A, W3C WCAG 2.2 Recommendation 12 December 2024. no prototype timing or native unit transfer.
- Trail: [R-WCAG-3-3-2 provenance](sources.md#r-wcag-3-3-2); ext-wcag-3-3-2.

## R-WCAG-4-1-2

name-role-value.

- Evidence: standard-saved-record; promoted-saved-standard.
- Scope: operational-ui, showcase-reading, showcase-landing; GAP-2 / task 7 and IS-3: name-role-value. Audience: users of web content, including disabled users. Platform: web.
- Action: Expose component names, roles, user-settable states/properties/values and notification of changes programmatically.
- Reason: Apply the saved W3C criterion at its actual conformance level and scope; the record is normative text, not a practitioner preference or empirical outcome.
- Exceptions: Standard controls used according to specification already meet this criterion; redundant ARIA is not the goal.
- Tradeoff: Satisfy the applicable criterion without assuming an example implementation or a new aesthetic is mandatory.
- Alternative: Choose any implementation that meets the actual criterion; native semantics may avoid unnecessary custom widgets.
- Near miss: Standard controls used according to specification already meet this criterion; redundant ARIA is not the goal.
- Check: Inspect programmatic names, roles, user-set states/properties/values and change notification; test actual user-agent/AT interoperability.
- Strength and units: WCAG 4.1.2, Level A, W3C WCAG 2.2 Recommendation 12 December 2024. no prototype timing or native unit transfer.
- Trail: [R-WCAG-4-1-2 provenance](sources.md#r-wcag-4-1-2); ext-wcag-4-1-2.

Essential scope detail: Names and roles must be programmatically determinable; user-settable states, properties, and values must be programmatically settable, with change notification available to user agents including assistive technology. Correct standard HTML controls can already meet this criterion.

## R-WCAG-1-4-13

content-on-hover-or-focus.

- Evidence: standard-saved-record; promoted-saved-standard.
- Scope: operational-ui, showcase-reading, showcase-landing; GAP-2 / task 7 and IS-3: content-on-hover-or-focus. Audience: users of web content, including disabled users. Platform: web.
- Action: Make additional hover/focus content dismissible, hoverable and persistent under the stated conditions.
- Reason: Apply the saved W3C criterion at its actual conformance level and scope; the record is normative text, not a practitioner preference or empirical outcome.
- Exceptions: Unmodified user-agent presentation is excepted; dismissibility has an input-error/non-obscuring exception; revealing the trigger itself is outside scope.
- Tradeoff: Satisfy the applicable criterion without assuming an example implementation or a new aesthetic is mandatory.
- Alternative: Choose any implementation that meets the actual criterion; native semantics may avoid unnecessary custom widgets.
- Near miss: Unmodified user-agent presentation is excepted; dismissibility has an input-error/non-obscuring exception; revealing the trigger itself is outside scope.
- Check: Only for additional content shown/hidden by hover/focus: check dismissibility with its exceptions, hoverability, persistence and unmodified user-agent presentation exception; not click-only disclosure.
- Strength and units: WCAG 1.4.13, Level AA, W3C WCAG 2.2 Recommendation 12 December 2024. no prototype timing or native unit transfer.
- Trail: [R-WCAG-1-4-13 provenance](sources.md#r-wcag-1-4-13); ext-wcag-1-4-13.

Essential scope detail: The trigger is additional content becoming visible and hidden as pointer hover or keyboard focus arrives and leaves. Dismiss it without moving hover or focus, except when it communicates an input error or does not obscure or replace other content. If hover triggers it, allow the pointer to enter that content without hiding it. Keep it visible until the trigger is removed, the user dismisses it, or the information becomes invalid. Unmodified user-agent presentation is excepted. Revealing the triggering component itself, such as a skip link, is outside this criterion. Click-only disclosure is outside this trigger.
