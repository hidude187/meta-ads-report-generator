# metriquill-free — REPO NOTES
> Master memory is in metriquill-app, not here.
> Read: C:\Users\Wahid\Desktop\claude\projects\metriquill-app\MEMORY.md

## Quick reference
- Local: C:\Users\Wahid\Desktop\claude\projects\metriquill-free\
- Live: metriquill-free.vercel.app (redirect from metriquill.com/free)
- Run: set NODE_ENV=development && npx next dev
- Last commit: 9c173bc
- Status: Stage 1 — PrePilot-inspired improvements shipped

## Session 26 done
- Added `metricHealth()` + `metricTooltip()` to formatters.ts — returns good/warn/poor/neutral per metric
- Added `HealthDot` component inline in CampaignTable.tsx — colored dot (green/amber/red) on CPC, CPM, CPA, CTR cells
- Hover tooltip on each dot shows benchmark ranges + actionable advice
- Added CPM column to campaign table (was missing)
- Added 3 new "Don't React" warnings to generateInsights():
  - Frequency ≥4.5: dont pause, refresh creative instead
  - High CPM + low spend: too early to judge, wait for $150 spend
  - ROAS 1.2–1.8 with <5 conversions: statistically unreliable, wait for 10 conversions
- InsightsPanel now shows "don't-react warnings" count badge in header
- Insight categories labelled inline (red "⚡ Don't React" tag, purple "⏳ Too Early" tag)
- Max insights raised from 6 to 8
- Logo upload, color picker, spin bug fix — already existed, no work needed

## Next session
- Move to paid tool (metriquill-app):
  - Structured AI diagnosis: Pre-Click → Post-Click → Economics layers
  - Stop-light verdict per campaign (Green/Yellow/Red)
  - These are Solo/Agency tier features
