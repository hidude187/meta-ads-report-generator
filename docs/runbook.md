# MetriQuill Free — Runbook

Operational guide: deploy, debug, extend.

## Deploy to Vercel

This is a standard Next.js app. Single command:

```bash
npx vercel --prod
```

Or connect the GitHub repo to Vercel — it auto-deploys on every push to `main`.

No environment variables needed. No build configuration needed.

## Rollback

```bash
# Revert to previous commit and force-push
git revert HEAD
git push origin main
```

Vercel will pick up the new commit and redeploy automatically.

## Debug: "All zeros" CSV

Symptom: CSV uploads but all KPI values show 0.

Cause: The column names in the CSV don't match any key in KEY_MAP.

Fix:
1. Open `lib/csvParser.ts`
2. Find `KEY_MAP` at the top
3. Open the CSV in a text editor and copy the exact column headers
4. Add a new entry: `'exact column name': 'field'`

Example: if Facebook exports `"Amount Spent (DZD)"` instead of `"Amount Spent"`:
```typescript
'amount spent (dzd)': 'spend',
```

The `normalizeKey` function lowercases and trims, so casing doesn't matter.

## Add a New Platform (e.g. Snapchat Ads)

1. Open `lib/csvParser.ts`
2. Export a new function: `export function parseSnapchatCSV(rows): CampaignData[]`
3. Create a new `KEY_MAP` specific to Snapchat column names
4. In `CSVUploader.tsx`, add a platform selector
5. In `ReportTool.tsx`, route to the correct parser based on selected platform

## Add a New Currency

1. Open `components/ClientInfoForm.tsx`
2. Add the ISO code to the `CURRENCIES` array, for example `"MAD"`
3. The `fmt()` function uses `Intl.NumberFormat` — it supports all ISO 4217 codes automatically

## Change Benchmark Values

Open `lib/benchmarks.ts` and edit the `BENCHMARKS` object.
All health dots, PDF benchmark table, and insight thresholds update automatically.

## Insight Logic

Open `lib/insights.ts` — each numbered comment block is one insight rule.
Rules are evaluated in order. Max 8 insights are returned (`.slice(0, 8)`).
To add a new rule, add a new `if` block and push to the `insights` array.

## Common Errors

Known pitfalls:

- **SSR crash on Chart.js / jsPDF**: always use `dynamic(() => import(...), { ssr: false })`
- **NODE_ENV conflict on Windows**: if `NODE_ENV=production` is set globally, prefix dev commands with `set NODE_ENV=development &&`
- **jsPDF v4 import**: use `import { jsPDF } from 'jspdf'` not the default import
