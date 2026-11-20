# One system, one source

Part of [visual-craft.md](../visual-craft.md). Read the index first; open this file only when its pattern applies. Why each rule exists: [evidence.md](evidence.md).

## R-VIS-000

**Every visual change is expressed through the existing design system; a missing step is added as a named token, never as an inline one-off.**

- Scope: any change to a product that already has a design system, component library, or token file. Applies to layout, radius, and color as much as to type.
- Action: (1) express the change through the system's scale classes and existing components first; (2) when the system has no step for a needed value, add a named token through the system's own mechanism (Tailwind v4 `@theme` entry), named for its meaning, not its page; (3) a ratio that belongs to one page stays page-scoped and commented; (4) a recurring page-level pattern is extracted into a shared component; (5) component variants are changed in the component's own definition file (cva), not by class overrides at call sites; (6) use the system's native radius and shadow steps — never force machined squares or custom geometry over the system's radius scale; (7) browser-default controls (select, date, checkbox) and embedded third-party surfaces (payment elements, maps, editors) keep light styling on a dark surface — the system owns their colours where the embed allows it, and a native control or unthemed embed left outside the theme fails the way an inline one-off does; an embed that cannot be themed is an owner-recorded exception, never a silent light island.
- Reason: an arbitrary value in one page is invisible to the next page; the product drifts while every page looks locally fine. Owner review of the 13-page round rejected exactly this drift.
- Exceptions: throwaway prototypes and print exports that never enter the app shell; a documented 1–2px optical correction.
- Tradeoff: tokenizing adds indirection; keep single-use names out of the theme and name by role.
- Check: search the diff for `-\[` and inline `style` width values; every remaining hit must sit under a comment naming its scope and ratio. Confirm the tokenized version renders identically. Screenshot the dark theme of any page embedding a third-party control: no light island survives except an owner-recorded exception.
- Near miss: `w-2/5` is a scale class and passes; `w-[40%]` is the same number and fails. A scale class used to carry a role is also a miss: `text-2xl` on every page title passes the bracket search but leaves the title size owned by 14 call sites, so R-VIS-014's ratio has no owner (the rental app round, owner correction 2026-11-03).
- Landing it on shadcn/ui with Tailwind v4 (the rental app round, verified pixel-identical at 1440 and 390 in both themes):
  - Type roles become `@utility type-<role>` blocks in the theme stylesheet (`type-page-title`, `type-stat`, `type-label`, `type-section-title`, `type-display`). Each one sets size, line height, weight and tracking together. Do not use `--text-*` theme keys for roles: `cn()` reads an unknown `text-*` class as a colour.
  - Teach `cn()` the roles: `extendTailwindMerge<'type-scale'>` with a `type-scale` class group that conflicts with `font-size`, `leading`, `font-weight` and `tracking`. Without it a component default such as CardTitle's `leading-none` silently beats the role's line height: the rental app's auth titles shrank from 32px to 24px.
  - Write line heights that compute to whole pixels, for example `calc(var(--type-title) + 0.5rem)`. The build minifier rounds `calc(2 / 1.5)` to `1.33333`, which gives 31.99px and shifts every element below it.
  - Brand colour: one `--brand` variable in `:root` and in `.dark`. Roles derive from it: `--primary: oklch(from var(--brand) 0.55 c h)` where contrast needs a darker step, and `--series-1: var(--brand)`. Register `--color-brand` in `@theme inline`.
  - Verify a pure refactor with a pixel diff against the previous build: only intended changes may differ.

## R-VIS-001

**One status badge grammar per app: one shared component, severity-ordered colors, verified in both themes.**

