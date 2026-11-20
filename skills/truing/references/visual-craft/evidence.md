# Visual craft: evidence and trail per rule

Read this only when a rule's provenance or its original case must be reported or a rule is disputed. The rule cards hold what to do; this file holds why the rule exists. Formal provenance records are in [sources.md](../sources.md).

Shorthand: "the rental app round" = one measured 13-page redesign (the rental app, 2026-11); "corpus" = NotebookLM curated video corpus (172 sources), numbers are craft folklore, not measured thresholds.

## system-and-single-source

### R-VIS-000

- Evidence: agent-synthesis from one measured refactor (the rental app round). A finished page carried six arbitrary values (`max-w-[1400px]`, `min-w-[56rem]`, `w-[40%]`, `w-[20%]`, `w-[22%]`, `w-[18%]`). After tokenizing through the project's `@theme` block and scale classes, the rendered output was pixel-identical at three widths. The owner's v5 correction round restated the rule in his own words: work through shadcn/ui's design system, add named tokens for missing steps, never hardcode machined values. Corpus [2026-11-10 batch, "The Easy Way to Design UIs"]: browser-default drop-downs stayed white on a dark dashboard because "the browser styles controls on its own".
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11); owner correction round 2026-11-02; owner correction 2026-11-03 (type and brand at call sites); corpus-adjacent via NotebookLM extraction [second-sequence batch 5, "You're Using Shadcn/ui the WRONG Way (Here's How to Fix It)"].

### R-VIS-001

- Evidence: three-model critique (agy, GLM-5.3, V4.1-Flash) of the 13-page round found three different status-badge grammars across pages, with Approved and Paid states visually invisible; all three reviewers converged on "the site lacks one StatusBadge component" (the rental app round).
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-002

- Evidence: GLM review of the 13-page round found five cross-page number contradictions (stall mapping, occupancy, unpaid totals, account counts, expiry counts); the fix was a single mock fixture that every page derives from, and re-testing went green (the rental app round).
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-005

- Evidence: from the the rental app measured round — `toLocaleDateString()` under zh-CN widened a date column until rows grew from 85px to 99px; fixed `YYYY-MM-DD` held the layout (the rental app round). The 13-page critique found three date formats, two money formats, and four row heights across pages (GLM + V4.1-Flash). Owner correction: `font-mono` is for IDs and numeric identifiers only, not prose or labels.
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11); owner correction round 2026-11-02.

### R-VIS-014

- Evidence: measured on the the rental app page: a 16px title beside a 30px statistic read backwards; 24px title / 30px statistic read forwards but flat, and three council reviewers marked it as having no lead; 24px / 36px gave the page a lead (v8 rounds).
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-016

- Evidence: measured the rental app page — 32px header-to-summary, 24px summary-to-table, 20px cell padding, 4–6px inside text stacks; intermediate values (18px, 22px) made the page read uneven with no single gap looking wrong (the rental app round).
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-022

- Evidence: corpus: `inner radius = outer radius - padding` (or equivalently `outer = inner + padding`), with the connection expressed in code as `calc(var(--radius) - var(--padding))` [second-sequence batch 5, "Build UIs that don't suck #1: Rounding corners with science and CSS variables"]; Apple's concentric-shape guidance states the same formula [second-sequence batch 4, "WWDC25: Get to know the new design system | Apple"]. Owner correction: never machined squares — the system's native radius steps govern (2026-11-02).
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [second-sequence batch 5, "Build UIs that don't suck #1"], [second-sequence batch 4, "WWDC25: Get to know the new design system | Apple"]; owner correction round 2026-11-02.

### R-VIS-033

- Evidence: corpus convergence — profile photos, logos, and color-coded initial badges in lists for instant recognition [batch 19, "Top 5 UX/UI Design Tips... Part 2"]; recognition over recall — show recipient faces and icons beside names to prevent transfer errors [batch 18, "This Video Will Take You From Junior to Senior UX/UI Designer"]; single icon pack sorted by stroke width and corner radius, tooltips for unfamiliar icons [batch 4, "7 UI/UX mistakes that SCREAM you're a beginner"]; uniform stroke weights and corner rounding across modules [batch 2, "20 Top Underrated Web Design Resources for 2025"]; thin/outlined icons at rest, filled/heavy when selected [batch 8, "How I Make Apps FEEL 10x Better (5 Design Secrets)"]; icon size equals adjacent text line-height [batch 7, "Every UI/UX Concept Explained in Under 10 Minutes"]. The the rental app critique found TENANT/REQUESTER columns showing avatars with no names (V4.1-Flash, the rental app round).
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 19, "Top 5 UX/UI Design Tips... Part 2"], [batch 18, "Junior to Senior UX/UI Designer"], [batch 4, "7 UI/UX mistakes..."], [batch 2, "20 Top Underrated Web Design Resources"], [batch 8, "How I Make Apps FEEL 10x Better"], [batch 7, "Every UI/UX Concept Explained in Under 10 Minutes"]; the avatar-without-name defect is agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

## geometry-and-alignment

### R-VIS-008

