# MetriQuill Free — Architecture

## Module Map

```
app/
  layout.tsx            Root layout — Google Fonts, JSON-LD schema, OG meta
  page.tsx              Redirects to /free
  globals.css           CSS variables (design tokens) + global styles
  free/page.tsx         Entry point — renders ReportToolClient

components/
  ReportToolClient.tsx  Client boundary wrapper (dynamic import of ReportTool)
  ReportTool.tsx        Top-level state: clientInfo, campaigns, infoFilled, csvLoaded
  ClientInfoForm.tsx    Step 1 — client name, agency, dates, currency, brand color, logo
  CSVUploader.tsx       Step 2 — drag-and-drop CSV upload or demo data loader
  ReportDashboard.tsx   Step 3 — renders KPIs, charts, table, insights, export buttons
  KPICards.tsx          11 KPI metric cards
  Charts.tsx            Bar + donut + bubble charts (Chart.js, dynamic import ssr:false)
  CampaignTable.tsx     Campaign breakdown table with health dots + badges
  InsightsPanel.tsx     Renders insight strings with accent cards
  ExportButtons.tsx     PDF / PNG / PPTX / CSV export (dynamic import ssr:false)
  Navbar.tsx            Top navigation bar
  ProBanner.tsx         Upgrade CTA banner

lib/
  types.ts              TypeScript interfaces: ClientInfo, CampaignData, KPISummary
  constants.ts          Magic numbers: MAX_CSV_SIZE_BYTES, CURRENCIES, etc.
  csvParser.ts          CSV column normalization, parseCSV(), generateDemoData()
  kpi.ts                calcKPIs() — derives KPISummary from CampaignData[]
  formatters.ts         fmt() + re-exports from benchmarks.ts + insights.ts
  benchmarks.ts         BENCHMARKS, metricHealth(), metricTooltip(), getCampaignBadge()
  insights.ts           generateInsights(), generateRecommendations()
  colors.ts             hexToRgb(), darkenHex(), lightenHex(), hexNoHash()
  exportPPTX.ts         PowerPoint export — pptxgenjs, 6 slides (dynamic import)
```

## Data Flow

```
CSV file (user upload)
  -> Papa.parse()           [ReportTool.tsx]
  -> parseCSV(rows)         [lib/csvParser.ts]  — column normalization
  -> CampaignData[]

CampaignData[]
  -> calcKPIs(campaigns)    [lib/kpi.ts]        — aggregated KPISummary
  -> KPICards, Charts, CampaignTable
  -> generateInsights()     [lib/insights.ts]   -> InsightsPanel

CampaignData[] + KPISummary + ClientInfo
  -> exportPDF()            [ExportButtons.tsx] — jsPDF, 5 pages
  -> exportPNG()            [ExportButtons.tsx] — Canvas API, 1200x675
  -> exportCSV()            [ExportButtons.tsx] — BOM-prefixed UTF-8
  -> exportPPTX()           [lib/exportPPTX.ts] — pptxgenjs, 6 slides
```

## SSR Boundary

Chart.js and jsPDF access `window` at import time — they crash Next.js SSR.
Both are dynamically imported with `ssr: false` in ReportDashboard.tsx.
exportPPTX is dynamically imported inside the button click handler.

## Component Tree

```
ReportToolClient (dynamic, ssr:false)
  ReportTool
    Navbar
    ProBanner
    ClientInfoForm
    CSVUploader
    ReportDashboard (when campaigns.length > 0)
      ExportButtons (dynamic, ssr:false)
      KPICards
      Charts (dynamic, ssr:false)
      CampaignTable
      InsightsPanel
```
