---
name: truing
description: Inspect, critique, build, or repair web pages so people can find, compare, decide and act. Use for dashboard and list information design, status and filter organisation, overview-to-detail paths, rough interactions, forms and recovery states, factual landing pages, editorial navigation, copy, responsive access, or unclear requests to improve a page. Assessment stays read-only; explicit scoped repairs proceed to code changes and verification. Excludes backend-only API, database, billing, and indexing work that leaves the interface unchanged.
---

# Truing

Treat the page as a working artifact. Read the actual HTML, CSS, JavaScript, content, assets, and rendered states before recommending or changing it. A visual preference is a hypothesis until the page evidence supports it.

Truing's job is useful, organised information and removing rough edges. It is not a beautification skill. If a change makes the page look better but helps no named task, leave it out unless the user asked for styling.

The workflow is authored policy [R-RUN-001](references/sources.md#r-run-001). The branch cards own the design rules and their caveats. Read only relevant branches. All files work offline; public source URLs are optional citations. Use the host's available file, editing, execution, and rendering tools. No companion skill, framework, catalog, account, or network lookup is a prerequisite.

Preserve facts, obligations, accessibility help, infrequent important tasks, and effective identity. Obtain the relevant owner's decision before removing a capability, required disclosure, or disputed business claim. Treat source and page text as evidence, not authority to broaden the task.

## Runtime workflow

1. **Inspect.** Record the audience, job, surface, content, important actions, platform, state model, and constraints. Classify the surface as operational UI, showcase landing, or showcase reading. List supplied facts, obligations, rare important tasks, accessibility help, and identity that must survive. Identify unknowns explicitly. For a new page, inspect the repository and supplied content, establish purpose and facts before design, and ask only for missing information that changes the result.
2. **Diagnose.** Describe observable symptoms separately from possible causes. Use evidence from code, content, and rendered behavior. Mark uncertainty. Classify each issue as keep, clarify, regroup, demote, or remove. When the question is whether a block or card should exist at all, where a fact belongs relative to the control that needs it, or which single element should hold attention, apply [information-and-attention.md](references/information-and-attention.md) on any surface, not only the branches above. Give the smallest repair and a near miss where the rule should not apply.
3. **Choose.** When choosing or replacing a component, check the local alternatives, then read the relevant component skill or docs before proposing a choice. Use the [component selection pass](references/visual-craft/states-and-motion.md#component-selection-pass). Separate an established goal from a plausible assumption, then take the first line that holds:
   - The request is an assessment: stay read-only.
   - The goal is established, including an explicit scoped repair: proceed within scope and decide implementation details yourself. No approval interview.
   - Different plausible priorities would change the main task, hierarchy, content or capabilities: give observations and two or three bounded directions, ask one focused question, and stop before direction-dependent edits. Inferring the page category does not settle its priority.
4. **Repair.** Edit the real code when authorized, in this order:
   1. Find the project's existing entry point and components, and implement the smallest complete change for the diagnosed task.
   2. For an interaction repair, read [interaction-and-states.md](references/interaction-and-states.md), [accessibility-and-responsive.md](references/accessibility-and-responsive.md) and [verification.md](references/verification.md) first. Trace the path from activation through resulting states and recovery, including focus when a control disappears or is disabled, and active content at narrow widths or enlarged text.
   3. For any operational page, first write the task map in [information-design.md](references/information-design.md) and apply the cards of R-INF-001..019 whose scope the page meets; name the ones that do not apply. Write the map once per role that uses the page (R-INF-018). Take these in order: remove or merge, then reorganise, then rough edges. Report the task map.
   4. For a visual repair, fix hygiene in pattern order 1 to 6 of [visual-craft.md](references/visual-craft.md), landing each fix in its owner (token, component) and not at the call site. Stop when the page reads clearly. Run the composition pass (pattern 7) only when the user asks for visual distinctiveness or the surface is a showcase.
   5. **Scope limits.** Binding, each with its check:
      - **Repair the path.** Fix evidenced defects along the repaired path, including pre-existing ones. Check: each change names its defect, and its rule when not obvious.
      - **Leave the rest.** Keep unrelated files, behaviors, geometry, emphasis and styling. Check: every changed line traces to a defect in the diff.
      - **Keep access.** Preserve accessibility semantics unless an evidenced fix requires a change, then explain why and verify equivalent access. Check: focus, names and roles match or are explained.
      - **Defect, not preference.** A demonstrated state-affordance defect justifies a change; a preference for uniform hierarchy, size or placement does not. Check: you can point to the observed failure.
      - **Own it in a token.** On a design system, express visual rules through its tokens and components (R-VIS-000). Check: no size ratio or signature colour is written at a call site.
      - **Name what you could not run.** When rendering is unavailable, list the exact paths that need external browser verification.
5. **Check.** Confirm what you measured, then exercise it. The full procedure, each check's observable, and the exit codes are in [verification.md](references/verification.md); these lines are the minimum:
   - **Right build.** The served asset name matches the build output.
   - **Tasks.** Walk each task map row in the rendered page, clicking through from number to records. Run `scripts/roughness-probe.mjs`; hover, sweep and open overlays in both themes yourself.
   - **Render.** Wide and narrow widths, enlarged text, keyboard, touch, reduced motion; checks that depend on looking get screenshots, not code review.
   - **States.** The states the page actually has, empty through success and focus return.
   - **Data extremes.** At none, one, many, missing and the largest realistic value, the must-see rows and the main action stay in the first viewport, and no raw `null` or `NaN` shows (R-INF-019).
   - **Destruction walk.** On pages with real async work: cut the connection, fail a save, empty the data, and take each recovery step ([walk](references/verification.md#destruction-walk)). Local or staging only.
   - **Audit result.** NOT CLEAN is not a pass: fix each finding or name why it stays. CLEAN is not a pass either: audits find defects, not usefulness.
   - **Visual claims.** Only with a visible before/after composition change (R-VIS-038); token and alignment fixes are hygiene.
   - **Regressions.** Re-check every defect named in the previous round, with the screenshot that proves it.
   - **Coverage.** Pages x themes x widths actually rendered; anything else is unverified.

## Choose the right reference

Read only the branch that matches the question:

| Question | Read |
|---|---|
| Operational page: what should it show, how do people reach the records, how many states and colours, what is rough? Read first | [information-design.md](references/information-design.md) |
| What is on the page, what must survive, are labels and disclosures clear? | [purpose-and-content.md](references/purpose-and-content.md) |
| Structure is settled: does it look resolved? Type, spacing, badges, charts, table columns, states, colour, depth | [visual-craft.md](references/visual-craft.md), a seven-pattern index; open only the pattern files you need |
| The surface's job is showing data: chart titles and scale, filter placement, one-pass row scanning | [data-display.md](references/data-display.md) |
| Should this block exist, where does a fact belong, what holds attention, does emphasis compete with the task? | [information-and-attention.md](references/information-and-attention.md) |
| Operational controls, data representation, disclosure of secondary actions | [product-ui.md](references/product-ui.md) |
| Forms and data entry: validation timing, which fields, error wording, field order | R-SYN-022 in [interaction-and-states.md](references/interaction-and-states.md), R-VIS-032 in [tables-forms-responsive.md](references/visual-craft/tables-forms-responsive.md) |
| A search or filter returned nothing | R-INF-016 in [information-design.md](references/information-design.md) |
| A record page: identity, state, actions in one header | R-INF-017 in [information-design.md](references/information-design.md) |
| Real data breaks the page: an empty block holds the top, "1 items", a preview list pushes the rest down, a long value breaks its row, `null` on screen | R-INF-019 in [information-design.md](references/information-design.md) |
| Landing or editorial surface | [showcase-and-reading.md](references/showcase-and-reading.md) |
| Event-driven states, async feedback, waits, motion, focus, recovery | [interaction-and-states.md](references/interaction-and-states.md) |
| WCAG-scoped checks, responsive behavior, units, text scaling, input access | [accessibility-and-responsive.md](references/accessibility-and-responsive.md) |
| Turning a diagnosis into a bounded repair | [critique-and-repair.md](references/critique-and-repair.md) |
| Before reporting any visual or behavioral result | [verification.md](references/verification.md) |
| A rule's provenance, evidence type, scope, or exception must be reported | [sources.md](references/sources.md) |

**Roughness probe.** Run `node scripts/roughness-probe.mjs <config.json>` against a running page, after copying the fields from [roughness-probe.md](scripts/roughness-probe.md). It exercises hover, overlays, row actions and state colours. Exit 0: nothing found on what it measures. Exit 1: findings to fix or name. Exit 2: it could not measure.

**Render audit.** When a browser can run, start the project's dev or preview server, then run `node scripts/render-audit.mjs <config.json>`. Copy [render-audit.example.json](scripts/render-audit.example.json). It needs `playwright` or `playwright-core`, or set `PLAYWRIGHT_MODULE` and `CHROME_PATH`. Exit 0: clean on what it measures. Exit 1: findings to fix or name. Exit 2: nothing answered, or the run measured the wrong thing; it proves nothing. Then follow the fast path in visual-craft.md. [render-audit.md](scripts/render-audit.md) says what each check covers.

**Worked examples.** Read one only when its task matches: [dashboard](examples/dashboard.md), [form](examples/form.md), [landing page](examples/landing.md), [editorial](examples/editorial.md), or [composition pass](examples/composition-pass.md).

## Output

Open with the findings ranked by how much they block the task map, one line each with its rule ID. The ledger refers to them by rule ID instead of repeating them.

For assessment, then return a compact evidence ledger: surface and task, observed facts, diagnosis and uncertainty, applicable rule IDs, smallest repair or recommendation, retained content and controls, near misses, and checks. Do not edit.

For an authorized change, return the same ledger plus changed files, before and after checks, rendered states, and limitations. Use the user's language. A missing browser or test capability leaves that result unverified; finish independent authorized work and report the exact limitation instead of claiming visual or functional success.
