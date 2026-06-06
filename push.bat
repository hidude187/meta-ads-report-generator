@echo off
cd /d C:\Users\Wahid\Desktop\claude\projects\metriquill-free
git add -A
git commit -m "refactor: split ExportButtons + exportPPTX into focused modules

- Extract buildPdf() -> lib/buildPdf.ts (~290 lines)
- Extract buildPng() -> lib/buildPng.ts (~107 lines)
- Extract shared text helpers -> lib/textUtils.ts
- Split lib/exportPPTX.ts (422 lines) into lib/pptx/ slide modules:
  coverSlide, kpiSlide, chartSlides, tableSlide, endSlide, pptxHelpers
- exportPPTX.ts is now a 49-line orchestrator
- ExportButtons.tsx reduced from 496 to 135 lines (buttons + state + CSV only)
- Zero TypeScript errors"
git push origin main
echo PUSH_DONE
