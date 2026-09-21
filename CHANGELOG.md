# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Google Ads CSV import: pick "Google Ads" above the upload box to load a campaign export from Google Ads. Title and date-range rows are skipped (the dates pre-fill the report), total rows are ignored, and Reach and Avg Frequency are left out of the report because Google Ads exports do not include them.

### Changed

- README, GitHub description and topics reworked so the project is easier to find in search.
- README now states that exports carry MetriQuill Free branding (footer, watermark, upgrade banner).
- Repository renamed from `metriquill-free` to `meta-ads-report-generator` so the name matches what people search for. The old URL redirects.
- Structured data on the live tool no longer claims Arabic support in the PDF (Arabic client names are supported on the PNG card only) and now links to this repository.

## [1.0.0] - 2026-09-21

First public release.

### Added

- Meta Ads CSV to branded client report: 5-page PDF, 6-slide PowerPoint deck, 1200x675 PNG share card and clean CSV export.
- 11 KPI cards compared against 2025-2026 cross-industry benchmarks, campaign health badges, ad fatigue detection and rules-based insights.
- Agency logo and brand color, 10 currencies and a demo data button.
- GitHub links in the navbar and footer.
- Community files, issue forms and a CI workflow (type check, lint, build).
