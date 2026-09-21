# Contributing to MetriQuill Free

Thanks for helping. MetriQuill Free is a small, focused tool: upload a Meta Ads CSV, get a client-ready report. Bug reports, CSV edge cases, docs fixes and pull requests are all welcome.

## Ways to help

- Report a CSV that does not load or shows wrong numbers. Paste the header row only, never client data.
- Fix a bug, improve a report page, or tighten an insight rule.
- Improve the docs or the wording in the tool.

Issues labeled `good first issue` or `help wanted` are the easiest way in.

## Set up

Requires Node.js 20.9 or newer.

```bash
git clone https://github.com/<your-username>/meta-ads-report-generator.git
cd meta-ads-report-generator
npm install
npm run dev
```

Open http://localhost:3000. If `NODE_ENV=production` is set globally on your machine (common on Windows), start the dev server with `NODE_ENV=development`. No environment variables or API keys are needed.

## Before you open a pull request

```bash
npx tsc --noEmit
npm run lint
npm run build
```

All three must pass. CI runs the same checks.

## Project rules

- Keep it client-side: no backend, no analytics, no cookies. User data never leaves the browser.
- No emojis in the interface or in generated reports.
- Anything that touches `window` (Chart.js, jsPDF) is loaded with a dynamic import and `ssr: false`.
- New helpers go in their own file under `lib/`. The module map is in [`docs/architecture.md`](docs/architecture.md).
- Insight rules live in `lib/insights.ts` and benchmark values in `lib/benchmarks.ts`. Cite a source for any new benchmark number.

## Pull requests

- Keep them small and focused, and link the issue they close.
- Explain what changed and why.
- Add a screenshot for any visual change.

## License of contributions

By submitting a contribution you agree that it is licensed under the project license (MIT + Commons Clause, see [LICENSE](LICENSE)).
