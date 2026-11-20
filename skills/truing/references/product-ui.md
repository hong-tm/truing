# Product UI

Use this branch for operational comparison and action discovery. Name the data question before choosing a chart, table, grouping, or filter. Inspect semantic units and whether an aggregate covers the same records as the displayed list. Preserve the distinction when they differ.

## R-SYN-001

Represent information for the named task.

- Evidence: agent-synthesis; promoted-synthesis.
- Scope: operational-ui; comparing records or finding the next relevant item. Audience: people performing the named task; domain familiarity must be inspected. Platform: web; no native unit transfer.
- Action: Regroup truthful data by task-relevant attributes; align comparable numeric values only when units and semantics permit. Prefer differentiation to indiscriminate whitespace.
- Reason: The sources describe data-shaped tables and undifferentiated content; this conditional transfer preserves data, rather than claiming faster task performance.
- Exceptions: Keep chronological audit order, identifiers and mixed-unit comparisons when regrouping would destroy meaning.
- Tradeoff: Grouping reduces local clutter but can hide cross-group comparisons.
- Alternative: Keep the current table or add a meaningful filter instead of converting every value to a chip.
- Near miss: A dense chronological audit log with meaningful existing groups should remain.
- Check: Compare named-task answerability and every record, unit, filter and required action before and after; do not infer scan-time gains.
- Strength and units: conditional heuristic; not empirical proof or WCAG requirement. no prescribed geometry or timing.
- Trail: [R-SYN-001 provenance](sources.md#r-syn-001); CAND-T5-004, C-T6-003; a49a91ce-6c4e-4029-9311-4d448f7e4ce3, 706278d5-405d-4bb1-ab57-de60521d56b7.

## R-SYN-005

Disclose only genuinely secondary actions.

- Evidence: agent-synthesis; promoted-synthesis.
- Scope: operational-ui; discovering and activating a required or secondary action. Audience: people performing the named task; domain familiarity must be inspected. Platform: web; no native unit transfer.
- Action: Keep essential and primary actions discoverable; use progressive disclosure for genuinely secondary controls only with keyboard, tap and visible-state paths. Regroup before hiding solely to look cleaner. Dense desktop data tables may reveal secondary row actions on row hover, provided the same actions appear on keyboard focus-visible and stay persistent on touch.
- Reason: Source descriptions provide an explicitness spectrum, warnings about hiding and a collapsed search example. Accessible transfer is synthesis, not verified source behavior.
- Exceptions: Primary search, destructive actions needing clear context, uncommon critical tasks and batch workflows can require persistent controls.
- Tradeoff: Less visible clutter trades against discoverability and additional actions.
- Alternative: Use persistent labels, an expanded sidebar or an explicitly named menu rather than hover-only controls.
- Near miss: An already clear labeled control or expanded search should not be collapsed for decoration.
- Check: Activate each required task with keyboard and tap; check focus, names, exposed state and preserved paths. Nonmodal disclosure must not inherit a modal trap.
- Strength and units: conditional heuristic; not empirical proof or WCAG requirement. no prescribed geometry or timing.
- Trail: [R-SYN-005 provenance](sources.md#r-syn-005); CAND-T5-005, C-T6-004, C-T7-007, C-T7-008; a49a91ce-6c4e-4029-9311-4d448f7e4ce3, 706278d5-405d-4bb1-ab57-de60521d56b7, 5eec36db-14a1-4649-a51c-6cd0dd533d3b, 10cdbaa3-63fe-4884-9a18-b4c4d41f1082; v9.3 amendment (hover-revealed dense-table row actions with focus-visible and touch guards), corpus-derived [batch 15, "The 3 dashboard UI flaws that give away you've NEVER built one"].
