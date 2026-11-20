# roughness-probe

Drives a running page and reports rough edges that a static screenshot misses. Run it; only read the source to change it.

```
node scripts/roughness-probe.mjs config.json
```

Config: `{ "base": "http://127.0.0.1:5173", "pages": [{"name":"stall","url":"/stalls"}], "cookies": [{"name":"x","value":"y"}], "darkClass": "dark" }`. Only `base` and `pages` are required. Needs `playwright` or `playwright-core`, or set `PLAYWRIGHT_MODULE` and `CHROME_PATH`. It only reads and hovers, and opens row menus. It clicks nothing else. Output is JSON on stdout with one finding per line in `findings`.

| Check | Finding means | Rule |
|---|---|---|
| overlay-theme | In dark mode, a hover overlay is much lighter than the page | R-INF-010 |
| overlay-fill | A hover overlay uses a saturated brand or status fill | R-INF-010 |
| hover-idle-flash | Moving across adjacent items returns the page to its idle text in the gaps | R-INF-010 |
| row-duplicate-action | A row's menu has one item, or an item repeats a visible row action | R-INF-008 |
| row-redundant-mark | Most rows carry a thin coloured bar | R-INF-007, a prompt to check, not proof |
| state-fills | Three or more saturated colour families fill repeated tiles by default | R-INF-005, R-INF-006 |

Exit 0: no findings on what it measures. Exit 1: findings. Exit 2: page failed or nothing measurable, which proves nothing.

Limits: it cannot judge usefulness, choose information or see a poor layout. Hover targets are guessed from repeated similar-sized controls, so pages with no repeated items report `sweep: not measured`. Its six checks were written from known complaints and fitted to them; the seeded fixtures test the mechanics only.
