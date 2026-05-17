# MetriQuill Free — Meta Ads Report Generator

> **No login. No API tokens. No subscription. Upload your CSV → get a PDF in 30 seconds.**

[![Live Demo](https://img.shields.io/badge/Try%20It%20Live-metriquill--free.vercel.app-blue?style=for-the-badge)](https://metriquill-free.vercel.app/free)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## What It Does

Upload your **Facebook / Meta Ads Manager CSV export** and instantly get:

- 📄 **5-page branded PDF report** — cover, executive summary with benchmarks, campaign breakdown, insights, recommendations
- 🖼️ **Social PNG** (1200×675) — share-ready summary card for WhatsApp / LinkedIn
- 📊 **PowerPoint deck** — editable slides for client presentations
- 📥 **Clean CSV** — normalized data with CPA added

**No account needed. Runs entirely in your browser. Your data never leaves your device.**

---

## Screenshots

> *(add GIF demo here)*

---

## Features

### Report Quality
- **CPA (Cost Per Acquisition)** calculated automatically
- **Campaign health badges** — TOP / REVIEW / WATCH based on ROAS + frequency
- **Benchmark comparisons** — your CTR, ROAS, CPC, CPM vs 2025 industry averages (▲/▼ signals)
- **Ad fatigue detection** — frequency warning at 2.5x, danger flag at 4.0x
- **Campaign type awareness** — awareness campaigns aren't judged by ROAS
- **CTR vs Conversion diagnostic** — flags high-CTR/zero-conversion as a landing page problem
- **Rules-based insights** — scale winners, pause losers, budget concentration analysis

### PDF Structure (5 pages)
1. Branded cover with logo, KPI summary boxes
2. Executive summary with narrative + KPI vs benchmark table
3. Campaign breakdown — spend, impressions, CTR, CPC, CPA, conversions, ROAS
4. Campaign insights (color-coded by type)
5. Actionable recommendations for next period

### UX
- **Logo upload** — appears on PDF cover and PNG export
- **Brand color picker** — full custom color throughout report
- **Arabic RTL support** — Amiri font embedded in PDF
- **Demo data** — test the full flow without a real CSV

---

## Supported Currencies

**DZD · USD · EUR · SAR · AED · GBP · MAD · TND · EGP · TRY**

The only free reporting tool that properly supports MENA currencies.

---

## How to Use

1. Go to [metriquill-free.vercel.app/free](https://metriquill-free.vercel.app/free)
2. Fill in client name, agency name, date range, currency, brand color
3. Upload your Meta Ads CSV export (from Ads Manager → Reports → Export)
4. Click **Download PDF**

That's it.

---

## Running Locally

```bash
git clone https://github.com/hidude187/metriquill-free
cd metriquill-free
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Meta Ads CSV Export — How to Get It

In Meta Ads Manager:
1. Go to **Ads Manager** → select your campaigns
2. Click **Reports** → **Export Table Data**
3. Choose **CSV** format
4. Upload the downloaded file here

The tool handles Facebook's inconsistent column naming automatically (Amount Spent / Spend / amount_spent all map correctly).

---

## Tech Stack

- **Next.js 15** — React framework
- **Chart.js** — bar, donut, bubble charts
- **jsPDF** — PDF generation
- **PapaParse** — CSV parsing
- **PptxGenJS** — PowerPoint export
- No backend. No database. No cookies.

---

## Roadmap

- [ ] TikTok Ads CSV support
- [ ] Google Ads CSV support
- [ ] Period comparison (vs previous month)
- [ ] Arabic UI (RTL layout toggle)
- [ ] French UI
- [ ] More currency benchmarks by region

---

## Why This Exists

Every paid reporting tool (Whatagraph $199/mo, AgencyAnalytics $12/client/mo, DashThis $49/mo) requires OAuth setup, monthly subscriptions, and accounts. There was no free, no-login, open-source option for the "I exported a CSV and need a PDF in 60 seconds" workflow — especially for freelancers and agencies in MENA markets.

---

## License

MIT — free to use, fork, and modify.

---

Made with ☕ by [MetriQuill](https://metriquill.com) · [Try MetriQuill Pro](https://metriquill.com) for AI-powered analysis
