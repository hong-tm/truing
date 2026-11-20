# Show only what is true

Part of [visual-craft.md](../visual-craft.md). Read the index first; open this file only when its pattern applies. Why each rule exists: [evidence.md](evidence.md).

## R-VIS-004

**Charts are chosen by data shape, colored from chart tokens, and honest when empty.**

- Scope: any chart or data visualization on an operational surface.
- Action: (1) match chart type to data shape — time series use line or bar, category comparisons use bar, part-to-whole only when the parts are few and distinct; never a radar chart for a time series; (2) take every series color from the design system's chart token set (`--chart-1..n` in shadcn), never hardcode hex per page; (3) with zero data, replace the plot with the empty state from R-VIS-031; (4) chart colors must be readable in both themes, which usually means theme-scoped chart tokens, not one shared palette.
- Reason: a wrong chart type makes correct data unreadable; hardcoded colors drift per page and per theme; drawn-but-empty axes lie.
- Exceptions: a bespoke visual identity piece may step outside chart tokens with the owner's decision.
- Tradeoff: token-bound chart palettes are less vivid than hand-picked ones; consistency and theme correctness win.
- Check: for each chart, name its data shape and its type; grep for non-token hex values inside chart components; render the empty dataset. Render each chart with its overlaid marks (fills, dashes, reference lines) in both themes: a mark indistinguishable in either theme, or one opacity where the two themes need different ones, fails — theme-scoped chart tokens are the fix.
- Near miss: a sparkline without axes is a chart and still needs an empty state and token colors.

## R-VIS-007

**Every action label states its consequence, and an action is only offered when its object exists.**

- Scope: buttons, row actions, dialog confirmations, bulk-action bars.
- Action: (1) label each action with verb plus object ("Send reminder to Siti", "Purge 30-day logs"); (2) disable or remove the control when the action's precondition is absent and this person can change it (no due date means no reminder button, or a visible disabled state with the reason); an action their role never has is R-INF-018's, not a disabled state; (3) a confirmation dialog restates who, what, and when in its body, and its buttons carry explicit verb-noun labels; (4) destructive actions use the system's destructive styling; (5) name the object at the level the reader must tell apart: when one parent holds several actionable records (two unpaid bills on one stall), the label and the confirmation name the record and its amount, not the parent.
- Reason: a label that hides its consequence makes the user simulate the system in their head; an impossible action offered is a broken promise.
- Exceptions: navigation verbs ("Back") and universally understood icon actions with accessible names.
- Tradeoff: explicit labels are longer; a tooltip may carry the object when the row context already names it, but the accessible name must include it.
- Check: for each action, ask "what exactly happens, to what?"; enablement conditions must be derivable from the row's own data; two actions on one parent that differ only by an icon fail.
- Near miss: "Delete" on a row whose name is in the same row is acceptable; "Delete" in a dialog about three different records is not.

## R-VIS-024

**A KPI block earns its number with baseline context: what it compares against, in the same composed unit.**