- Evidence: three measured attempts on one the rental app table — auto layout starved columns (rows 99px), pure auto left a 400px dead strip, fixed shares with an 18% action column held 85px rows from 1280 to 1920 with no clipping (the rental app round).
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-009

- Evidence: eight identical outline buttons at one width, right-aligned in an 18% column, read as one column of affordances; the same action behind an ellipsis removed both label and width cue (the rental app round).
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-011

- Evidence: owner correction round on the redesigned pages (2026-11-02): "breadcrumb, h1, and table left edges align on one x (measured 412px at 1440)", and the sidebar collapse toggle was placed at the far right of the header, away from the sidebar it collapses (the rental app round). Phone app-bar exception (v10.12): v10.11 field run, the rental app ship at 390 kept the toggle inline (icon 14, h1 16, crumb 57, 28 findings on 14 pages × 2 themes); owner ruling 2026-11-16; the layout is the Material top app bar.
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11); owner correction round 2026-11-02.

### R-VIS-017

- Evidence: corpus: a foundational UI/UX overview prescribes a 4-point grid with clean half-divisions, 32px between major sections, at most 6 font sizes on a website, a 24px max for high-density dashboards, and 12-column desktop / 8 tablet / 4 mobile grid columns [batch 7, "Every UI/UX Concept Explained in Under 10 Minutes"]; the same grid appears in a 2026 skills rundown with an 8-point spacing scale (8, 16, 24, 32) [batch 18, "The Only 5 Web Design Skills That Actually Matter (2026)"]. These are craft folklore numbers, not measured thresholds; the the rental app measurement (R-VIS-016) independently landed on the same 4-multiple scale.
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 7, "Every UI/UX Concept Explained in Under 10 Minutes"], [batch 18, "The Only 5 Web Design Skills That Actually Matter (2026)"]; corroborated by agent measurement in the the rental app round (R-VIS-016).

### R-VIS-026

- Evidence: corpus convergence — right-align numeric columns by place value with categorical text left-aligned [batch 15, "The 3 dashboard UI flaws that give away you've NEVER built one"]; the same prescription in [batch 17, "The Easy Way to Design UIs"] (with monospace/tabular formatting) and [batch 21, "UI Design Tips for a Better Data Table UX"] (right-aligned numbers, bolded record names); metric values aligned right in [batch 3, "5 SaaS UI/UX mistakes that SCREAM you Vibe Code"].
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 15, "The 3 dashboard UI flaws..."], [batch 17, "The Easy Way to Design UIs"], [batch 21, "UI Design Tips for a Better Data Table UX"], [batch 3, "5 SaaS UI/UX mistakes..."].

### R-VIS-028

- Evidence: corpus convergence — three-tier spacing (widest between modules, medium within a module, minimum inside text stacks) driven by element intimacy, with dividers replaced by whitespace [second-sequence batch 7, "【一寸彩色照】—间距的正确用法；学会保持距离从此告别杂乱"]; macro and micro white space separating component groups [batch 1, "Master ADVANCED Hierarchy In Under 7 Minutes!"] and [batch 7, "Every UI/UX Concept Explained in Under 10 Minutes"]; explicit proximity ratios — about 12px label-to-field against about 32px field-group-to-field-group [second-sequence batch 14, "(FREE+PREVIEW)+The UI_UX Playbook"]; proximity as a primary scanning cue [batch 18, "The Only 5 Web Design Skills That Actually Matter (2026)"]. The measured the rental app scale (R-VIS-016: 32/24/16/4–8) is the same three-tier shape.
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [second-sequence batch 7, "【一寸彩色照】—间距的正确用法"], [batch 1, "Master ADVANCED Hierarchy..."], [batch 7, "Every UI/UX Concept Explained in Under 10 Minutes"], [second-sequence batch 14, "(FREE+PREVIEW)+The UI_UX Playbook"], [batch 18, "The Only 5 Web Design Skills That Actually Matter (2026)"]; corroborated in shape by the measured the rental app scale (R-VIS-016).

### R-VIS-039

- Evidence: render audit of 13 pages of the rental app (2026-11-03). Eight tables top-aligned their text but drew 32px row buttons, 32px avatars and icon-led buttons on their own centre. The action sat 4–9px below the row's first line. Source review had passed all eight, because each cell was correct on its own. The first repair (baseline alignment) moved two-line identity cells 6px up. Only the render caught that regression, and a second repair fixed it.
- Trail: measured on the rental app 13 pages, 1440 and 390 widths (2026-11-03).

## hierarchy-and-restraint

### R-VIS-010

- Evidence: measured on the the rental app page — 30px number on the same baseline as its uppercase micro-label, one supporting line, unframed, read as a single designed object; the same facts as three stacked 14px lines read as three paragraphs. All three reviewers of the 13-page round named this pattern as the round's strongest keeper ("each page's big KPI + uppercase micro-label + one line of fact") (the rental app round).
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-015

