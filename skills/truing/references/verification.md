# Verification

This procedure applies R-RUN-001, with each relevant branch's observable checks. Report evidence, exact command or tool, viewport or input mode, result, and limitation. Use the project's existing scripts for build, diagnostics, and related tests; inspect their declared behavior before running them. A failed command is evidence to investigate, not a pass.

For assessment, make no file change. For an authorized repair, inspect the diff and the rendered page. Compare before and after for:

* named task answerability and factual content
* primary, secondary, destructive, rare, and recovery actions
* filters, sorting, navigation, detail return, and audit paths
* empty, loading, pending, error, retry, and success states that actually exist
* keyboard, visible focus, touch, labels, associated errors, and focus return
* closed-state disclosure: for every navigation or disclosure control, from the closed control alone (visible label, accessible name, and text in the same visual group), the destinations or their specific category are identifiable before activation, not only after opening; an answer of only generic links, more or options fails, and a title attribute or hover-only tooltip does not count
* block necessity: produce a block inventory naming, using only supplied facts, the decision, action, or required disclosure each block supports; a block that supports no named task is removed rather than retained, and every removal has a reason other than appearance
* container justification: for each card, panel, or bordered box, state either two or more parallel items sharing one field set, or the separate-object reason; a frame around prose, a single figure, or a single link fails
* attention budget: at narrow and wide widths and at enlarged text, list elements that read as visually dominant, whether by size and position alone or by size plus saturation plus contrast; more than one competing primary element fails unless a stated exception applies, and no measured gaze path is claimed
* justification proximity: for every control, name the fact a reader needs to use it correctly and confirm that fact appears with or before the control at narrow and wide widths; a control justified only in another section fails
* wide and narrow layout, including 320 and 390 CSS pixel widths and 200% text as useful stress cases, plus reduced motion

The viewport choices are verification defaults, not universal layout dimensions. The precise reflow and resize requirements and exceptions are in [accessibility-and-responsive.md](accessibility-and-responsive.md). Preserve two-dimensional content when its meaning requires it. Record the actual text-resize or zoom method. Test themes only where the brief includes them.

For async work, trigger invalid input, pending, an error, retry, and success when present. Compare inputs and the true result or reference, not just a success-colored message. Also check rapid repeated activation and a late result after cancellation where relevant. For a scoped change, exercise its real runnable entry point and inspect its rendered before/after state. Report untouched or unavailable paths separately.

Use event or state completion, not fixed sleeps or animation duration. Synthetic DOM checks do not prove real HTTP cancellation, screen-reader speech, hardware touch interoperability, original media fidelity, or empirical usability. Mark each as unverified when it was not exercised.

Numbers and geometry are measured, not read. For every chart or KPI block with a printed total or a claimed difference, read the value from the rendered geometry — SVG `getPointAtLength`/`getBBox`, the last bar's height — and compare it to the text node, in both themes. A screenshot PASS never closes a numeric claim: judging the picture is exactly how a wrong chart passed twice.

Build preservation: when the pipeline minifies or rewrites CSS, each `--animate-*`/`@keyframes` definition must keep its frame count from source to built artifact. Compare the counts in CI, source against served asset; a minifier that eats keyframes turns a designed sequence into a broken one while the build stays green.

## Destruction walk

Run this on any page with real async work, against a local or staging build. Never on production data or real payments. The happy path proves little: states nobody exercised are where a page is roughest. Force failures at the network layer rather than editing the code under test. In Playwright, use one of these per break, not all together, because the most recently added route for a pattern wins:

```js
await page.route('**/api/orders', r => r.abort(), { times: 1 })            // connection lost
await page.route('**/api/orders', r => r.fulfill({ status: 500 }), { times: 1 }) // server failure
await page.route('**/api/orders', r => r.fulfill({ json: [] }))            // empty data
await page.context().setOffline(true)                                      // offline mid-flow
```

Walk the page's main task from start to finish and break it once per row, at the step that hurts most:

| Break | Where | Pass means |
|---|---|---|
| Connection lost | After typing, on submit | Input is kept, the cause is stated, retry works when the connection returns |
| Server failure | One block's load, then one save | That block recovers alone; the rest of the page still works |
| Outcome unknown | Timeout after the request was sent | The page says it does not know, and checks before retrying; no double submit |
| Empty data | Each list, chart and count | R-VIS-031 empty state; no broken axis, `NaN`, or zero presented as a real result |
| Session expired | 401 mid-form | The way back to sign-in returns to the same place with input kept, or says it will not |
| Slow response | Add a few seconds of delay | Pending state appears, controls stay truthful, a late response does not overwrite newer input |
| Refresh and back | Straight after a failure | The page tells the truth about what was saved |
| Keyboard up | A form's last field, with the primary action below | The action stays reachable and the keyboard dismisses without losing input |
| Leave and return | Mid-task on a form or in-progress edit | The in-progress state is still there; nothing silently resets |
| Deep link | A notification's item link | The page that opens is the one the notification named, not a default |
| Animation round-trip | Enter a sub-view mid-motion, then come back | Animations resume; nothing is frozen or stuck on its way out |

Skip a row the page cannot reach, and say so. For each row record what was forced, what the page showed, and whether its next step worked (R-SYN-021). Message text alone does not pass: take the next step.

A motion sequence is verified from a recording, not from a settled screenshot: record the sequence as it plays, compare its moments side by side, and fix the largest jump first. A code read or an end-state screenshot cannot see the mid-motion defects — an element that jumps slightly as it slides in, one moment where everything fades together, an animation frozen after a sub-view round-trip. Replay at half speed when the cause is not clear at full speed. A frame check catches mistakes; it cannot tell whether the idea is boring — the person still has to watch it.

Then walk the same task across screens and compare navigation position, control placement, field order, labels, and status words. Treat each difference with no task reason as a finding. Repeat the walk at the end of a repair, since new states are the easiest to leave unfinished.

Before closing, record each evidenced in-scope finding as repaired with an observed result, retained with the applicable exception, unresolved, or unverified. Apply the loaded branches' semantic checks to the requested path, including unchanged controls. A working activation or clean layout alone does not establish that meaning or hierarchy is repaired. This is an authored R-RUN-001 completion policy.

When `render-audit.mjs` ran, report its exit code and finding count as printed. Exit 2 means that run proves nothing. Report exit 0 as "measured floor passed", never as verified visual quality: on unseen fixtures the script finds about two thirds of seeded defects, and it measures no composition. A visual claim still needs the contact sheet and the render pair.

A final report should state changed files, retained facts and controls, applied rule IDs, evidence, limitations, and any unresolved material question.