- Scope: dashboard KPI cards and chart titles on operational surfaces.
- Action: (1) each headline number states its scope when any other view of the same entity could differ (period, filter, count basis); (2) when a comparison exists (previous period, target), show it as the supporting fact of the composed block (R-VIS-010) or as the chart's summary title sentence; (3) a delta gets a direction, not just a color.
- Reason: an unscoped number invites the reader to assume the scope, and two differently-scoped numbers then read as a bug (R-VIS-002's failure mode).
- Exceptions: a number with only one possible scope (total count of a fixed set) may stand alone.
- Tradeoff: scope labels add words to a block that wins by brevity; keep it to a word or a date range in the micro-label.
- Check: for each KPI, name its scope from the rendered page alone; compare it with the detail view's own scope.
- Near miss: two numbers with different scopes are legal when each is labeled (R-VIS-002's exception); unlabeled divergence is not.

## R-VIS-030

**Content is designed at its real length: long strings truncate with the full value one interaction away, and no product surface ships placeholder text.**

- Scope: table cells, list titles, KPI labels, and any surface rendering user-supplied or domain text.
- Action: (1) apply the system's line-clamp/truncation utilities to any string that can exceed its container, with the full value reachable via tooltip, detail view, or expansion; (2) an identifier-style long string (IDs, references) truncates from the middle or by prefix, keeping the distinguishing end visible; (3) design and review with realistic worst-case strings, never placeholder filler.
- Reason: a layout that only survives short fake strings breaks on first contact with a real user; a visible full-value escape keeps truncation honest.
- Exceptions: editorial surfaces where the copy is fixed and designed may lay out without clamps.
- Tradeoff: truncation hides information by design; the escape hatch (R-VIS-003's row detail or a tooltip) is mandatory, not optional polish.
- Check: inject a 120-character name and a 4-word label into the changed surface; confirm no overflow, no wrap-induced row-height jump, and the full value reachable. Read every input's shipped placeholder at 1440 and 390; it must render whole — a placeholder cut mid-word or ellipsized fails (shorten the copy; caret scrolling is not a fix).
- Near miss: a wrapping two-line cell that is designed to wrap (R-VIS-006's content-height variance) is not a truncation failure.

## R-VIS-035

**Progress is honest about what is known: a determinate bar when the end is computable, an indeterminate indicator or skeleton when it is not — never a fabricated percentage.**

- Scope: any async task surface in an operational product: exports, imports, batch operations, background jobs.
- Action: (1) if remaining work or time is computable, show a determinate bar with real increments; (2) if not, show an indeterminate indicator or the layout-holding skeleton (R-VIS-013) and label the operation in progress; (3) never animate a fake percentage toward a fabricated completion; (4) on completion, replace the indicator with the result plus the next action, not a silent disappearance.
- Reason: a progress bar is a promise about time; a fake one spends the product's credibility on an animation, and the 99% stall has taught users to read fabricated bars as lies.
- Exceptions: staged multi-step processes (per-step determinate, total indeterminate) may show step position ("Step 2 of 4") without a time claim.
- Tradeoff: indeterminate waiting feels longer than watched progress; a real cancellation affordance on long unknown tasks compensates better than a fake bar.
- Check: trigger each long task; confirm the indicator class matches what the code actually knows about progress, and completion lands in a visible state.
- Near miss: a shimmering skeleton is the loading-face of this rule (R-VIS-013) — same honesty, applied to layout instead of a bar.

---

## R-VIS-051

**A product preview is the real product — its own tokens, components and data — never a generic mock.**

- Scope: marketing and landing surfaces that show the product (animated demos, screenshots, previews), and product screens embedded elsewhere.
- Action: build the preview from the product's own colors, fonts, radius and real components or fragments (a real record's controls, the app's own badge), not placeholder-gray wireframes or a template that merely resembles the product. An animated demo plays a planned story of three to five moments inside about 10–16 seconds, carries three to seven real words (the rest are bars standing in for text), and ends where it began so the loop restart is invisible; the cursor moves in a curve like a hand; the phone version is composed for the phone, not a shrunken desktop; a reduced-motion still carries the same message.
- Reason: buyers judge the website as the first preview of the product; a generic mock reads as a mock. The five ways generated previews fail — bland (the asked-for style absent), too much (every row full of real text), wireframe (gray boxes), boxed (the whole app shrunk into a card), flat — are all failures to reuse the real thing.
- Exceptions: an unreleased product may use honest concept art, labeled as a concept; a plain screenshot adds only its framing.
- Tradeoff: building from real parts constrains the demo to what exists; a mock is freer and less true, and that freedom is the defect.
- Check: for each product visual on the surface, name the product part it reuses (token, component, real data fragment); a visual that names none fails. Play an animated preview twice: the restart is invisible. At 390 the preview recomposes rather than shrinking. With motion frozen, the message survives.
- Near miss: R-VIS-037 owns the surface's signature; this card owns the preview's truthfulness. R-VIS-030 owns real content in shipped screens; this card owns marketing surfaces.

---

## What this draft does not settle

1. No rule here is validated by a second product or a second builder; the the rental app numbers come from one 13-page project reviewed by three models and the owner.
2. Corpus numbers (60-30-10, -2% to -3% tracking, 24px cap, 6 sizes, 44px targets, 150-600ms motion budgets) are craft folklore repeated across sources, not measurements; where the the rental app measurement and the corpus agree (4px grid, 32/24/16 gap roles), that agreement is noted but is still two sources of the same tradition, not an experiment.
3. Nothing measures perceived quality. A page can satisfy all thirty-six rules and still look ordinary; that judge is the owner's taste, not a checklist.
4. Rules that depend on looking (R-VIS-011's dark borders, R-VIS-021's dark depth) need a rendered screenshot in the verification path; code review cannot see them.