- Evidence: the rental app first used uppercase tracked 12px labels on every header; the rhythm was stable, but 6-7 such labels per page read as a template and an independent inspector failed them. Sentence-case 12px medium labels in the muted token kept the separation and removed the noise (v8 rounds). v10.11 field run: the rental app ship dimmed filtered-out stall tiles to opacity 0.35 while they stayed clickable, putting stall numbers at 2.18:1 (light) and 2.99:1 (dark); owner ruling 2026-11-16 that this is a defect, fixed at opacity 0.7.
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-018

- Evidence: corpus: the 60-30-10 allocation with accents capped at about 10% of area, one primary accent per component group, bright color reserved for functional status [batch 15, "The 7 Color Mistakes that RUIN your UI Designs"]; the same ratio in [batch 2, "4 levels of UI/UX design"] and [batch 18, "The Only 5 Web Design Skills That Actually Matter (2026)"]. Owner correction (2026-11-02): the dashboard must NOT be desaturated to monochrome — charts keep semantic multi-color via the `--chart` series tokens, and card borders must stay visible, especially in dark theme where they read too transparent. 2026-11-06 revision (owner-approved): the ratio backbone is demoted to marketing pages; the data-surface backbone is a neutral ladder — at least 4 background layers, 1-2 stroke colors, high-lightness border strokes (~85% white) on light, dark-mode layer gaps widened from ~2% to 4-6% with elevated surfaces lighter, chart ramps in OKLCH stepping hue 25-30° at fixed lightness and chroma [batch 2 (106-110), "Why the 60-30-10 Rule is RUINING Your UI Designs"] (Linear 99% white, Notion 100% white, Vercel 98% white canvases cited there); the no-desaturation and dark-border clauses are kept.
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 15, "The 7 Color Mistakes that RUIN your UI Designs"], [batch 2, "4 levels of UI/UX design"], [batch 18, "The Only 5 Web Design Skills That Actually Matter (2026)"]; owner correction round 2026-11-02 for the no-desaturation and dark-border clauses; revised 2026-11-06 (v9.2, owner-approved) citing [batch 2 (106-110), "Why the 60-30-10 Rule is RUINING Your UI Designs"] and [batch 12, "Design System inspired by Linear"].

### R-VIS-019

- Evidence: corpus: tighten header letter-spacing by about -2% to -3% with 110–120% line-height for display sizes [batch 7, "Every UI/UX Concept Explained in Under 10 Minutes"]; production systems converge on the same move — Airbnb applies -0.18px to -0.44px on headings, Apple -0.374px at 17px body with 1.07–1.14 heading line-heights, Cursor steps tracking from -2.16px at 72px to -0.11px at 22px and relaxes to normal at 16px and below [batch 11, "Design System inspired by Airbnb"; batch 11, "Design System inspired by Apple"; batch 12, "Design System inspired by Cursor"]. These are folklore and sampled production values, not laws.
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 7, "Every UI/UX Concept Explained in Under 10 Minutes"], [batch 11, "Design System inspired by Airbnb" / "Design System inspired by Apple"], [batch 12, "Design System inspired by Cursor"].

### R-VIS-021

- Evidence: corpus: Airbnb's three-layer shadow stack (opacity 0.02 ring, 0.04 mid, 0.1 close) [batch 11, "Design System inspired by Airbnb"]; Cursor's two-layer diffused stack at 0.14 and 0.1 with large blur [batch 12, "Design System inspired by Cursor"]; dark mode builds elevation by raising surface lightness instead of shadows, with dark-theme layer gaps widened relative to light (one source suggests doubling the lightness gap, to about 4–6% in dark) [batch 12, "Design System inspired by Linear"; batch 2 (106-110), "Why the 60-30-10 Rule is RUINING Your UI Designs"]; beginner defaults of dark high-opacity shadows should be replaced with lighter, higher-blur values [batch 4, "7 UI/UX mistakes that SCREAM you're a beginner"]. Owner correction: dark-theme card borders were too transparent in the round (the rental app round, 2026-11-02).
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 11, "Design System inspired by Airbnb"], [batch 12, "Design System inspired by Cursor" / "Design System inspired by Linear"], [batch 2 (106-110), "Why the 60-30-10 Rule is RUINING Your UI Designs"]; the dark-border clause is agent synthesis from one measured 13-page redesign (the rental app, 2026-11) plus owner correction 2026-11-02.

### R-VIS-027

- Evidence: corpus convergence — at most 2 font weights per section separated by at least one weight step, and at most 2 font colors with the secondary at reduced opacity [batch 4, "8 Web Design Hacks To ACTUALLY Make Your Designs Better"]; max 4 sizes / 2 weights per screen with weight+color contrast preferred over size alone [batch 2, "4 levels of UI/UX design"]; HSL lightness tiers (100/90% primary vs 60/70% secondary) instead of new colors [batch 16, "The 80% of UI Design - Typography"]; Material-style opacity tiers 100/87/70% [batch 3, "6 EASY Tips to 10x Any Site's Design"]; weight-plus-opacity hierarchy with secondary text at 40–70% opacity [batch 12, "Mathematically Perfect Typography for Web Design"].
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 4, "8 Web Design Hacks..."], [batch 2, "4 levels of UI/UX design"], [batch 16, "The 80% of UI Design - Typography"], [batch 3, "6 EASY Tips..."], [batch 12, "Mathematically Perfect Typography for Web Design"].

