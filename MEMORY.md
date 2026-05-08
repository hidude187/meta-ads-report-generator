# Project Memory — MetriQuill Free
> Last updated: Session 5 (May 2026)
> Repo location: C:\Users\Wahid\Desktop\claude\projects\metriquill-free\

---

## Brand
- Name: MetriQuill
- Free tool: metriquill.com/free (Vercel, public repo)
- Paid SaaS: metriquill.com (separate private repo, built later)
- Architecture: Two separate Vercel deployments, same domain (reverse proxy)

---

## Current Status
- Next.js 16 app fully scaffolded and committed (commit: 5a1f455)
- All components written and TypeScript-clean
- NOT yet pushed to GitHub (network blocked in terminal)
- NOT yet deployed to Vercel

---

## File Structure
metriquill-free/
  app/
    layout.tsx         ← metadata, Inter font, globals
    page.tsx           ← redirects / → /free
    globals.css        ← CSS vars, base styles, animations
    free/page.tsx      ← route for /free
  components/
    ReportTool.tsx     ← main orchestrator component
    Navbar.tsx         ← logo + "Try Pro" button
    ProBanner.tsx      ← top gradient banner with Pro CTA
    ClientInfoForm.tsx ← step 1: client name, agency, dates, currency, color, logo
    CSVUploader.tsx    ← step 2: drag & drop + demo mode
    ReportDashboard.tsx← step 3: wires KPI + charts + table + insights + export
    KPICards.tsx       ← 8 KPI metric cards
    CampaignTable.tsx  ← sortable campaign breakdown table
    Charts.tsx         ← Bar + Donut + Bubble (Chart.js)
    InsightsPanel.tsx  ← rules-based insights
    ExportButtons.tsx  ← PDF (jsPDF), CSV export + Pro CTA
  lib/
    types.ts           ← ClientInfo, CampaignData, KPISummary interfaces
    csvParser.ts       ← parseCSV, generateDemoData, calcKPIs
    formatters.ts      ← fmt(), generateInsights()

---

## NEXT STEPS (manual actions needed)

### Step 1 — Push to GitHub (network blocked in terminal)
Open Git Bash in: C:\Users\Wahid\Desktop\claude\projects\metriquill-free
Create a NEW private GitHub repo called: metriquill-free
Run:
  git remote set-url origin https://github.com/YOUR_USERNAME/metriquill-free.git
  git push -u origin master

### Step 2 — Deploy to Vercel
1. Go to vercel.com → New Project
2. Import the metriquill-free repo
3. Framework: Next.js (auto-detected)
4. Deploy → get URL like metriquill-free.vercel.app

### Step 3 — Set up metriquill.com domain
1. Register metriquill.com on Namecheap (~$12/yr)
2. In Vercel: add metriquill.com domain to this project
3. Set up /free path routing (Vercel rewrites)

### Step 4 — Next session: test & fix
Start app locally: npm run dev
Open http://localhost:3000/free
Test: demo data, CSV upload, PDF export, color picker, logo upload

---

## Known issues to check after deploy
- jsPDF is v4 (imported as named export) — verify PDF generation works
- Charts need "use client" — all marked correctly
- Canvas fonts in PNG export not yet implemented (deferred)

---

## Paid SaaS (future sessions)
- Separate private repo
- Next.js + Supabase auth + Stripe
- Features: Google Ads, TikTok, Snapchat, AI insights (Claude API)
- Hosted on metriquill.com (main domain)
- Free tool moves to metriquill.com/free via Vercel rewrites
