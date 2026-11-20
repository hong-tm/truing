# Hierarchy by restraint

Part of [visual-craft.md](../visual-craft.md). Read the index first; open this file only when its pattern applies. Why each rule exists: [evidence.md](evidence.md).

## R-VIS-010

**The headline statistic is a composed unit: one number, one micro-label, one supporting fact, no frame.**

- Scope: operational surfaces with one headline statistic.
- Action: number and micro-label on one baseline; one supporting fact below with its own micro-label; no border or background; one statistic per block; a genuine pair (this week vs last week) is allowed as comparison, not redundancy.
- Reason: number plus label plus example is one idea; a frame or a second statistic makes it a section with two entry points.
- Exceptions: a multi-stat summary may use a row of comparable figures under R-SYN-010's parallel-items condition.
- Tradeoff: unframed, the block depends on spacing to stay attached; drop the spacing and it floats.
- Check: at 1440 and 390 — one number, one supporting line, no frame.
- Near miss: two compared figures are a pair, not a violation.

## R-VIS-015

**Structural labels are quiet and consistent: sentence case by default, at a readable size.**

- Scope: tables, definition lists, summary blocks, section headers on operational surfaces.
- Action: structural labels at meta size (12px or larger), medium weight, muted foreground token at 4.5:1 or better, sentence case; one label style per page, owned by one type role. Uppercase only where the design system already commits to it, and then with the same size and contrast floor.
- Reason: a label should separate structure from data at the lowest cost; capitals on every header cost scanning speed and add noise.
- Exceptions: brand names, identifiers, and acronyms keep their casing; caseless scripts keep the muted small-label treatment only. Disabled controls (native `disabled` or `aria-disabled`) are exempt from the contrast floor, as WCAG 1.4.3 exempts inactive components. An item a filter de-emphasises but the user can still open is not inactive: its text keeps 4.5:1, or 3:1 for large text.
- Tradeoff: a sentence-case label separates less strongly from data; rely on weight, colour and position.
- Check: at 1440 and 390, count label treatments (target: one); confirm no value string is uppercased. Read the source for literal capitals as well (`<th>STATUS</th>`): `render-audit` sees only CSS `text-transform`.
- Near miss: a single tracked uppercase context label in a switcher is fine; a page of them is not.

## R-VIS-018

**Color carries structure through a ladder of neutral surfaces and borders, and carries meaning through one accent per component group and semantic state color; the 60-30-10 split is a marketing-page heuristic, not a data-surface rule.**

- Scope: color choices on any surface with a design system; overrides and new tokens.
- Action: (1) build structure from a neutral ladder — at least four surface steps (about four in practice) and one or two border steps; in dark theme widen the lightness gaps (roughly 2% steps in light become 4-6% in dark) and let elevated surfaces grow lighter with elevation (R-VIS-021); (2) borders on light surfaces are high-lightness strokes (around 85% white territory), not black lines; (3) concentrate chromatic accent on interactive and state-bearing elements — one accent family per component group; (4) semantic colors (success, warning, destructive, info, chart series) are exactly where multi-color belongs: badges (R-VIS-001), charts (R-VIS-004), and state indicators keep full semantic color in both themes, with chart series ramped in OKLCH — lock lightness and chroma, step hue about 25-30° per series; (5) never "clean up" a dashboard by stripping chart or state color into grayscale; (6) check dark-theme border opacity — a border that disappears on dark has failed, raise its token step.
- Reason: structure needs enough neutral steps to separate depth without decoration, which a single 60% background cannot give a data-dense surface; accent works by scarcity; semantic color works by meaning. Desaturating meaning-carrying color removes information while saving nothing.
- Exceptions: brand-driven showcase surfaces may carry more accent; 60-30-10 remains a usable first draft for marketing pages with large flat color areas — a decision recorded per project, not a default for dashboards.
- Tradeoff: the ladder numbers (four steps, 85% strokes, 4-6% dark gaps, 25-30° hue steps) are craft heuristics from one critique source and sampled products, not measurements; treat gross deviation as a smell to investigate, not a failure. A system with fewer surface tokens can start with three steps and note the gap.
- Check: screenshot light and dark; count distinguishable surface steps behind one representative page; confirm charts still show distinct series colors, badges their semantic colors, and card borders visible in dark; note the share of accent-colored area on one representative page. A read-only info bar uses no fill beyond one neutral surface step and no border beyond the border token; a filled bar carrying only read-only facts is a finding.
- Near miss: a page whose only saturated elements are one primary button and one status chip is the intended outcome, not an under-colored page.

## R-VIS-019

