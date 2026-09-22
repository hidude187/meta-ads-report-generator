// lib/pptx/kpiSlide.ts
// Slide 2 — 10-metric KPI summary grid.

import { fmt } from "../formatters";
import { SlideCtx, addSlideFooter } from "./pptxHelpers";

export function buildKpiSlide(ctx: SlideCtx): void {
  const { pres, brand, W, clientInfo, kpis } = ctx;
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  // Header
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.85, fill: { color: "F8FAFC" }, line: { color: "F8FAFC" } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.04, fill: { color: brand }, line: { color: brand } });
  s.addText("Performance Summary", {
    x: 0.5, y: 0.12, w: 7, h: 0.45,
    fontSize: 22, bold: true, color: "0F172A", fontFace: "Calibri", margin: 0,
  });
  if (clientInfo.dateFrom && clientInfo.dateTo) {
    s.addText(`${clientInfo.dateFrom}  —  ${clientInfo.dateTo}`, {
      x: 0.5, y: 0.57, w: 7, h: 0.22,
      fontSize: 9, color: "64748B", fontFace: "Calibri", margin: 0,
    });
  }

  // Up to 10 KPI cards in a 5-column grid; Reach and Avg Frequency are dropped when the
  // export has no reach data (e.g. Google Ads) instead of showing zeros.
  const hasReach = kpis.totalReach > 0;
  const kpiCards = [
    { label: "Total Spend",   value: fmt(kpis.totalSpend, "currency", clientInfo.currency),  color: brand },
    { label: "Avg ROAS",      value: fmt(kpis.avgROAS, "decimal") + "x",                     color: "10B981" },
    { label: "Impressions",   value: fmt(kpis.totalImpressions, "number"),                   color: "8B5CF6" },
    { label: "Reach",         value: fmt(kpis.totalReach, "number"),                         color: "F59E0B" },
    { label: "Avg Frequency", value: fmt(kpis.avgFrequency, "decimal") + "x",               color: "EF4444" },
    { label: "Total Clicks",  value: fmt(kpis.totalClicks, "number"),                        color: brand },
    { label: "Avg CTR",       value: fmt(kpis.avgCTR, "percent"),                           color: "10B981" },
    { label: "Avg CPC",       value: fmt(kpis.avgCPC, "currency", clientInfo.currency),     color: "8B5CF6" },
    { label: "CPM",           value: fmt(kpis.avgCPM, "currency", clientInfo.currency),     color: "F59E0B" },
    { label: "Conversions",   value: fmt(kpis.totalConversions, "number"),                   color: "EF4444" },
  ].filter(c => hasReach || (c.label !== "Reach" && c.label !== "Avg Frequency"));
  const cW = 1.72, cH = 1.8, cGapX = 0.14, cGapY = 0.14;
  const cStartX = 0.5, cStartY = 1.0;
  kpiCards.forEach(({ label, value, color }, i) => {
    const col = i % 5, row = Math.floor(i / 5);
    const x = cStartX + col * (cW + cGapX);
    const y = cStartY + row * (cH + cGapY);
    // Shadow
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.03, y: y + 0.03, w: cW, h: cH, fill: { color: "E2E8F0" }, line: { color: "E2E8F0" } });
    // Card
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cW, h: cH, fill: { color: "FFFFFF" }, line: { color: "E2E8F0" } });
    // Top accent
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cW, h: 0.055, fill: { color }, line: { color } });
    s.addText(label, { x: x + 0.12, y: y + 0.2,  w: cW - 0.2,  h: 0.3,  fontSize: 9,  color: "64748B", fontFace: "Calibri", margin: 0 });
    s.addText(value, { x: x + 0.12, y: y + 0.65, w: cW - 0.15, h: 0.75, fontSize: 22, bold: true, color, fontFace: "Calibri", margin: 0, wrap: true });
  });

  addSlideFooter(s, ctx);
}