### R-VIS-046

- Evidence: corpus: every layout needs a deliberate three-stage eye movement — entry point, secondary focus, final call-to-action — and grouped content needs a strict 3-level visual distinction (Hook > Secondary Detail > Finisher) separated by macro white space [batch 1, "Master ADVANCED Hierarchy In Under 7 Minutes! (Important)"]; the eye registers size contrast within about 1 ms, so the tiers are read before the words. Synthesized against R-VIS-027 (weight and lightness before size) and R-VIS-010 (composed unit), not replacing them.
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 1, "Master ADVANCED Hierarchy In Under 7 Minutes! (Important)"]; v9.2 council round 1 (GLM-5.3, DeepSeek-V4.1-Flash, Gemini-3.8-Flash) converged on the gap; owner approved the two-batch plan 2026-11-06.

## honest-content

### R-VIS-004

- Evidence: the 13-page round drew a time series as a radar chart, rendered axes plus a fake message on empty data, and let series colors drift between light and dark themes (agy + V4.1-Flash, the rental app round). Owner correction: dashboards are NOT desaturated to monochrome — charts keep semantic multi-color via the system's `--chart` series tokens.
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11); owner correction round 2026-11-02; corpus-adjacent via NotebookLM extraction [second-sequence batch 2, "WWDC22: Design app experiences with charts | Apple"] and [batch 2 (106-110), "Why the 60-30-10 Rule is RUINING Your UI Designs"] for OKLCH chart ramps.

### R-VIS-007

- Evidence: GLM + V4.1-Flash flagged a "Send reminder" control enabled for a tenant with no due date, and vague verbs like "Decide" and "Change" that do not say what happens (the rental app round). Corpus: Apple's interface-writing guidance requires explicit verb-noun pairs ("Cancel Platinum Subscription" / "Keep Subscription"), never generic Confirm/Cancel [second-sequence batch 3, "WWDC22: Writing for interfaces | Apple"].
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11); corpus-adjacent via NotebookLM extraction [second-sequence batch 3, "WWDC22: Writing for interfaces | Apple"].

### R-VIS-024

- Evidence: GLM's review of the 13-page round flagged KPI figures whose scope was silent — a monthly ledger (RM804.30) shown beside an all-time KPI (RM462.20) looked contradictory until the month filter was traced; the number was right and its scope was unsaid (the rental app round). Corpus: pair raw metrics with comparative benchmarks (change vs. last week, direction indicator) and let charts carry a summary title that states the takeaway in a sentence [batch 17, "The Easy Way to Design UIs"; second-sequence batch 2, "WWDC22: Design app experiences with charts | Apple"].
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11); corpus-adjacent via NotebookLM extraction [batch 17, "The Easy Way to Design UIs"], [second-sequence batch 2, "WWDC22: Design app experiences with charts | Apple"].

### R-VIS-030

- Evidence: corpus convergence — truncate long strings automatically and give overlay icons contrast containers so variable content cannot break the layout [batch 9, "How to think like a GENIUS UI/UX designer"]; absolutely no Lorem Ipsum — real domain-specific strings in every designed component [batch 6, "Create A Portfolio With No Experience (or clients) Needed"]; test with real unscrubbed data because pristine placeholders hide wrapping and asset defects [batch 13, "My App Design Process: What Took Me 5 Years to Learn in 10 Minutes"]. The the rental app critique's REQUEST column showing raw user sentences with no truncation or field support is the same defect observed live (GLM, the rental app round).
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 9, "How to think like a GENIUS UI/UX designer"], [batch 6, "Create A Portfolio With No Experience (or clients) Needed"], [batch 13, "My App Design Process..."]; the raw-user-sentence column is agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-035

- Evidence: corpus convergence — determinate progress bars when duration can be calculated, activity spinners only for unknown-length sequences [batch 5, "Apple's Human Interface Guidelines #HUI | Design Systems"]; forbid percentage bars for unknown-duration backend work (the 99% stall is a lie users have learned to distrust), use a spinner or skeleton instead [second-sequence batch 6, "【一寸彩色照】—爱骗人的进度条；原来它一直在耍我！"].
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 5, "Apple's Human Interface Guidelines #HUI | Design Systems"], [second-sequence batch 6, "【一寸彩色照】—爱骗人的进度条"].

## states-and-motion

### R-VIS-012

- Evidence: measured the rental app dialog: 448px held a two-line fact sentence and two buttons; 512px pushed one long ragged line; focus returned to the opener only after explicit wiring (the rental app round). Owner correction round: opening a Sheet overlay must never make the underlying page horizontally scrollable — the page behind the overlay keeps its scroll lock and overflow hidden while any overlay is open.
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11); owner correction round 2026-11-02.

### R-VIS-013