**Large display type gets negative tracking and tight line-height; body text keeps its normal tracking and looser leading.**

- Scope: display headings and large statistics on any surface; body text is explicitly out of scope for negative tracking.
- Action: (1) apply modest negative tracking and line-height around 1.1–1.2 to large headings and the KPI statistic when the design system does not already encode it; (2) leave body tracking alone (positive or zero), body line-height near 1.5; (3) if the system has heading tracking tokens, use them rather than per-page values.
- Reason: glyphs at large sizes grow apart optically; tightening restores apparent density, and every sampled production system does it — while squeezed body text is a well-known readability failure.
- Exceptions: scripts without letter-spacing conventions; mono identifiers keep their natural spacing.
- Tradeoff: over-tightening collides at small widths; verify the longest heading at the narrowest supported width.
- Check: inspect computed letter-spacing and line-height for the page's largest text at desktop and one narrow width; confirm body text is untouched.
- Near miss: a 14px label with slight negative tracking is out of scope here and governed by R-VIS-015's convention, not this card.

## R-VIS-021

**Light-mode depth comes from layered, low-opacity soft shadows; dark-mode depth comes from surface lightness steps, and borders must survive both themes.**

- Scope: cards, panels, popovers, menus on surfaces with an elevation concept.
- Action: (1) in light mode, prefer the system's shadow tokens — layered, low-opacity, high-blur — over single hard shadows; (2) in dark mode, do not lean on shadows: step surface lightness per elevation level and keep the border visible (raise the border token step in dark if a 1px line disappears); (3) verify both themes by rendering, since dark failures are invisible in code review.
- Reason: shadows on dark surfaces barely register, so elevation must come from lightness; and the round's actual dark-theme defect was a border nobody could see.
- Exceptions: flat design systems with no elevation concept — then visible borders carry all separation.
- Tradeoff: lightness-stepping needs surface tokens; a quick repair may only be able to raise border contrast — do that, and note the token gap.
- Check: screenshot cards, popovers, and menus in both themes; confirm each level is distinguishable from its parent and borders are visible.
- Near miss: a shadow that reads as a smudge on a light surface is usually opacity too high or blur too low, not "too many shadows".

## R-VIS-027

**Hierarchy is built from weight and foreground-lightness deltas inside the existing scale before any new size is introduced.**

- Scope: any composed surface where more hierarchy is asked for.
- Action: (1) when two texts need different importance, first change weight (one step apart at minimum) or drop the secondary to the muted foreground token; (2) only add a size step when weight and lightness are already in use and still insufficient; (3) keep at most two weights per section and two foreground tiers per surface, all through the system's tokens.
- Reason: size steps are the most expensive hierarchy unit — they break the scale cap (R-VIS-017), inflate rhythm, and read as shouting; weight and lightness deltas survive resizing and dark mode.
- Exceptions: a designed display moment (R-VIS-017's exception) may use size deliberately.
- Tradeoff: weight-based hierarchy can look flat on low-DPI screens; verify the delta is visible, and if not, move a step further before adding a size.
- Check: list each hierarchy pair on the page and name which property separates it (weight, lightness, or size); size should be the minority answer.
- Near miss: using a size the system already provides is not "a new size" — the cap counts distinct computed sizes (R-VIS-017).

## R-VIS-046

**Inside a card, reading has three tiers — the hook, the context, the finisher — and a card with no tiers reads as noise.**

- Scope: dashboard cards, KPI blocks, and list items on operational surfaces.
- Action: (1) tier 1 hook: the one number or phrase the card exists for, the strongest weight or size in the card (built with R-VIS-027's weight and lightness before size); (2) tier 2 context: comparison, period, micro-label — muted, one level down; (3) tier 3 finisher: the trailing action or link ("View detail"), smallest and quietest but reachable; (4) two or more same-weight elements inside one card is the failure this card exists for; (5) across the page, the eye path should run hook to hook and end in an action — entry point, secondary focus, final call-to-action.
- Reason: a flat card makes every element compete; the eye needs exactly one entry point per card and a defined exit, and it registers size contrast long before it reads the words.
- Exceptions: R-VIS-010's composed unit is the minimal case (hook plus one supporting fact); a plain content card with no action may legitimately end at tier 2.
- Tradeoff: strict tiers can over-fragment a small card; a card that cannot support three tiers is a candidate to merge or demote (R-SYN-009's block-existence question), not to flatten.
- Check: squint at each card; name the element the eye hits first, then the muted context, then the reachable end. If two elements tie, fix before shipping.
- Near miss: a finisher visually louder than its hook is R-SYN-012's competing-focus failure, not a styling choice.