- Scope: status chips, badges, and pills across operational surfaces, app-wide.
- Action: build one badge component; map each status to a semantic variant ordered by severity (critical destructive first, success and info distinct, neutral muted); which state earns the strong variant on an operational page is decided by its next action (R-INF-005), so a finished state such as Rejected stays quiet while the state waiting on the reader is marked; color is a state signal, not decoration — filled semantic variants unless the tint is contrast-checked against both theme surfaces; check the dark-theme border and text legibility by rendering, not by assumption.
- Reason: three grammars mean the reader relearns the vocabulary on every page, and quiet states disappear; the the rental app dark-theme failure (a tint destructive chip was unreadable on dark) was found only by looking at a screenshot.
- Exceptions: a chip carrying the page's only alarm may take the filled form and more weight (R-SYN-012 still applies).
- Tradeoff: one component adds a mapping layer; per-page badges would be locally simpler and globally inconsistent.
- Check: screenshot every badge variant in light and dark; confirm one component renders all of them and each state is distinguishable at 12px.
- Near miss: two chips of different statuses sharing one color because the two states never co-occur on a page is acceptable if the component grammar still distinguishes them.

## R-VIS-002

**One number, one truth: a fact that appears on two pages is computed once and rendered by one shared source.**

- Scope: any multi-page operational product where the same entity or total appears on more than one surface, including a chart and the number it sits beside on one surface.
- Action: derive every displayed number from one data source (single fixture, single API derivation, or a shared formatter); when a KPI uses a different scope than a detail list (for example, all-time versus filtered month), label the scope next to the number; a rollup shown on one page must equal the composition shown on another. A chart bound to a KPI block ends at that block's number: the headline is recomputable from the rendered geometry (the line's endpoint height, the last bar), and a normalization that erases the headline's magnitude fails (scope labels are R-VIS-024's, the title's wording R-SYN-013's).
- Reason: two pages disagreeing about the same fact destroys trust in both, and the error fools reviewers and users at the same time.
- Exceptions: numbers that are genuinely different facts (this-month versus all-time) are allowed if each is labeled at the point of display.
- Tradeoff: a single derivation adds coupling; the alternative is cross-page contradiction, which costs more.
- Check: for each shared fact, search all pages for its render path and confirm one source; recompute totals after data changes. For a chart bound to a KPI block, read the last rendered point from the geometry and confirm it equals the printed number.
- Near miss: two displays of the same count with different formatting (1,204 vs 1204) are the same truth; different values are not.

## R-VIS-005

**Dates, money, and counts are formatted by shared system formatters with tabular figures; monospace is reserved for identifiers, never prose or labels.**

- Scope: tables, lists, summaries, dialogs — every surface that restates a stored date, currency amount, or count.
- Action: (1) write one date formatter and one money formatter in shared code and use them everywhere; data surfaces use `YYYY-MM-DD` and fixed-precision money; (2) apply tabular figures (`tabular-nums`) to every date, count, and money value so columns do not breathe; (3) use the mono font family only for record IDs, hashes, and similar machine identifiers; (4) the dialog that restates a row's facts uses the same formatter as the row; (5) a value is one unbreakable token: no line break between currency and amount, inside a date, or inside an ID. When the space is too narrow, the whole value moves to its own line.
- Reason: mixed formats in one product read as different facts; proportional digits break vertical alignment; mono prose is a category error the owner called out by name.
- Exceptions: prose sentences, customer-facing emails, and legally required local formats keep the long form; make column widths tolerant of the longest locale string.
- Tradeoff: ISO dates read cold in a sentence; keep them to data surfaces.
- Check: render with two locales (en-US, zh-CN) and compare column widths and row heights; grep for page-local date or money formatting calls; at 320 and 390 wide, read every money, date and ID value and confirm none is split across lines.
- Near miss: a localized date inside a prose sentence beside an ISO date in a cell is acceptable when the sentence is prose.

## R-VIS-014

**One type scale per surface, with a bounded ratio between the page title and the largest number.**

