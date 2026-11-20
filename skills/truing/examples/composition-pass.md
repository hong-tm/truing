# Composition pass: from correct to designed

Optional. Use only when the user asks for visual distinctiveness or the surface is a showcase. Synthetic illustration of the method, not an executed benchmark. Use it for pattern 7 of [visual-craft.md](../references/visual-craft.md), after hygiene. Express every move through the project's own tokens and components.

## 1. Write the brief before you touch code

Five lines, one per screen. A screen you cannot brief is not ready to compose.

```
Job:        Who comes here, to answer what?
Shape:      board | ledger | overview | form | story
Focal:      The one block that answers it, and the share of the first viewport it gets (45% or more)
Signature:  The product's own element or colour, and the few places it appears
Goes quiet: What loses size, frame, or colour so the focal block can lead
```

## 2. Pick the shape from the job

| Job | Shape | Focal block | Opening |
|---|---|---|---|
| Scan rows and act on some | ledger | The table | Title, one-line finding, one action, then rows at once |
| Compare state across many units | board | The grid of units, drawn from the product's own objects | Title, a legend that doubles as a filter, then the board |
| Answer one question | overview | One headline figure or one chart at scale | The finding as a sentence, the figure, one chart that explains it |
| Enter or change data | form | The primary action | Title, fields in output order, action at the end of the path |
| Persuade or explain | story | The claim with its proof | Claim, proof, one action; no dashboard furniture |

Two screens with different jobs must not share a shape by accident (R-VIS-044).

## 3. Wireframes at first-viewport proportion

```
LEDGER                     BOARD                      OVERVIEW
Title        [Action]      Title     legend/filter    Finding sentence [Action]
one-line finding           +--+--+--+--+--+--+        RM 48,200   caption
+--------------------+     |  |  |##|  |  |  |        +----------------+ small
| table, 70% or more |     +--+--+--+--+--+--+        | one chart,     | list
| of the first       |     |  |##|  |  |  |  |        | 45% or more    | of 3
| viewport           |     +--+--+--+--+--+--+        |                | facts
+--------------------+     aside: one quiet fact      +----------------+
```

```
FORM                       STORY
Title                      Claim, largest type on the page
one line: what this sets   one line of proof, with the number
+------------+ why this    [Primary action]   quiet second link
| fields in  | matters,    +----------------------------+
| output     | one fact    | proof: the product itself, |
| order      |             | real content, not a mock   |
[Save]                     +----------------------------+
```

## 4. Moves that read as designed

Use these in order, and stop when the blurred screenshot has one entry point.

1. **Scale jump.** Separate the focal figure from its neighbours by at least two steps of the project's type scale, within R-VIS-014's bound. One step reads as a mistake.
2. **Density contrast.** Dense focal block against an airy field, or the reverse. Equal density everywhere is what makes a page look like a kit.
3. **Frame removal.** Keep the frame on the focal block and take it off secondary blocks (R-VIS-010). Six equal cards are six equal claims.
4. **Signature at full strength.** The primary action and the lead data series use the brand token unmodified. Everything else stays neutral or semantic (R-VIS-018, R-VIS-037).
5. **Product object.** Replace one generic block with a drawing of the product's own object: a floor plan, a route, a pipeline, a shelf (R-VIS-040).
6. **Rhythm.** Between-section gaps at least twice the within-section gaps (R-VIS-016, R-VIS-028).

## 5. No tokens yet: bootstrap the minimum

When the host project has no design tokens, do not compose with ad-hoc values. Bootstrap the minimum first, then compose through it. Keep the bootstrap in one place (the theme stylesheet) so later work can replace it wholesale.