- Evidence: measured on the the rental app page — a four-row skeleton at final row height inside the final container held the layout still; a bare "Loading..." line made the table jump; the 13-page round additionally drew charts with axes plus fabricated empty-state copy (see R-VIS-004) and left five different empty-state wordings across pages (GLM) (the rental app round).
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-020

- Evidence: corpus: interactive components need at least four explicit states (default, hover, active/pressed, disabled), inputs add focus/error [batch 7, "Every UI/UX Concept Explained in Under 10 Minutes"]; numeric values that change should transition (sliding digits, numeric content transitions) so the change is seen rather than assumed [batch 1, "10 Reusable Animations Every Product Should Use | Manu Arora"; second-sequence batch 3, "WWDC23: Design dynamic Live Activities | Apple"]. The the rental app critique found inactive icon states (a collapsed 44px sidebar rail) carrying no aria-label or title at all — states were not merely unstyled but unnamed (V4.1-Flash).
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 7, "Every UI/UX Concept Explained in Under 10 Minutes"], [batch 1, "10 Reusable Animations Every Product Should Use | Manu Arora"], [second-sequence batch 3, "WWDC23: Design dynamic Live Activities | Apple"]; the unnamed-state defect is agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-025

- Evidence: corpus: minimum 44px (Apple HIG) to 48px touch targets, achieved by an invisible absolutely-positioned hit-box span, suppressed on fine pointers so desktop hover does not misfire [second-sequence batch 13, "Build UIs that don't suck #3: What are these, buttons for ants?"]; 44px minimums also in [batch 20, "UI Design Livestream - Designing your first iOS app"] and [second-sequence batch 14, "(FREE+PREVIEW)+The UI_UX Playbook"]. The the rental app round's collapsed 44px rail icons were unnamed (see R-VIS-020) — small controls fail in more than one dimension (the rental app round).
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [second-sequence batch 13, "Build UIs that don't suck #3"], [batch 20, "UI Design Livestream - Designing your first iOS app"]; the unnamed-rail defect is agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-029

- Evidence: corpus convergence — modal entry 150–300ms with ease-out, scale from ~0.85 to 1 [batch 1, "10 Reusable Animations Every Product Should Use | Manu Arora"]; UI animation budget 200–600ms with eased keyframes, no un-eased pops [second-sequence batch 5, "【一寸彩色照】—动效设计背后到底藏着什么？（迪士尼十二法则）"]; ease-in for exits, ease-out for entries, linear reserved for mechanical motion [second-sequence batch 5, "【一寸彩色照】—告别动画生硬；掌控节奏感的速度曲线"]; transition durations kept short because view transitions block pointer events [second-sequence batch 14, "Quick & Easy Theme Transitions"]; explicit property lists instead of `transition: all`, `:active` press at `scale: 99%` [batch 13, "Micro-interactions still matter"]; `prefers-reduced-motion` collapse and transform/opacity-only animation [batch 13, "Motion Design for the Web | FREE COURSE"]; exits shorter than entries — "it opens a bit slower than it closes because closing should get out of your way fast" [2026-11-10 batch, "The 7 Things Every Beautiful UI Has (and AI Misses)"].
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 1, "10 Reusable Animations Every Product Should Use | Manu Arora"], [second-sequence batch 5, "【一寸彩色照】—动效设计背后到底藏着什么？" / "【一寸彩色照】—告别动画生硬；掌控节奏感的速度曲线"], [second-sequence batch 14, "Quick & Easy Theme Transitions"], [batch 13, "Micro-interactions still matter" / "Motion Design for the Web | FREE COURSE"].

### R-VIS-031

- Evidence: corpus convergence — empty states as actionable hubs: icon, descriptive header, guidance, and a primary CTA within reach, never a blank container [batch 19, "Top 5 UX/UI Design Tips and Tricks... Part 2"]; the same components plus "how content gets added and where it will appear" [batch 15, "Stop Making Pretty UIs. Think Like a Product Designer"]; instructive empty states that explain the path, avoiding whimsical idioms that fail to translate [second-sequence batch 3, "WWDC22: Writing for interfaces | Apple"]; empty states also carry the explanation before a permission prompt [second-sequence batch 1, "Why AI-Built Apps Feel Cheap (And How to Fix It)"]. The the rental app round surfaced five inconsistent empty-state wordings — the grammar was missing, not just the copy (GLM, the rental app round).
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 19, "Top 5 UX/UI Design Tips... Part 2"], [batch 15, "Stop Making Pretty UIs. Think Like a Product Designer"], [second-sequence batch 3, "WWDC22: Writing for interfaces | Apple"], [second-sequence batch 1, "Why AI-Built Apps Feel Cheap..."]; the five-wordings defect is agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-047