- Scope: any page showing a headline statistic, dashboard, or list header.
- Action: four roles carry the surface (page title, one statistic, body, meta) inside the six-size ceiling of R-VIS-017, with the statistic about 1.3x to 1.5x the title and no larger than 40px on an operational screen; weights follow roles: title and header labels share one weight, body stays regular, numbers hold one weight across the page. Own the scale in the theme (R-VIS-000): each role is one named type token, and the statistic is derived from the title token by the ratio (`calc(var(--type-title) * var(--type-stat-ratio))`), so retuning the title keeps the bound. Call sites name the role, never a raw size.
- Reason: hierarchy is relative; a statistic that dwarfs its own title inverts the declared reading order.
- Exceptions: a monitoring surface whose single number is the product may exceed the ratio; the title becomes a label.
- Tradeoff: the bound can under-serve a genuinely critical number; give it the composed block (R-VIS-010), not a bigger font.
- Check: list computed sizes and weights at 1440 and at 200% text; ordering holds at both. Search app code for raw role sizes (`text-lg` and up outside vendored components): each hit is a role with no owner. Every declared weight is actually loaded: `document.fonts.check` is true for each family/weight pair in use — a computed 700 the browser synthesizes (faux bold on display type) fails.
- Near miss: a 28px statistic under a 24px title is deliberate emphasis, not inversion.

## R-VIS-016

**One spacing scale, with section gaps larger than inner gaps and no values in between.**

- Scope: any composed page.
- Action: a short scale (4, 8, 12, 16, 20, 24, 32) with roles: 32 between page header and body, 24 between groups, 16 within a group, 4–8 inside a text stack; never introduce an off-scale value for one gap.
- Reason: rhythm is perceived across gaps; one off-scale gap makes its neighbours look wrong and invites more ad-hoc fixes.
- Exceptions: documented 1–2px optical corrections against borders or icons.
- Tradeoff: a strict scale can feel airless at large type; scale section gaps with the measure, not the font.
- Check: list computed gaps between header, summary, table, and within cells; each on the scale.
- Near miss: an 18px gap that optically equals the 16px beside a border is a correction, not a violation.

## R-VIS-022

**Nested corners stay concentric: the inner radius is the outer radius minus the padding, and radius steps come from the system scale.**

- Scope: a container nested inside a rounded container with padding between them (images in cards, panels in cards).
- Action: derive the child's radius from the parent's radius minus the padding, via the system's radius tokens and `calc()`; never give parent and child the same radius, and never zero out a system radius for a "sharp" look without a recorded decision.
- Reason: equal radii on nested boxes pinch optically at the corners; the formula is the known fix, and it keeps the geometry inside the token system.
- Exceptions: pill-shaped children (capsules) keep their own curvature; bleed layouts where the child touches the parent's edge.
- Tradeoff: chained calc adds coupling — that is the desired behavior, since changing the parent radius should update the child.
- Check: for one nested pair, compute outer radius minus padding and compare to the child's computed radius.
- Near miss: a child touching the parent's inner edge follows the parent's radius, not the formula.

## R-VIS-033

**Row identity is recognition (avatar plus name, never avatar alone), and icons come from one stroke-consistent family whose weight marks state.**

- Scope: list and table identity cells; icon usage across an operational product.
- Action: (1) an identity cell renders avatar and name together — an avatar without its name forces recall and fails screen-reader and scanning use; (2) all icons come from one family with consistent stroke weight and corner radius (the project's existing icon library), sized to the adjacent line-height; (3) selected/default states differ by icon weight or fill, giving at least the two visual changes of a state change; (4) an icon-only control keeps its accessible name (R-VIS-020); (5) an avatar that fails to load renders its fallback — the name's initials on a neutral tinted surface, never a blank or broken-image box; the fallback is auditable from source: an img avatar carries a failure handler (onerror, an error listener, or a wrapper that swaps in the initials) — an img with no handler fails from source alone.
- Reason: faces and names are the cheapest identity tokens a row can carry; mixed icon families read as different systems, and weight parity is what makes a selected state legible without color alone.
- Exceptions: dense grids where space forbids both avatar and name may drop the avatar, never the name.
- Tradeoff: avatars add render cost and privacy surface in some domains; the name is the mandatory half.
- Check: scan identity cells for any avatar without a text name; collect distinct icon sources on the changed surface (target: one family); toggle a selected state and confirm two visible changes. Block one row's avatar src: the initials fallback renders beside the name.
- Near miss: an initials badge is an avatar for this rule; it still needs the name beside it.