1. **One brand.** Pick one colour the product already owns (logo, storefront, or the client's identity). Define it once as `--brand` in the theme's `:root`, plus one quiet neutral ramp (background, surface, border, two text strengths) and the semantic set (success, warning, destructive, info). Derive dark-theme values by surface lightness, not by inverting hue.
2. **One type scale.** Five to six named steps with line heights, up to the display role for page titles and the focal figure. Nothing outside the scale; the display size is a role, not a one-off value.
3. **One radius, one shadow.** A single radius step (or two: control and panel) and one shadow per theme. The brand colour and the display step are the only loud elements (R-VIS-018, R-VIS-037).
4. **Check the bootstrap.** render-audit's type-ratio and contrast checks pass on an unmodified page before composition begins; a bootstrap that fails hygiene is not a baseline.

A bootstrap is scaffolding, not a decision. When the project adopts a real design system later, map `--brand` and the scale roles onto it and delete the scaffolding; the composition moves above survive unchanged.

## 6. Before and after, one ledger screen

Before: title, four metric cards, a chart, and a table starting at y=620. Render audit reports `no block holds 45%`. The blurred screenshot shows five equal blobs.

Brief: Job: find leases that end soon and renew them. Shape: ledger. Focal: the table, 75% of the first viewport. Signature: the single renew button on the most urgent row. Goes quiet: metrics become one sentence; the chart moves to the report page.

After: `2 of 18 leases end this week, Curry Mee first`, one primary action, the table from y=120. The blurred screenshot shows one block. Nothing was deleted: the metrics live in the sentence or on the report page, and each move is listed in the report as composition (R-VIS-038).

## 7. Before and after, one board screen

Before: title, three metric cards, and a list of 20 stalls with a status column. The eye has no way to compare units or see where the vacant ones are.

Brief: Job: see which units are free, and where. Shape: board. Focal: the grid of units drawn in their real positions, 65% of the first viewport. Signature: the brand tint on vacant units only. Goes quiet: the metrics become a legend with counts, which also filters the board.

After: title, one legend line, and the board from y=130. Each tile holds the unit number and tenant at 13-14px, and only exceptions carry colour. On 390px the board keeps its order in two columns and the legend wraps above it. Audit: focal block 65%, no void. Verdict line: composition, focal moment and product object; hygiene, tile radius moved to a token.

## 8. Before and after, one overview screen

Before: title, six equal KPI cards, two equal charts side by side. The audit reports `two equal blocks side by side`, and the blurred screenshot shows two blobs.

Brief: Job: is this month's collection on track? Shape: overview. Focal: collected against due, one chart at 50% of the first viewport. Signature: the collected series in the brand colour, with due as a neutral line. Goes quiet: four KPI cards become a short list beside the chart; the second chart moves below the fold.

After: `RM 48,200 of RM 61,000 collected, 6 days left` as the title's finding, the chart at 50%, a list of three facts beside it, and one action to chase overdue accounts. Verdict line: composition, one focal chart and a finding sentence; no data removed, the second chart is one scroll away.

## 9. Before and after, one form

Before: twelve fields in database order inside a card, with Save at the top right. Nothing says what the form produces.

Brief: Job: issue a correct lease. Shape: form. Focal: the primary action at the end of the path. Signature: the Save button only. Goes quiet: the card frame and section headers become spacing.

After: fields in the order the printed lease reads, the likely term preselected, one side note on what the deposit covers, and Save below the last field. Exempt from the 45% focal check by `shape: form`. Verdict line: composition, reading order and one anchor; hygiene, field widths from the token scale.

## 10. Before and after, one story page

Before: a centred heading, three equal feature cards, a stock illustration, and two equal buttons.

Brief: Job: decide whether to book a viewing. Shape: story. Focal: the claim with its proof. Signature: the primary action and the brand mark. Goes quiet: three cards become a one-line list; the second button becomes a text link.

After: `42 stalls, 3 vacant, viewings this week`, one line of proof, one action, then a real photo of the food court with the vacant stalls marked. Verdict line: composition, real content replaces the illustration, one action; nothing claimed that the owner did not supply.

## 11. Failure modes

- **Demoting everything.** A page of quiet blocks has no focal moment. Build one block up.
- **Decorating instead of composing.** A gradient, a glow, or an illustration added to an unchanged layout leaves the blur test unchanged.
- **Clean audit, plain page.** The script measures hygiene. A clean run with a plain contact sheet means the composition pass has not happened.