- Evidence: corpus: three overlay classes by weight — popovers for non-blocking simple contexts, modals for complex blocking workflows, toasts for completed-action notifications without blocking, new pages for large or permanent context shifts [batch 7, "EVERYTHING you need to know to build a Dashboard UI in 8 minutes"]; modals presented only for self-contained tasks with explicit affirmative and cancel controls [second-sequence batch 3 (116-120), "WWDC22: Explore navigation design for iOS | Apple"]; a notification slides in from the edge and stacks on top of the previous one [2026-11-10 batch, "The 7 Things Every Beautiful UI Has (and AI Misses)"]. Synthesized with R-VIS-012 (which governs the chosen class's behavior) and R-SYN-019 (the undo toast).
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 7, "EVERYTHING you need to know to build a Dashboard UI in 8 minutes"], [second-sequence batch 3 (116-120), "WWDC22: Explore navigation design for iOS | Apple"]; v9.3 synthesis, owner-approved.

## tables-forms-responsive

### R-VIS-003

- Evidence: two of three reviewers flagged that management tables lost search/filter/sort in the 13-page round (agy blocker, V4.1-Flash); the source tables mostly never had them, so the redesign inherited a missing capability rather than removing one (the rental app round). Corpus: header-embedded filter controls cut scanning from two passes (headers, then a separate filter bar) to one, because the control sits on the label that already names the category [second-sequence batch 2, "Why Data Table Filters Work Better in Headers"].
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11); corpus-adjacent via NotebookLM extraction [second-sequence batch 2, "Why Data Table Filters Work Better in Headers"].

### R-VIS-006

- Evidence: V4.1-Flash measured four distinct row heights across the 13 redesigned pages and proposed a compact/comfortable two-step scale (the rental app round).
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11).

### R-VIS-023

- Evidence: two of three reviewers found orphaned table headers left floating above single-column card lists on the mobile views of four redesigned pages (agy + V4.1-Flash, the rental app round). Corpus: the mobile table-to-card pattern puts the record ID and actions in the card header, field labels left with values right in the body, and keeps filter/sort controls at the top [batch 9, "How to Make Data Tables Look Great on Mobile"].
- Trail: agent synthesis from one measured 13-page redesign (the rental app, 2026-11); corpus-adjacent via NotebookLM extraction [batch 9, "How to Make Data Tables Look Great on Mobile"].

### R-VIS-032

- Evidence: corpus convergence — format inputs to mirror the final output structure (city/zip, CVC/expiry shaped like the card) [batch 6, "Best UI/UX Tips You Can Start Using Today"]; arrange form fields to mirror the final listing or summary page [second-sequence batch 14, "(FREE+PREVIEW)+The UI_UX Playbook"]; pre-select the recommended option with visible terms [batch 6, "Ecommerce Page Redesign: UX/UI Tips to 3.5x Conversion"]; 70–90% of users never change a preselected default, so the default is the design [batch 19, "Top 6 UX/UI Tips That Instantly Improve Any Screen"]; match input control to precision — steppers/text fields for frequent exact entries, sliders for one-time approximate setup [batch 19, "Top 5 Advanced UX/UI Design Tips... Part 3"].
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 6, "Best UI/UX Tips You Can Start Using Today" / "Ecommerce Page Redesign..."], [second-sequence batch 14, "(FREE+PREVIEW)+The UI_UX Playbook"], [batch 19, "Top 6 UX/UI Tips..." / "Top 5 Advanced... Part 3"].

### R-VIS-034

- Evidence: corpus convergence — split wide enterprise tables into a slim overview plus an action-triggered detail modal, with status badges replacing granular columns [batch 4, "A Better UX Design for Large Data Tables"]; move time-series out of rows into sidebars and roll history into summary sparklines, with categorical text as chips [batch 15, "The 3 dashboard UI flaws that give away you've NEVER built one"]; summary cards show scannable metadata first, low-priority detail reserved for the detail view [batch 9, "How to think like a GENIUS UI/UX designer"].
- Trail: corpus-derived heuristic (NotebookLM curated video corpus, 172 sources; no direct measurement) — [batch 4, "A Better UX Design for Large Data Tables"], [batch 15, "The 3 dashboard UI flaws..."], [batch 9, "How to think like a GENIUS UI/UX designer"].

## composition-and-character

### R-VIS-036

- Evidence: the rental app round. After the alignment and token passes, the owner judged the pages "better aligned" but said "美观度没有提升". Every region had the same density, the same card weight, and the same type step, so nothing led. Corpus agreement: "Master ADVANCED Hierarchy" (first-sequence batch 1), "Stop Making Pretty UIs" (first-sequence batch 15), and 碰撞吧 (second-sequence batch 9) all say that hierarchy comes from contrast that is obvious at a glance. A small difference reads as a mistake.
- Trail: agent synthesis from owner feedback in the the rental app round (2026-11-02); corpus-adjacent via NotebookLM extraction ["Master ADVANCED Hierarchy", first-sequence batch 1; "Stop Making Pretty UIs", first-sequence batch 15; 碰撞吧, second-sequence batch 9].

### R-VIS-037

