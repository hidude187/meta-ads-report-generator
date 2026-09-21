# MetriQuill Free — Onboarding

Get from zero to running locally in under 10 minutes.

## Prerequisites

- Node.js 20.9+ (22 or newer recommended)
- npm v9+
- If `NODE_ENV=production` is set globally on your machine (common on Windows), prefix dev commands with `set NODE_ENV=development &&` (cmd) or `$env:NODE_ENV='development';` (PowerShell)

## Clone and Install

```bash
git clone https://github.com/hidude187/meta-ads-report-generator.git
cd meta-ads-report-generator
npm install
```

No `.env` file needed. This tool is 100% client-side — no API keys, no backend.

## Run Dev Server

```bash
# Windows
set NODE_ENV=development && npx next dev

# Mac/Linux
npm run dev
```

Open http://localhost:3000

## Understand the Repo in 10 Minutes

1. Read `docs/architecture.md` — module map + data flow
2. Open `lib/types.ts` — the three core interfaces (ClientInfo, CampaignData, KPISummary)
3. Open `lib/csvParser.ts` — KEY_MAP shows every column MetriQuill understands
4. Open `components/ReportTool.tsx` — the top-level state machine
5. Open `components/ExportButtons.tsx` — all four export engines in one file

## TypeScript Check

```bash
# Windows
set NODE_ENV=development && npx tsc --noEmit

# Should output: (nothing) — 0 errors
```

## Project Conventions

- All styles: inline CSS + CSS variables from `app/globals.css` (no Tailwind classes)
- No environment variables required
- Dynamic imports with `ssr: false` for anything that touches `window`
- New lib utilities go in their own file under `lib/`
