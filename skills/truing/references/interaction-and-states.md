# Interaction and states

Use this branch when an action waits, discloses content, changes state, or uses motion. Inspect the actual trigger and request completion. A selected-looking stroke does not establish keyboard focus. Preserve the actual outcome when changing its presentation.

## R-SYN-006

Keep asynchronous feedback tied to real state.

- Evidence: agent-synthesis; promoted-synthesis.
- Scope: operational-ui, showcase-landing; submitting, cancelling, retrying or waiting for actual work. Audience: people performing the named task; domain familiarity must be inspected. Platform: web; no native unit transfer.
- Action: Show applicable empty, pending, failure and success states from actual work; retain input and recovery paths. Report success for a create or update only when the record can be shown, linked or verified: read it from the response (the body, an id, or a Location header) or refetch it. A 2xx response that verifies nothing is an unknown outcome (R-SYN-021), not a success; one the surface refetches and re-renders is a success. Start ready actions without waiting for decorative animation; suppress stale completions after cancellation.
- Reason: State coverage is source-supported. Request ordering, cancellation isolation and retained input are explicit synthesis supported only by a controlled synthetic transfer fixture.
- Exceptions: Do not invent remote work, delay or states for a static page. A genuinely blocking asset or mandatory process may need honest readiness feedback.
- Tradeoff: Persistent context costs space but keeps recovery possible; loading decoration can be omitted.
- Alternative: Use static pending text or native feedback instead of an overlay or timed success.
- Near miss: A static reading page needs no skeleton. A real blocking asset must not be described as ready.
- Check: Subscribe to real completion before triggering work; check pending input, cancel, stale response, error/retry and success without relying on elapsed animation time. After each create, open the list that should hold the new record and find it; a toast that claims a creation while the record never lands in that list fails. An action whose effect is not a record, such as sending an email, is exempt. Real HTTP and AT behavior still need actual checks.
- Strength and units: conditional heuristic; not empirical proof or WCAG requirement. no prescribed geometry or timing.
- Trail: [R-SYN-006 provenance](sources.md#r-syn-006); CAND-T5-001, CAND-T5-003, C-T7-010, C-T7-015, C-T7-016, C-T7-017; cbf9ff4d-5547-487e-8761-71a913accd25, 10cdbaa3-63fe-4884-9a18-b4c4d41f1082, 0b9921a9-16dc-4386-9a4c-f11ae989990e, 76e6f4b7-e2f5-4ba9-b674-765dd9909c38.

## R-SYN-007

Choose motion by trigger and retained function.

- Evidence: agent-synthesis; promoted-synthesis.
- Scope: operational-ui, showcase-reading, showcase-landing; perceiving state or optional expressive content. Audience: people performing the named task; domain familiarity must be inspected. Platform: web; no native unit transfer.
- Action: Use optional motion only for a stated purpose; keep essential content, state, input and actions when disabled or interrupted. Keep continuous, page-load and unknown-trigger effects separate from interaction-triggered motion.
- Reason: The sources describe hover/press, shimmer controls, cursor following and loops. State-preserving fallback is synthesis; it is not original footage or a universal normative rule.
- Exceptions: A clear static control may need no motion; genuinely essential animation requires its actual information/function rationale. Do not infer an unknown production trigger.
- Tradeoff: Expressive continuity trades against distraction and input access; static feedback is a valid choice.
- Alternative: Use no motion, persistent labels and static status; honor the existing motion system rather than importing prototype tokens.
- Near miss: Do not add a pause control to an inconsequential one-shot transition merely because a looping example has one.
- Check: Disable or interrupt optional animation; compare retained task state, content, actions and keyboard/tap paths. Record actual trigger before selecting a standard; no timing threshold is inferred. An idle page is idle: after load settles, list `document.getAnimations()` — a still-painting loop (a background SVG repainting the same path) or many duplicated animated elements is a finding; name its purpose or remove it.
- Strength and units: conditional heuristic; not empirical proof or WCAG requirement. no prescribed geometry or timing.
- Trail: [R-SYN-007 provenance](sources.md#r-syn-007); C-T7-001, C-T7-004, C-T7-013, C-T7-014; 5eec36db-14a1-4649-a51c-6cd0dd533d3b, 0b9921a9-16dc-4386-9a4c-f11ae989990e.

## R-SYN-021

When work fails, say what failed, what is safe, and the next step, at the place the work was being done.

- Evidence: agent-synthesis; corpus-derived; published guidance.
- Scope: operational-ui; failed saves, loads, payments, sends and batch jobs, and lost connections. Audience: people mid-task. Platform: web.
- Action: Use one recovery pattern across the product, rendered at the failed block or control. It holds: (1) the cause in plain words, as far as it is known; (2) the state of the data: what saved, what did not, and that typed input is still there; (3) one next step that works from here: retry, edit, undo, or contact with a reference to quote — retry fits a transient cause, while a cause the user's own input reproduces (a validation error) needs the edit path named, not a retry that will fail the same way; (4) when showing older data, the time it was last updated. Other blocks keep working. If the outcome is unknown, as with a timed-out payment, say so and check status before offering retry, because a blind retry can do the work twice. A failure that needs action does not live only in a toast, self-dismissing or persistent.
- Reason: The person's questions after a failure are the same each time: did it happen, did I lose anything, what now. A bare "Something went wrong" answers none of them. A whole-page error also removes the working context they need to recover.
- Exceptions: Hide causes where naming them helps an attacker, such as which half of a login was wrong or that a record exists without permission. Show no timestamp where the system has no freshness data, rather than inventing one.
- Tradeoff: Specific causes need the backend to distinguish error classes. If it returns only a generic failure, state what is known, keep the next step, and report the gap instead of guessing a cause in the copy.
- Alternative: A short failure on a trivially repeatable action, such as a hover preview that failed to load, may be one inline line with retry.
- Near miss: R-SYN-006 says failure states must exist and be real; this card says what one contains. R-SYN-019 covers undoing a completed action. R-VIS-013 covers the state's shape and type scale. R-VIS-047 owns the weight class (a failure needing action never lives only in a toast, whatever its lifetime); this card owns the content. Do not write in a blaming or jokey voice: the corpus's playful error copy suits consumer delight surfaces, not someone whose invoice failed.
- Check: In source review, before any walk: list each failure branch and name its cause or stated unknown, data state, next step, and freshness. Then force each failure with the walk in [verification.md](verification.md#destruction-walk), and grep the product for a second failure wording or pattern: "one recovery pattern" is measured across pages, not on one. For each, read the message and name the cause or the stated unknown, the data state, and the next step. Take the next step and confirm it works, with input intact and the rest of the page usable.
- Strength and units: conditional heuristic. The corpus's retention and growth figures (60% new accounts, 79% deposits, a third of users abandoning, 25% of state reasoning omitted) are single-source and unchecked, so no rule depends on them.
- Trail: corpus-derived [batch 18, "The Psychology of Premium Apps"]; doc: [NN/g error message guidelines](https://www.nngroup.com/articles/error-message-guidelines/) (human-readable, precise, constructive, no blame). The unknown-outcome clause and the placement clause are v10.1 synthesis, unvalidated; owner chose the direction 2026-11-06.

## R-SYN-018

Guide first-run with a persistent checklist and inline validation, never a modal tour.

- Evidence: agent-synthesis; corpus-derived.
- Scope: first-run and setup surfaces on operational products; setup wizards, permission requests, empty-product onboarding.
- Action: Replace login-time multi-point modal tours with a persistent, dismissible checklist that ticks items off as the user completes real tasks. Validate setup forms by R-SYN-022 (after the answer, not mid-typing). Before a native permission prompt (notifications, location), show one explanatory screen stating the benefit. Split a long setup form by R-SYN-022.
- Reason: A modal tour is dismissed and forgotten before the work starts; a checklist sits beside the work and turns setup into visible progress. An unassociated submit-time error list makes the user re-read what they already typed; R-SYN-022 keeps submit reporting at each field.
- Exceptions: Legally required consent screens; one-time destructive warnings (R-VIS-007 territory).
- Tradeoff: A persistent checklist occupies layout; keep it collapsible and completable across sessions.
- Alternative: Sequential tooltips on first visit — only when the flow has under three steps and the checklist has no home.
- Near miss: R-VIS-031's empty states are the zero-record face of this card — the empty state starts the first checklist item.
- Check: On a fresh account: no multi-point modal tour appears; every setup task is reachable from the checklist; leaving a field with an invalid value shows the error at that field before submit (R-SYN-022).
- Strength and units: conditional heuristic; corpus retention and conversion numbers are folklore and deliberately not repeated as promises.
- Trail: corpus-derived [batch 9, "How Top Apps Design Onboarding"; batch 15, "The 3 dashboard UI flaws that give away you've NEVER built one"]; v9.3 synthesis, owner-approved.

## R-SYN-019

Execute reversible actions immediately with undo; confirm only the irreversible ones.

- Evidence: agent-synthesis; corpus-derived.
- Scope: operational actions on records and batches: delete, move, rename, send, apply.
- Action: Classify every action by reversibility. Reversible actions (delete-with-soft-delete, move, rename, send-with-buffer) execute immediately and surface an undo affordance — a toast with undo, or a staged queue — instead of a confirm dialog. Irreversible or high-blast-radius actions keep explicit confirmation restating who and what (R-VIS-007). Never both a confirmation and an undo for the same action.
- Reason: A confirm dialog taxes every intentional user to protect the rare mistake; undo taxes only the mistake.
- Exceptions: Audit or legal requirements may demand confirmation even for reversible actions. Batch operations confirm unless the whole batch is undoable as one unit.
- Tradeoff: Undo needs state machinery (soft delete, history, buffered queue); a system without it falls back to confirmation, named as a gap rather than a choice.
- Alternative: Destructive styling with verb-noun labels (R-VIS-007) and no confirm, for actions trivially recreatable.
- Near miss: R-SYN-006 still governs the async face — undo appears after real completion, not during.
- Check: List actions by reversibility class; reversible ones show no confirm and a working undo inside its window; irreversible ones confirm with verb-noun labels.
- Strength and units: conditional heuristic; undo window lengths (corpus cites ~5s buffers, 30-day soft deletes) are product decisions, folklore not law.
- Trail: corpus-derived [second-sequence batch 1 (106-110), "Why the best software must LIE to you"]; v9.3 synthesis, owner-approved.

## R-SYN-020

Answer wayfinding on every screen: where I am, where I can go, how I get back.

- Evidence: agent-synthesis; corpus-derived.
- Scope: multi-level operational surfaces — dashboards, drill-downs, sections, record views.
- Action: Each screen states its place through section identity aligned to the rail (R-VIS-011 governs alignment). A page has one name: the navigation item, the last breadcrumb and the h1 use the same words, and a record view may append the record's name. Drill-downs into one record prefer push navigation or a drawer over a modal when the user may want to compare records; creation and edit flows may isolate in a modal with explicit Save/Cancel verbs and dirty-state confirmation on cancel. Every step deeper preserves a back path returning to the originating context (list position and filters intact), and back controls label the destination, not just "Back". Primary destinations stay reachable from every screen; no catch-all "Home" that only re-dumps the menu. Search inputs carry a concrete example prompt ("Search by stall, tenant, invoice"), never a bare "Search...". On narrow screens, a navigation drawer closes after its destination is chosen — the page it navigated to is left visible, not the drawer.
- Reason: A user who loses place stops exploring; the labeled back path is what makes drill-downs safe to enter. A catch-all Home tab answers no question the sections have not already answered. A prompt-less search box hides its own capability.
- Exceptions: Modal flows that must complete or cancel (R-VIS-012, R-VIS-047). Print and embed surfaces.
- Tradeoff: A persistent breadcrumb and labeled back cost a line of layout; they replace the user's memory, which is more expensive.
- Alternative: Section tabs when the hierarchy is exactly one level deep.
- Near miss: R-VIS-011 governs breadcrumb alignment; this card governs whether the wayfinding answers exist at all.
- Check: From any record view, go back once and land on the originating list with state intact; every screen names its section, and the navigation item, last breadcrumb and h1 agree on that name; every search input shows an example prompt; no dead ends. At 390, open the drawer and tap an item: the drawer is gone and the new page's h1 is visible.
- Strength and units: conditional heuristic; no prescribed navigation depth limit.
- Trail: corpus-derived [second-sequence batch 3 (116-120), "WWDC22: Explore navigation design for iOS | Apple"; second-sequence batch 2 (111-115), "WWDC21: Discoverable design | Apple"]; v9.3 synthesis, owner-approved.

## R-SYN-022

Validate a field after its answer is finished, ask only what is used, and make the error say what to change.

- Evidence: measured; published guidance; corpus-derived.
- Scope: every form on an operational surface: create, edit, pay, filter and setup forms.
- Action: (1) Timing: show a field's error when focus leaves it or on submit, never while the field is being typed for the first time, before it has failed. After a field has failed, re-check it on each keystroke so the error clears when fixed. Fields whose rule is the point (password strength, name availability) may check live. Submit reports every failing field at once, at each field, with a summary that links to them when the form is longer than one screen. (2) Questions: every field names the task-map row that uses its answer; a field with no user is removed, not made optional. A long form for an occasional task splits into steps of one decision each and keeps answers between steps; a short form used many times a day stays on one page. (3) Fit: a field's width matches the expected answer (a postcode is not full width), and a label sits closer to its own field than to the next one (R-VIS-028). (4) Wording: the error names the field's problem and the fix in positive terms ("Use letters only", not "Invalid input"), with no apology and no blame.
- Reason: An error shown mid-typing interrupts an answer that is not wrong yet. An error shown only after submit makes the person search for it.
- Exceptions: Legal and payment fields whose validity cannot be known until the server answers report at submit by R-SYN-021.
- Near miss: R-VIS-032 owns field order and defaults; R-WCAG-3-3-1 and 3-3-2 own programmatic error identification and labels; R-SYN-021 owns failures of the request itself. Format hints shown before typing are help, not errors.
- Check: In each field type a wrong value one character at a time: no error before blur or submit. Leave the field: the error is at the field and states the fix. Correct it: the error clears while typing. Submit with two bad fields: both are marked. For each field, name the task-map row that uses it.
- Strength and units: the timing clause is measured on one study of 22 people and six form variants; treat it as a strong default, not a law. No field-width or step-count number is prescribed.
- Trail: measured: [A List Apart / Etre, "Inline Validation in Web Forms"](https://alistapart.com/article/inline-validation-in-web-forms/) (validating after the field was seven to ten seconds faster; validating before and while typing gave more errors and lower satisfaction). doc: [NN/g, error reporting in forms](https://www.nngroup.com/articles/errors-forms-design-guidelines/) (guideline 7: no error until the user has finished with the field); [GOV.UK, structuring forms](https://www.gov.uk/service-manual/user-centred-design/resources/patterns/form-structure) (one thing per page, question protocol). corpus: The UI/UX Playbook (field width, label proximity); "WWDC22: Writing for interfaces" (positive instruction). v10.5 council synthesis; replaces the as-you-type line R-SYN-018 carried since v9.3.

## R-SYN-023

Acknowledge a wait where it started, in proportion to its length, and keep what is already on screen.

- Evidence: measured; published guidance.
- Scope: any action or load that waits on real work.
- Action: Under about 0.1s add nothing. Between about 0.1s and 1s the control keeps its native pressed state and adds nothing heavier. From about 1s the control that started the work shows a working state and ignores repeat presses. A wait of about 10s or more, or a batch of known length, shows progress with words ("Updating 3 of 50") and a way to stop when stopping is safe. A refresh keeps the existing content on screen until the new content arrives, with its age when the system knows it; a populated view is never replaced by a full-page spinner.
- Reason: A press with no response gets pressed again. A blanked page loses the person's place.
- Exceptions: A first load with nothing to keep uses the skeleton (R-VIS-013). Determinate progress only when the end is computable (R-VIS-035).
- Near miss: R-SYN-006 requires that pending states exist and are real; this card sets what each length of wait shows. R-VIS-029 owns animation durations, not waits.
- Check: Delay each action's response to 3s and to 15s on a local or staging build. At 3s the control shows work within about 1s and a second press does nothing. At 15s there is worded progress. Refresh a populated list with the delay on: the old rows stay until the new ones land. Without a build whose delays can be injected, record the wait behaviour as unverified, not clean.
- Strength and units: the 0.1s, 1s and 10s limits are long-standing published thresholds (Miller 1968; Card et al. 1991), approximate by design.
- Trail: [NN/g, response time limits](https://www.nngroup.com/articles/response-times-3-important-limits/); [NN/g, progress indicators](https://www.nngroup.com/articles/progress-indicators/). v10.5 council synthesis.

## Informative modal comparison

NOTE-ext-apg-modal and NOTE-ext-apg-overview are informative, comparison-only, and not promoted. For an actual modal, compare initial focus, contained Tab navigation, Escape, inert outside content, an accessible name, and focus return. Initial focus depends on content and consequences. If the invoker disappears or the workflow advances, return to a logical successor. A nonmodal disclosure does not inherit a focus trap. APG resemblance is not conformance evidence. [Source notes](sources.md#comparison-notes).
