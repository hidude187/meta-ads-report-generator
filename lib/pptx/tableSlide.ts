// lib/pptx/tableSlide.ts
// Slide 5 — Campaign data table with ROAS color coding.

import { fmt } from "../formatters";
import { SlideCtx, addSlideHeader, addSlideFooter } from "./pptxHelpers";

export function buildTableSlide(ctx: SlideCtx): void {
  const { pres, campaigns, clientInfo } = ctx;
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  addSlideHeader(s, ctx, "Campaign Breakdown", `${campaigns.length} campaigns`);

  const tableData = [
    // Header row
    [
      { text: "Campaign",    options: { bold: true, color: "FFFFFF", fill: { color: "0F172A" }, fontSize: 8, fontFace: "Calibri", align: "left"  } },
      { text: "Spend",       options: { bold: true, color: "FFFFFF", fill: { color: "0F172A" }, fontSize: 8, fontFace: "Calibri", align: "right" } },
      { text: "Impressions", options: { bold: true, color: "FFFFFF", fill: { color: "0F172A" }, fontSize: 8, fontFace: "Calibri", align: "right" } },
      { text: "CTR",         options: { bold: true, color: "FFFFFF", fill: { color: "0F172A" }, fontSize: 8, fontFace: "Calibri", align: "right" } },
      { text: "CPC",         options: { bold: true, color: "FFFFFF", fill: { color: "0F172A" }, fontSize: 8, fontFace: "Calibri", align: "right" } },
      { text: "ROAS",        options: { bold: true, color: "FFFFFF", fill: { color: "0F172A" }, fontSize: 8, fontFace: "Calibri", align: "right" } },
    ],
    // Data rows
    ...campaigns.slice(0, 12).map((c, i) => {
      const roas = c.roas ?? 0;
      const roasColor = roas >= 3 ? "059669" : roas >= 1.5 ? "D97706" : "DC2626";
      const rowFill = i % 2 === 0 ? "FFFFFF" : "F8FAFC";
      const cellOpts = (align: "left" | "right" = "right") => ({
        fill: { color: rowFill }, fontSize: 8, fontFace: "Calibri", color: "334155", align,
      });
      const cleanName = c.name.replace(/[^\x00-\x7F\u00C0-\u024F]/g, "").trim() || `Campaign ${i + 1}`;
      const dispName = cleanName.length > 28 ? cleanName.slice(0, 28) + "…" : cleanName;
      return [
        { text: dispName,                                      options: { ...cellOpts("left") } },
        { text: fmt(c.spend, "currency", clientInfo.currency), options: cellOpts() },
        { text: fmt(c.impressions, "number"),                  options: cellOpts() },
        { text: fmt(c.ctr, "percent"),                         options: cellOpts() },
        { text: fmt(c.cpc, "currency", clientInfo.currency),  options: cellOpts() },
        { text: roas > 0 ? fmt(roas, "decimal") + "x" : "—",  options: { ...cellOpts(), color: roasColor, bold: roas > 0 } },
      ];
    }),
  ];

  s.addTable(tableData, {
    x: 0.5, y: 1.0, w: 9.0,
    colW: [3.2, 1.2, 1.4, 0.9, 1.0, 1.3],
    border: { pt: 0.5, color: "E2E8F0" },
    autoPage: false,
  });

  addSlideFooter(s, ctx);
}
