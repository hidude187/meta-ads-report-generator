# metriquill-free — REPO NOTES
> Master memory is in metriquill-app: C:\Users\Wahid\Desktop\claude\projects\metriquill-app\MEMORY.md

## Quick reference
- Local: C:\Users\Wahid\Desktop\claude\projects\metriquill-free\
- Live: metriquill-free.vercel.app (proxied from metriquill.com/free via rewrite in metriquill-app)
- Run: set NODE_ENV=development && npx next dev
- GitHub: https://github.com/hidude187/metriquill-free

---

## ✅ Session 56 — Logo, Favicon, Currency fixes (commits 682b9a8 → a29e1b5)
- Real logo + all favicons copied from desktop folder to /public
  - favicon.ico, favicon-16x16.png, favicon-32x32.png
  - apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png
  - metriquill logo.png
- layout.tsx fully wired: icons{}, openGraph{}, twitter{} all pointing to real assets
- Navbar: replaced gradient+SVG placeholder with real <Image src="/metriquill logo.png">
- Default brandColor changed from #2563EB (old blue) → #FF6B2B (orange)
- Currency selector order fixed: USD first (was DZD first)
- Demo button label was hardcoded "DZD" — now dynamic: shows clientInfo.currency
  - CSVUploader now accepts currency prop from ReportTool
  - Button reads: "Load Demo Data (5 campaigns, {currency})"

## ✅ Session 54 — Security + Logic Audit (commit 5ff820f)
- num() negative clamp, weighted ROAS, campaign name truncation in insights
- CSV: 20MB limit, 2k row cap, type check, formula injection protection
- Filename sanitization, logo 2MB limit

## ✅ Session 53 — Full UI Audit (commit 8c90bdb)
- Input text invisible fixed, dark chart labels, badge colors, step badge ✓, globals.css safety net

## ✅ Session 52 — Dark Theme Redesign
- Full dark theme, Navbar, ProBanner, assetPrefix fix

## ✅ Session 26 — PrePilot Improvements
- Health dots, CPM column, Don't React insights, InsightsPanel badges

## Current state
- Full dark theme ✅
- Real logo + favicons ✅
- UI fully audited ✅
- Security fully audited ✅
- Logic fully audited ✅
- Currency fully dynamic ✅
- No known open bugs ✅

## ⚠️ NEXT SESSION — Public Release Prep
- Wahid will provide a folder with screenshots of the tool
- Tasks:
  1. Update GitHub repo README with screenshots, feature list, badges
  2. Full SEO pass: metadata, OG tags, structured data (JSON-LD), sitemap, robots.txt
  3. Any final polish before public release
- Start by asking Wahid for the screenshot folder path