- Evidence: the rental app round. The owner rejected a dashboard pass that had removed hue: "改得太無色了，只剩 monochrome 了，這不太行". He accepted the restored semantic chart color. Corpus: "secret behind weirdly perfect" and "Only 5 Web Design Skills 2026" (first-sequence batch 18) both name one consistent signature (an accent, a corner style, a type treatment) as the source of a premium feel. 色不够了 (second-sequence batch 9) keeps vivid color for the elements that act. 2026-11-10 batch ["How Top 1% Startups Avoid the Vibe-Coded Look"]: the "fine trap" — homepages built by students on Lovable clustered into six looks (single-source study), AI screens rated neutral-or-negative on originality by 92 blind raters, "AI tends to reinforce visual and structural patterns"; Benji Taylor: "it optimized for working rather than feeling right"; Ideogram's own logo is hand-drawn against machine-made defaults; the move: "name one decision in it that only your company would've made".
- Trail: agent synthesis from owner corrections in the the rental app round (2026-11-02, -03); corpus-adjacent via NotebookLM extraction ["secret behind weirdly perfect", "Only 5 Web Design Skills 2026", first-sequence batch 18; 色不够了, second-sequence batch 9].

### R-VIS-038

- Evidence: the rental app round. Two rounds were reported as improvements because tokens and alignment had improved. The owner looked at the pages and said the beauty had not improved. He asked for a before/after toggle so that he could see what changed. The toggle (a cookie-switched old/new preview) made the gap visible at once.
- Trail: agent synthesis from the the rental app round review history (2026-11-02, -03); no corpus provenance.

### R-VIS-040

- Evidence: the rental app with hygiene complete still scored 6-ish from three reviewers for looking like a kit: an unlabelled icon rail, no product name, no active item, the same title-number-strip template on every page. Naming the product, marking the active item and drawing the food court's own floor plan on the overview answered that finding (v8 rounds, single project).
- Trail: agent synthesis from one redesign and three reviewers; not a measured law.

### R-VIS-041

- Evidence: the rental app overview read as a report until the subline named today's finding ("2 leases end within 7 days, Curry Mee first") beside one primary button (v8 rounds).
- Trail: agent synthesis, single project.

### R-VIS-042

- Evidence: the rental app overview left 212px blank inside a two-row list stretched to its neighbour's height. Every reviewer named it first. Stacking the two short blocks beside the tall one closed it (v8 rounds).
- Trail: agent synthesis, single project.

### R-VIS-043

- Evidence: the rental app bar charts had no y-axis and bars 170px wide; six identical orange slabs were the loudest thing on the page, and the footer claimed a difference the chart could not show (v8 rounds).
- Trail: agent synthesis, single project.

### R-VIS-044

- Evidence: the rental app after R-VIS-040 still drew the same title, large number, four-cell strip and card on all thirteen pages; one reviewer called it the biggest remaining gain. Giving lists a one-line summary and their rows first, and keeping the large statistic for screens whose number is the answer, answered it (v8 rounds, single project).
- Trail: agent synthesis, single project.

### R-VIS-045

- Evidence: the rental app's tenant view repeated the tenant's own name and avatar on every payment row, and a user's appointment table kept a blank Action column above rows with no action (v8 rounds).
- Trail: agent synthesis, single project.

### R-VIS-048

- Evidence: corpus: dismissed elements shrink back into their originating icon or card to preserve spatial context, physics-based motion, and consistent frame pacing over raw refresh rate [batch 7, "How Apple Perfected Animation (and Why It Matters)"]; list exact transition properties rather than `transition: all`, spring curves through CSS `linear()` [batch 13, "Micro-interactions still matter"]. doc: restrict animation to `transform` and `opacity` where possible; in web.dev's example, `top`/`left` dropped 50% of frames and `transform` 1% ([web.dev](https://web.dev/articles/animations-guide)). Secondary: "responsive, interruptible, redirectable" and springs as the model, from a write-up of Apple's WWDC18 Designing Fluid Interfaces talk ([Gitter](https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5)); the talk itself was not read.
- Folklore, deliberately not in the card: stiffness 636 at 500 ms [batch 1, "11 Micro Animations"], stiffness 550 and damping 40 [batch 5, "Animated Dashboard Sidebar Tutorial in Figma"]. Each is one tutorial's Figma preset for one decorative element, and the units do not transfer across libraries.
- Trail: corpus-derived heuristic plus published docs; no direct measurement on a product. CSS transition retargeting is browser behaviour, not a corpus claim. v10.1 synthesis, owner chose the direction 2026-11-06.

### R-VIS-049

- Evidence: corpus: follow-through, overlapping action, anticipation, and exaggeration adapted from Disney's principles, with a 200-600 ms budget [second-sequence batch 5, "【一寸彩色照】—动效设计背后到底藏着什么？（迪士尼十二法则）"]; staggered reveal after structural boxes finish expanding, to avoid sudden pops, which this card relaxes to an overlap so the sequence stays in budget [batch 14, "Prototyping Professional Load Animations in Figma: Part 1"]; staggered entrance on initial view load only [batch 5, "Awful To AMAZING Web Designs Easily"]; curve by intent, linear only for mechanical motion, liveliness, impact and hang-time as curve shapes [second-sequence batch 5, "【一寸彩色照】—告别动画生硬；掌控节奏感的速度曲线"]. doc: "quickly stagger the appearance" of surfaces created together, and avoid scenes without focus ([Material choreography](https://m1.material.io/motion/choreography.html), older Material site).
- Synthesis, not from a source: the bans on stagger during refilter and refresh, the frequency-of-use argument, and keeping anticipation off operational controls. The corpus sources mostly teach landing-page and load animation, so these limits adapt them to surfaces used all day. Unvalidated.
- Trail: corpus-derived heuristic plus one doc; no direct measurement. v10.1 synthesis, owner chose the direction 2026-11-06.

