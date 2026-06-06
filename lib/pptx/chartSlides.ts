// lib/pptx/chartSlides.ts
// Slide 3 — Spend bar chart. Slide 4 — CTR vs ROAS bubble chart.

import { SlideCtx, addSlideHeader, addSlideFooter, shortLabel } from "./pptxHelpers";

export function buildSpendChartSlide(ctx: SlideCtx): void {
  const { pres, brand, campaigns } = ctx;
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  addSlideHeader(s, ctx, "Spend by Campaign", "Total budget allocation across campaigns");

  const topCampaigns = [...campaigns]
    .sort((a, b) => (b.spend ?? 0) - (a.spend ?? 0))
    .slice(0, 8);

  s.addChart(pres.charts.BAR, [{
    name: "Spend",
    labels: topCampaigns.map((c, i) => shortLabel(c.name, i)),
    values: topCampaigns.map(c => c.spend ?? 0),
  }], {
    x: 0.5, y: 1.0, w: 9, h: 4.1,
    barDir: "col",
    chartColors: [brand],
    chartArea: { fill: { color: "FFFFFF" }, roundedCorners: false },
    catAxisLabelColor: "64748B",
    valAxisLabelColor: "64748B",
    valGridLine: { color: "E2E8F0", size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelColor: "0F172A",
    dataLabelFontSize: 8,
    showLegend: false,
    catAxisLineShow: false,
    valAxisLineShow: false,
  });
}

export function buildBubbleChartSlide(ctx: SlideCtx): void {
  const { pres, brand, campaigns } = ctx;
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  addSlideHeader(
    s, ctx,
    "CTR vs ROAS Performance Matrix",
    "Bubble size = spend. Top-right = high CTR + high ROAS = scale these."
  );

  const bubbleCampaigns = campaigns.filter(c => (c.spend ?? 0) > 0 || (c.impressions ?? 0) > 0);
  const maxSpend = Math.max(...bubbleCampaigns.map(c => c.spend ?? 0), 1);

  s.addChart(pres.charts.BUBBLE, [{
    name: "Campaigns",
    values: bubbleCampaigns.map(c => c.roas ?? 0),
    labels: bubbleCampaigns.map((c, i) => shortLabel(c.name, i)),
    sizes: bubbleCampaigns.map(c => Math.max(5, Math.round(((c.spend ?? 0) / maxSpend) * 50))),
  }], {
    x: 0.5, y: 1.0, w: 9, h: 4.1,
    chartColors: [brand, "10B981", "8B5CF6", "F59E0B", "EF4444"],
    chartArea: { fill: { color: "FFFFFF" }, roundedCorners: false },
    catAxisLabelColor: "64748B",
    valAxisLabelColor: "64748B",
    valGridLine: { color: "E2E8F0", size: 0.5 },
    catGridLine: { color: "E2E8F0", size: 0.5 },
    showLegend: false,
    showLabel: false,
  });

  addSlideFooter(s, ctx);
}
