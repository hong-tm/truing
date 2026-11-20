# Truing

Truing is an agent skill for inspecting and improving web interfaces. It helps an agent understand what people need to find, decide, and act on before proposing a change. It covers dashboards, tables, forms, landing pages, and editorial layouts.

## Install

Copy the entire `skills/truing` directory to the skill directory for your agent or project. The installed directory must contain `SKILL.md` alongside `references`, `examples`, and `scripts`. For an agent that discovers project skills under `.agents/skills`, place it at `.agents/skills/truing`.

## Use

Ask your agent to use Truing in an existing web project.

> Use Truing to review this dashboard. Check the empty and filtered states and rank the findings by what blocks the main task. Stay read-only.

The skill loads only the references that match the task. The optional Node.js audit scripts have their own setup instructions. [Render audit](skills/truing/scripts/render-audit.md) · [Interaction probe](skills/truing/scripts/roughness-probe.md)

The public package contains v10.14 guidance and synthetic examples. Some rules draw on anonymized project observations. See the evidence boundaries before interpreting audit results. [Sources](skills/truing/references/sources.md#evidence-limits)

[MIT license](LICENSE)