### R-VIS-050

- Evidence: measured on the rental app round 2 (2026-11-08): switching between a 38-row availability page and a 3-row appointments page moved the content right edge by 15px (clientWidth 1351 vs 1366 at 1366x700 with scrollbars visible); reserving the root scrollbar gutter removed the jump. Owner reported the shift on the live preview.
- Trail: single real-project measurement; the inner-scroller clause and the clientWidth discriminator were added after three independent council auditors flagged the mechanism (2026-11-08, held-out semantic audit round).

### R-VIS-051

- Evidence: corpus convergence, three independent sources [2026-11-10 batch]: stage show (Benji Taylor, X) — a demo is "a stripped down working copy of one of your app screens", the five failure modes (bland, too much, wireframe, boxed, flat), "its last moment matches its first so you never see it restart", three to seven real words with bars for the rest, a curved cursor, the phone composed separately, a reduced-motion still ["Head Of Design At X's New Claude Skill Is Insane"]; "Your site should be built from the same parts as your product" — Undertone reuses the app's real record controls ("Same 64, same 72"), GameBlazers the game's own badge and pack art ["How Top 1% Startups Avoid the Vibe-Coded Look"]; the marketing page is seeded from the app's own code and design language ["Building Apps with AI Is Hard Until You Learn This"]. Kinsta 2026: 61% of about 1,000 US consumers link website quality to product quality — single-source survey, recorded not rule-bearing.
- Trail: v10.6 corpus synthesis (2026-11-10 batch); not validated on a held-out page.

## Two-site council round, 2026-11-11

Evidence for the v10.8 amendments, per amended card. Defect classes G1-G12 come from the the operations app dashboard, F1-F12 from the rental app; corpus quotes from the NotebookLM kpi/dark/tooltip/misc answers of 2026-11-11; provenance in sources.md's NOTE-v10.8-council.

- R-VIS-000: a Stripe payment element ignored the dark theme (F9) — clause (7) now covers embedded third-party surfaces with an owner-recorded exception.
- R-VIS-002: a 32px double-normalized sparkline told a different story than its card's -74% number (G1) — a bound chart must end at its block's number, recomputed from geometry.
- R-VIS-004: a 55%-opacity reference line was near-invisible on dark (G3, G5); the check now renders overlaid marks in both themes. Corpus: per-theme opacity and desaturation in dark, verified against the card surface, not pure black.
- R-VIS-012: a command menu self-opened on focus (F6) and a fixed h-[600px] overlay overflowed the viewport (F10) — explicit activation and viewport-bounded height with internal scroll.
- R-VIS-014: a 7rem statistic used font-bold with 700 unloaded — browser-synthesized faux bold (G12). Corpus: no faux bold; two or three explicitly loaded weights.
- R-VIS-017: reverse responsive padding (px-12 md:px-0) forced 96px onto phones (F10) — the responsive-direction audit.
- R-VIS-032: an "Other" free-text input overwrote its enum field (G10). Corpus: selection first, Other opens the free text as its own field.
- R-VIS-033: a dead avatar link (/default-avatar.png) rendered blank (F2). Corpus: initials or a neutral glyph fallback on load failure.
- R-VIS-042: a lone orphan card owned its row in a three-column grid (G8) — the named orphan-row treatment.
- R-VIS-043: a min-anchored y-axis compressed two lines into 6px (G2) and a negative bar kept its positive corner radius (G12) — zero anchoring and sign-flipped rounding. Corpus: anchor the y-axis at zero so a claimed 5% reads as a 5% slope; avoid spline smoothing that moves peak positions.

## v10.9 additions (2026-11-12)

- R-VIS-018: the read-only info bar check comes from the operations app's heavy grey strip (G9), a round-2 residual.
- R-VIS-029: clauses (6) and (7) come from the rental app's 500ms sheet and theme-switch hover jitter (F4); the high-frequency scoping answers the round-1 decline of a blanket ≤300ms budget.
- R-VIS-030: the placeholder-fit check line comes from the rental app's clipped search prompt (F1); holdout-g showed the render-audit truncation scan reads text nodes, not placeholder attributes — the check names the input's shipped placeholder directly.
- R-VIS-042: the disambiguation is a holdout-g round fix — the v10.8 wording allowed "span the orphan" while failing the same stretch.
- R-SYN-009: the copy-inside-a-kept-block clause comes from the operations app's filler subtitle (G9); R-SYN provenance is in sources.md NOTE-v10.9-council.
- R-VIS-033: the source-level failure-handler discriminator is a holdout-g round fix — both blind lanes missed a handler-less img avatar under two different briefs; the render check (block one src) stays, and the source cue makes the absence citable.
