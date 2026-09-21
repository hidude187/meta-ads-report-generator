<div align="center">
  <img src="public/logo.svg" alt="MetriQuill logo" width="88" />
  <h1>MetriQuill Free: Meta Ads Report Generator</h1>
  <p>
    <strong>Turn a Facebook Ads Manager CSV into a branded PDF client report in 30 seconds.</strong><br />
    Free. No login. Your data stays in your browser.
  </p>

  <a href="https://free.metriquill.com"><img src="https://img.shields.io/badge/Live%20tool-free.metriquill.com-FF6B2B?style=for-the-badge" alt="Open the live tool" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT%20%2B%20Commons%20Clause-22c55e?style=for-the-badge" alt="License: MIT + Commons Clause" /></a>
  <a href="https://github.com/hidude187/meta-ads-report-generator/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/hidude187/meta-ads-report-generator/ci.yml?branch=main&style=for-the-badge&label=build" alt="Build status" /></a>
  <a href="https://github.com/hidude187/meta-ads-report-generator/stargazers"><img src="https://img.shields.io/github/stars/hidude187/meta-ads-report-generator?style=for-the-badge&color=E0408C" alt="GitHub stars" /></a>

  <br /><br />
  <img src="docs/screenshots/03-kpis.png" alt="MetriQuill Free report dashboard: KPI cards with benchmark health indicators and export buttons" width="820" />
</div>

## What it does

MetriQuill Free is a free Meta Ads report generator for agencies and freelancers. Export your campaigns from Meta Ads Manager (Facebook and Instagram Ads) as a CSV, add your client and brand details, and get a client-ready report: no account, no ad-account connection, no subscription.

| Output | What you get |
| --- | --- |
| **PDF report** | 5 pages: branded cover, executive summary with benchmarks, campaign breakdown, insights, recommendations |
| **PowerPoint deck** | 6 editable slides for client presentations |
| **PNG share card** | 1200x675 image for WhatsApp, Slack or LinkedIn |
| **Clean CSV** | UTF-8 with BOM, opens correctly in Excel |

Everything runs in your browser. There is no backend, no database and no login.

## How to make a Facebook Ads report from a CSV

