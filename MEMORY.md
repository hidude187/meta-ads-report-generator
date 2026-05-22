# metriquill-free — REPO NOTES
> Master memory is in metriquill-app: C:\Users\Wahid\Desktop\claude\projects\metriquill-app\MEMORY.md

## Quick reference
- Local: C:\Users\Wahid\Desktop\claude\projects\metriquill-free\
- Live: metriquill-free.vercel.app (proxied from metriquill.com/free via rewrite in metriquill-app)
- Run: set NODE_ENV=development && npx next dev
- GitHub: https://github.com/hidude187/metriquill-free

---

## ✅ Session 54 — Security + Logic Audit (commit 5ff820f)
- **num() fix**: negative numbers now clamped with `Math.max(0, n)` — malformed CSVs can't corrupt KPIs
- **avgROAS fix**: now spend-weighted (totalRevenue/totalSpend), not arithmetic mean
- **generateInsights**: all campaign name refs pass through `cap(name, 40)` — long names can't break layout
- **CSV upload**: 20MB file size limit + strict `.csv` type check in onChange + 2,000 row cap with alert
- **Logo upload**: 2MB size limit enforced before FileReader runs
- **Export filenames**: all (PDF/PNG/CSV) now sanitized via `safeFilename()` — strips special chars
- **CSV export**: formula injection protection — cells starting with `=+−@` get `\t` prefix
- **CSVUploader**: file input onChange now validates extension (not just relying on HTML `accept` attr)

## ✅ Session 53 — Full UI Audit (commit 8c90bdb)
- **Input text invisible** (critical): added `color: "var(--text)"` + `colorScheme: "dark"` to inputStyle in ClientInfoForm.tsx
- **Date picker light mode**: fixed with `colorScheme: "dark"`
- **Chart.js dark theme**: axis labels, legend labels, grid lines now use muted gray (#9E95AE) — were black (invisible)
- **Donut chart border**: changed from `"#fff"` → `"#0F0B18"` (surface color)
- **CampaignTable badges**: TOP/REVIEW/WATCH changed from light-theme solids to dark rgba equivalents
- **InsightsPanel category badges**: same light→dark fix
- **KPI Cards Total Spend**: was `#2563EB` (old blue) → now `#FF6B2B` (brand orange)
- **CSVUploader step badge**: now shows ✓ when done (was always showing "2")
- **globals.css safety net**: `input, select, textarea { color: var(--text); background: var(--surface2); color-scheme: dark; }` + placeholder color

## ✅ Session 52 — Dark Theme Redesign
- Full dark theme applied in globals.css (--bg, --surface, --surface2, --orange, --magenta, etc.)
- Navbar redesigned with dark theme
- ProBanner redesigned
- `assetPrefix` fix in next.config.ts for metriquill.com/free proxy

## ✅ Session 26 — PrePilot Improvements
- `metricHealth()` + `metricTooltip()` in formatters.ts — health dots in CampaignTable
- HealthDot component with hover tooltips on CPC/CPM/CPA/CTR cells
- CPM column added to campaign table
- 3 new "Don't React" insights (frequency fatigue, high CPM too early, unreliable ROAS)
- InsightsPanel: count badge + category labels (Don't React / Too Early)
- Max insights raised from 6 to 8

## Current state
- Full dark theme ✅
- UI fully audited ✅
- Security fully audited ✅
- Logic fully audited ✅
- No known open bugs