1. Export a campaign-level CSV from Meta Ads Manager (steps below).
2. Open [free.metriquill.com](https://free.metriquill.com) and add the client name, agency name, dates, currency, brand color and logo (all optional).
3. Upload the CSV, or click **Load Demo Data** to try it first.
4. Review the KPIs, charts, campaign badges and insights.
5. Download the PDF report, PowerPoint deck, PNG share card or CSV.

### Export the right CSV from Meta Ads Manager

1. Open Meta Ads Manager and go to the **Campaigns** tab.
2. Click **Columns**, then **Customize Columns**, and select: Amount spent, Impressions, Reach, Link clicks, CTR (link click-through rate), CPC (cost per link click), CPM (cost per 1,000 impressions), Results, Purchase ROAS (return on ad spend).
3. Click **Apply**, then **Export**, then **Export Table Data**, then **CSV**.

If Spend, Clicks and CTR all show as 0, the export is missing the cost columns. Re-export with the columns above.

## See it in action

**1. Add client details:** client and agency name, dates, currency, brand color and your logo.

<img src="docs/screenshots/01-form.png" alt="Client and report info form with client name, agency name, dates, currency, brand color and logo upload" width="820" />

**2. Upload your CSV** (or load the demo data to try the full flow).

<img src="docs/screenshots/02-upload.png" alt="CSV upload step with drag and drop area and demo data button" width="820" />

**3. Read the charts:** spend, results and efficiency by campaign.

<img src="docs/screenshots/04-charts.png" alt="Visual analysis charts for spend, results and efficiency by campaign" width="820" />

**4. Spot winners and problems:** every campaign gets a health badge (TOP, REVIEW or WATCH).

<img src="docs/screenshots/05-campaigns.png" alt="Campaign breakdown table with health dots and TOP, REVIEW and WATCH badges" width="820" />

**5. Get insights and next steps** written in plain language.

<img src="docs/screenshots/06-insights.png" alt="Insights and recommendations panel" width="820" />

### The exported PDF

<p align="center">
  <img src="docs/screenshots/pdf-cover.png" alt="PDF report cover page with agency logo and brand color" width="270" />
  <img src="docs/screenshots/pdf-summary.png" alt="PDF executive summary with KPIs and benchmark comparison" width="270" />
  <img src="docs/screenshots/pdf-campaigns.png" alt="PDF campaign breakdown page" width="270" />
</p>
<p align="center">
  <img src="docs/screenshots/pdf-insights.png" alt="PDF campaign insights page" width="270" />
  <img src="docs/screenshots/pdf-recommendations.png" alt="PDF recommendations page" width="270" />
</p>

### The PNG share card

<p align="center">
  <img src="docs/screenshots/share-card.png" alt="1200 by 675 PNG share card with the main KPIs" width="600" />
</p>

## Features

**Reporting intelligence**

- 11 KPI cards, each compared against 2025-2026 cross-industry benchmarks with health indicators and tooltips.
- CPA is calculated for you (Meta does not export it).
- Campaign health badges (TOP, REVIEW, WATCH) based on ROAS, CTR, spend and frequency.
- Ad fatigue detection: frequency warning at 2.5 and danger flag at 4.0.
- Awareness campaigns are not judged by ROAS.
- Diagnostics such as "strong CTR but zero conversions" (a landing page or offer problem).
- Rules-based insights and recommendations you can read and change in [`lib/insights.ts`](lib/insights.ts). No AI, no guesswork.

**Made for agencies**

- Your logo (up to 2 MB) and brand color on the PDF cover and the PNG card.
- 10 currencies: USD, EUR, GBP, TRY and MENA currencies (AED, SAR, MAD, DZD, TND, EGP).
- Recognizes common Meta column-name variants (see `KEY_MAP` in [`lib/csvParser.ts`](lib/csvParser.ts)).
- A demo data button so you can try everything without a CSV.

## Why this exists, and how it compares

Connected reporting tools such as Whatagraph, AgencyAnalytics and DashThis pull data straight from your ad account and are built for recurring dashboards, with an account and a subscription. MetriQuill Free covers the simpler case: you already exported a CSV and need a client-ready PDF in a minute, without giving anyone access to your ad account.

## FAQ

### Is MetriQuill Free really free?

Yes. The hosted tool at [free.metriquill.com](https://free.metriquill.com) needs no account, subscription or card. The source code is available under MIT + Commons Clause (see [License](#license)).

### Is my Meta Ads data uploaded anywhere?

No. Your CSV is parsed in your browser and never sent to a server. See [Privacy](#privacy) for the one third-party request (a web font).

### Which Meta Ads Manager export do I need?

A campaign-level CSV with the columns listed in [Export the right CSV](#export-the-right-csv-from-meta-ads-manager): Amount spent, Impressions, Reach, Link clicks, CTR, CPC, CPM, Results and Purchase ROAS.

### Does it work with Instagram ads, Google Ads or TikTok?

It reads Meta Ads Manager exports, which include Instagram placements. Google Ads and TikTok CSV support are on the roadmap (see the open issues).

### Can I put my agency's logo and brand color on the report?

Yes. Upload your logo (up to 2 MB) and pick a brand color. Both appear on the PDF cover and the PNG share card. The exports still carry a small MetriQuill Free footer (see [Limits and known gaps](#limits-and-known-gaps)).

### Which currencies are supported?

USD, EUR, GBP, TRY, AED, SAR, MAD, DZD, TND and EGP.

### Can I run it on my own machine?

Yes, see [Run it locally](#run-it-locally). It needs Node.js 20.9 or newer and no API keys. The license allows personal or internal use and modification, not selling it.

### How are the benchmarks chosen?

They are generic cross-industry averages (2025-2026) kept in [`lib/benchmarks.ts`](lib/benchmarks.ts), not per vertical yet. Treat them as a reference, not a target.

## Privacy

Your CSV is parsed in your browser and never uploaded. The code contains no backend calls, analytics, cookies or local storage. The only third-party request is a web font (Amiri, used for Arabic client names on the PNG card), loaded from Google Fonts when you export.

## Limits and known gaps

- Exports carry MetriQuill Free branding: a footer on the PDF, PowerPoint and PNG card, a faint watermark on PDF pages 2 to 5 and an upgrade banner on the last PDF page. White-label PDFs (without this branding) are a MetriQuill paid feature.
- CSV files up to 20 MB; the first 2,000 rows are used.
- Built for standard Meta Ads Manager exports.
- Arabic: client names render on the PNG card. In the PDF, campaign names that contain Arabic are replaced with "Campaign 1, 2, ..." for now.
- Benchmarks are generic cross-industry values, not per vertical.
- Insights are rules, not AI.

## Run it locally

Requires Node.js 20.9 or newer. No environment variables or API keys are needed.

```bash
git clone https://github.com/hidude187/meta-ads-report-generator.git
cd meta-ads-report-generator
npm install
npm run dev
```

Open http://localhost:3000. More in [`docs/onboarding.md`](docs/onboarding.md), and the module map in [`docs/architecture.md`](docs/architecture.md).

## Tech stack

| Layer | Library |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Charts | Chart.js with react-chartjs-2 |
| PDF | jsPDF |
| PowerPoint | PptxGenJS |
| CSV parsing | PapaParse |
| Styling | Inline CSS with CSS variables (design tokens) |

## Roadmap

Planned work is tracked in the [open issues](https://github.com/hidude187/meta-ads-report-generator/issues):

- [ ] TikTok Ads CSV support
- [ ] Google Ads CSV support
- [ ] Period comparison (this month vs last month)
- [ ] Arabic and French interface, and full Arabic support in the PDF
- [ ] More regional and per-vertical benchmarks

## Contributing

Bug reports, CSV edge cases and pull requests are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md). Issues labeled `good first issue` are the easiest way in. Please never attach real client data: paste only the CSV header row.

## License

MIT + Commons Clause (source-available). Free to use, fork and modify for personal or internal use. You may not sell the software, or a product or service whose value comes substantially from it. Full terms in [LICENSE](LICENSE).

## About

Made by [MetriQuill](https://metriquill.com?utm_source=github&utm_medium=readme&utm_campaign=free-repo). Need saved reports, client management, scheduled exports and multi-platform analysis? See [MetriQuill Pro](https://metriquill.com?utm_source=github&utm_medium=readme&utm_campaign=free-repo).

If MetriQuill Free saves you time, a star on GitHub helps other agencies find it.
