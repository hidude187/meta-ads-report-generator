// lib/exportPPTX.ts
// Generates a branded PowerPoint from campaign data using pptxgenjs
// Dynamically imported (ssr:false) — browser only

import { CampaignData, ClientInfo } from "./types";
import { fmt } from "./formatters";
import { calcKPIs } from "./csvParser";

function hexNoHash(hex: string): string {
  const h = /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : "#2563EB";
  return h.replace("#", "");
}

function darkenHex(hex: string, amount = 40): string {
  const h = /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : "#2563EB";
  const r = Math.max(0, parseInt(h.slice(1,3),16) - amount);
  const g = Math.max(0, parseInt(h.slice(3,5),16) - amount);
  const b = Math.max(0, parseInt(h.slice(5,7),16) - amount);
  return [r,g,b].map(v => v.toString(16).padStart(2,"0")).join("");
}

function lightenHex(hex: string, amount = 180): string {
  const h = /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : "#2563EB";
  const r = Math.min(255, parseInt(h.slice(1,3),16) + amount);
  const g = Math.min(255, parseInt(h.slice(3,5),16) + amount);
  const b = Math.min(255, parseInt(h.slice(5,7),16) + amount);
  return [r,g,b].map(v => v.toString(16).padStart(2,"0")).join("");
}

export async function exportPPTX(
  campaigns: CampaignData[],
  clientInfo: ClientInfo
): Promise<void> {
  // Dynamic import — keeps SSR safe
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PptxGenJS = (await import("pptxgenjs")).default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pres: any = new PptxGenJS();
  pres.layout = "LAYOUT_16x9"; // 10" × 5.625"
  pres.title = `MetriQuill Report — ${clientInfo.clientName || "Campaign"}`;
  pres.author = clientInfo.agencyName || "MetriQuill";

  const kpis = calcKPIs(campaigns);
  const brand = hexNoHash(clientInfo.brandColor);
  const brandDark = darkenHex(clientInfo.brandColor, 50);
  const W = 10; // slide width inches
  const H = 5.625;

  // ─────────────────────────────────────────────
  // SLIDE 1 — COVER
  // ─────────────────────────────────────────────
  const s1 = pres.addSlide();
  s1.background = { color: "0A0F1E" };

  // Left brand sidebar
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: H,
    fill: { color: brand }, line: { color: brand }
  });

  // Brand circle accent top-right (large, faint)
  s1.addShape(pres.shapes.OVAL, {
    x: 7.8, y: -1.5, w: 3.5, h: 3.5,
    fill: { color: brand, transparency: 88 },
    line: { color: brand, transparency: 88 }
  });

  // Second smaller circle
  s1.addShape(pres.shapes.OVAL, {
    x: 8.5, y: -0.8, w: 2.0, h: 2.0,
    fill: { color: brand, transparency: 80 },
    line: { color: brand, transparency: 80 }
  });

  // Logo image (if present)
  if (clientInfo.logoDataUrl) {
    try {
      s1.addImage({ data: clientInfo.logoDataUrl, x: 0.45, y: 0.3, w: 1.4, h: 0.55 });
    } catch { /* skip */ }
  }

  // "CAMPAIGN PERFORMANCE REPORT" label
  s1.addText("CAMPAIGN PERFORMANCE REPORT", {
    x: 0.45, y: clientInfo.logoDataUrl ? 1.05 : 0.7,
    w: 5.5, h: 0.25,
    fontSize: 8, bold: true, color: brand,
    charSpacing: 3, fontFace: "Calibri", margin: 0
  });

  // Client name
  const clientName = clientInfo.clientName || "Campaign Report";
  s1.addText(clientName, {
    x: 0.45, y: clientInfo.logoDataUrl ? 1.35 : 1.0,
    w: 7, h: 1.5,
    fontSize: 40, bold: true, color: "F1F5F9",
    fontFace: "Calibri", margin: 0, wrap: true
  });

  // Agency name
  if (clientInfo.agencyName) {
    s1.addText(clientInfo.agencyName, {
      x: 0.45, y: 2.95, w: 5, h: 0.35,
      fontSize: 13, color: brand, fontFace: "Calibri", margin: 0
    });
  }

  // Period
  if (clientInfo.dateFrom && clientInfo.dateTo) {
    s1.addText(`${clientInfo.dateFrom}  —  ${clientInfo.dateTo}`, {
      x: 0.45, y: 3.35, w: 5, h: 0.3,
      fontSize: 11, color: "64748B", fontFace: "Calibri", margin: 0
    });
  }

  // 3 KPI callouts at bottom of cover
  const coverKPIs = [
    { label: "Total Spend", value: fmt(kpis.totalSpend,"currency",clientInfo.currency) },
    { label: "Avg ROAS",    value: fmt(kpis.avgROAS,"decimal") + "x" },
    { label: "Conversions", value: fmt(kpis.totalConversions,"number") },
  ];
  const kpiBoxW = 2.4; const kpiBoxH = 0.85; const kpiBoxGap = 0.22;
  const kpiBoxY = H - kpiBoxH - 0.45; const kpiBoxStartX = 0.45;
  coverKPIs.forEach((k, i) => {
    const x = kpiBoxStartX + i * (kpiBoxW + kpiBoxGap);
    s1.addShape(pres.shapes.RECTANGLE, {
      x, y: kpiBoxY, w: kpiBoxW, h: kpiBoxH,
      fill: { color: "FFFFFF", transparency: 93 },
      line: { color: "FFFFFF", transparency: 93 }
    });
    // top accent
    s1.addShape(pres.shapes.RECTANGLE, {
      x, y: kpiBoxY, w: kpiBoxW, h: 0.04,
      fill: { color: brand }, line: { color: brand }
    });
    s1.addText(k.label, {
      x: x + 0.12, y: kpiBoxY + 0.1, w: kpiBoxW - 0.2, h: 0.22,
      fontSize: 8, color: "94A3B8", fontFace: "Calibri", margin: 0
    });
    s1.addText(k.value, {
      x: x + 0.12, y: kpiBoxY + 0.34, w: kpiBoxW - 0.2, h: 0.38,
      fontSize: 20, bold: true, color: "F1F5F9", fontFace: "Calibri", margin: 0
    });
  });

  // Footer
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: H - 0.22, w: W, h: 0.22,
    fill: { color: brandDark }, line: { color: brandDark }
  });
  s1.addText("Generated by MetriQuill Free  ·  metriquill.com/free  ·  Confidential", {
    x: 0.45, y: H - 0.2, w: 8, h: 0.18,
    fontSize: 7, color: "64748B", fontFace: "Calibri", margin: 0
  });

  // ─────────────────────────────────────────────
  // SLIDE 2 — KPI SUMMARY (10 metrics)
  // ─────────────────────────────────────────────
  const s2 = pres.addSlide();
  s2.background = { color: "FFFFFF" };

  // Top band
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.85,
    fill: { color: "F8FAFC" }, line: { color: "F8FAFC" }
  });
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.04,
    fill: { color: brand }, line: { color: brand }
  });
  s2.addText("Performance Summary", {
    x: 0.5, y: 0.12, w: 7, h: 0.45,
    fontSize: 22, bold: true, color: "0F172A", fontFace: "Calibri", margin: 0
  });
  if (clientInfo.dateFrom && clientInfo.dateTo) {
    s2.addText(`${clientInfo.dateFrom}  —  ${clientInfo.dateTo}`, {
      x: 0.5, y: 0.57, w: 7, h: 0.22,
      fontSize: 9, color: "64748B", fontFace: "Calibri", margin: 0
    });
  }

  // 10 KPI cards in 5x2 grid
  const kpiCards = [
    { label: "Total Spend",   value: fmt(kpis.totalSpend,"currency",clientInfo.currency),   color: brand },
    { label: "Avg ROAS",      value: fmt(kpis.avgROAS,"decimal")+"x",                       color: "10B981" },
    { label: "Impressions",   value: fmt(kpis.totalImpressions,"number"),                    color: "8B5CF6" },
    { label: "Reach",         value: fmt(kpis.totalReach,"number"),                          color: "F59E0B" },
    { label: "Avg Frequency", value: fmt(kpis.avgFrequency,"decimal")+"x",                  color: "EF4444" },
    { label: "Total Clicks",  value: fmt(kpis.totalClicks,"number"),                         color: brand },
    { label: "Avg CTR",       value: fmt(kpis.avgCTR,"percent"),                            color: "10B981" },
    { label: "Avg CPC",       value: fmt(kpis.avgCPC,"currency",clientInfo.currency),       color: "8B5CF6" },
    { label: "CPM",           value: fmt(kpis.avgCPM,"currency",clientInfo.currency),       color: "F59E0B" },
    { label: "Conversions",   value: fmt(kpis.totalConversions,"number"),                    color: "EF4444" },
  ];
  const cW2 = 1.72; const cH2 = 1.8; const cGapX = 0.14; const cGapY = 0.14;
  const cStartX = 0.5; const cStartY = 1.0;
  kpiCards.forEach(({ label, value, color }, i) => {
    const col = i % 5; const row = Math.floor(i / 5);
    const x = cStartX + col * (cW2 + cGapX);
    const y = cStartY + row * (cH2 + cGapY);
    // Card shadow
    s2.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.03, y: y + 0.03, w: cW2, h: cH2,
      fill: { color: "E2E8F0" }, line: { color: "E2E8F0" }
    });
    // Card bg
    s2.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cW2, h: cH2,
      fill: { color: "FFFFFF" }, line: { color: "E2E8F0" }
    });
    // Top accent bar
    s2.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cW2, h: 0.055,
      fill: { color }, line: { color }
    });
    // Label
    s2.addText(label, {
      x: x + 0.12, y: y + 0.2, w: cW2 - 0.2, h: 0.3,
      fontSize: 9, color: "64748B", fontFace: "Calibri", margin: 0
    });
    // Value
    s2.addText(value, {
      x: x + 0.12, y: y + 0.65, w: cW2 - 0.15, h: 0.75,
      fontSize: 22, bold: true, color, fontFace: "Calibri", margin: 0, wrap: true
    });
  });

  // Bottom footer
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: H - 0.04, w: W, h: 0.04,
    fill: { color: brand }, line: { color: brand }
  });

  // ─────────────────────────────────────────────
  // SLIDE 3 — BAR CHART (Spend by Campaign)
  // ─────────────────────────────────────────────
  const s3 = pres.addSlide();
  s3.background = { color: "FFFFFF" };
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.04,
    fill: { color: brand }, line: { color: brand }
  });
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.85,
    fill: { color: "F8FAFC" }, line: { color: "F8FAFC" }
  });
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.04,
    fill: { color: brand }, line: { color: brand }
  });
  s3.addText("Spend by Campaign", {
    x: 0.5, y: 0.12, w: 7, h: 0.45,
    fontSize: 22, bold: true, color: "0F172A", fontFace: "Calibri", margin: 0
  });
  s3.addText("Total budget allocation across campaigns", {
    x: 0.5, y: 0.57, w: 7, h: 0.22,
    fontSize: 9, color: "64748B", fontFace: "Calibri", margin: 0
  });

  const topCampaigns = [...campaigns]
    .sort((a, b) => (b.spend ?? 0) - (a.spend ?? 0))
    .slice(0, 8);

  const shortLabel = (name: string) => {
    // Remove Arabic/emoji for chart labels (PowerPoint chart labels are XML)
    const clean = name.replace(/[^\x00-\x7F\u00C0-\u024F]/g, "").trim();
    const label = clean || `Campaign ${campaigns.indexOf(campaigns.find(c => c.name === name)!) + 1}`;
    return label.length > 18 ? label.slice(0, 18) + "…" : label;
  };

  s3.addChart(pres.charts.BAR, [{
    name: "Spend",
    labels: topCampaigns.map(c => shortLabel(c.name)),
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

  // ─────────────────────────────────────────────
  // SLIDE 4 — ROAS vs SPEND BUBBLE / SCATTER
  // ─────────────────────────────────────────────
  const s4 = pres.addSlide();
  s4.background = { color: "FFFFFF" };
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.04,
    fill: { color: brand }, line: { color: brand }
  });
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.85,
    fill: { color: "F8FAFC" }, line: { color: "F8FAFC" }
  });
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.04,
    fill: { color: brand }, line: { color: brand }
  });
  s4.addText("CTR vs ROAS Performance Matrix", {
    x: 0.5, y: 0.12, w: 8, h: 0.45,
    fontSize: 22, bold: true, color: "0F172A", fontFace: "Calibri", margin: 0
  });
  s4.addText("Bubble size = spend. Top-right = high CTR + high ROAS = scale these.", {
    x: 0.5, y: 0.57, w: 9, h: 0.22,
    fontSize: 9, color: "64748B", fontFace: "Calibri", margin: 0
  });

  const bubbleCampaigns = campaigns.filter(c => (c.spend ?? 0) > 0 || (c.impressions ?? 0) > 0);
  const maxSpend = Math.max(...bubbleCampaigns.map(c => c.spend ?? 0), 1);

  s4.addChart(pres.charts.BUBBLE, [{
    name: "Campaigns",
    values: bubbleCampaigns.map(c => c.roas ?? 0),
    labels: bubbleCampaigns.map(c => shortLabel(c.name)),
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

  // ─────────────────────────────────────────────
  // SLIDE 5 — CAMPAIGN TABLE
  // ─────────────────────────────────────────────
  const s5 = pres.addSlide();
  s5.background = { color: "FFFFFF" };
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.04,
    fill: { color: brand }, line: { color: brand }
  });
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.85,
    fill: { color: "F8FAFC" }, line: { color: "F8FAFC" }
  });
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.04,
    fill: { color: brand }, line: { color: brand }
  });
  s5.addText("Campaign Breakdown", {
    x: 0.5, y: 0.12, w: 7, h: 0.45,
    fontSize: 22, bold: true, color: "0F172A", fontFace: "Calibri", margin: 0
  });
  s5.addText(`${campaigns.length} campaigns`, {
    x: 0.5, y: 0.57, w: 7, h: 0.22,
    fontSize: 9, color: "64748B", fontFace: "Calibri", margin: 0
  });

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
      const cellOpts = (align: "left"|"right" = "right") => ({
        fill: { color: rowFill }, fontSize: 8, fontFace: "Calibri",
        color: "334155", align
      });
      // Clean name for table (strip Arabic/emoji for XML safety)
      const cleanName = c.name.replace(/[^\x00-\x7F\u00C0-\u024F]/g,"").trim()
        || `Campaign ${i+1}`;
      const dispName = cleanName.length > 28 ? cleanName.slice(0,28)+"…" : cleanName;
      return [
        { text: dispName,                                        options: { ...cellOpts("left") } },
        { text: fmt(c.spend,"currency",clientInfo.currency),    options: cellOpts() },
        { text: fmt(c.impressions,"number"),                     options: cellOpts() },
        { text: fmt(c.ctr,"percent"),                            options: cellOpts() },
        { text: fmt(c.cpc,"currency",clientInfo.currency),      options: cellOpts() },
        { text: roas > 0 ? fmt(roas,"decimal")+"x" : "—",       options: { ...cellOpts(), color: roasColor, bold: roas > 0 } },
      ];
    }),
  ];

  s5.addTable(tableData, {
    x: 0.5, y: 1.0, w: 9.0,
    colW: [3.2, 1.2, 1.4, 0.9, 1.0, 1.3],
    border: { pt: 0.5, color: "E2E8F0" },
    autoPage: false,
  });

  // Footer
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: H - 0.04, w: W, h: 0.04,
    fill: { color: brand }, line: { color: brand }
  });

  // ─────────────────────────────────────────────
  // SLIDE 6 — THANK YOU / END
  // ─────────────────────────────────────────────
  const s6 = pres.addSlide();
  s6.background = { color: "0A0F1E" };

  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: H,
    fill: { color: brand }, line: { color: brand }
  });
  s6.addShape(pres.shapes.OVAL, {
    x: -1, y: H - 2.5, w: 3.5, h: 3.5,
    fill: { color: brand, transparency: 88 },
    line: { color: brand, transparency: 88 }
  });

  s6.addText("Thank You", {
    x: 0.6, y: 1.6, w: 6, h: 0.9,
    fontSize: 44, bold: true, color: "F1F5F9", fontFace: "Calibri", margin: 0
  });
  s6.addText(clientInfo.agencyName || "MetriQuill", {
    x: 0.6, y: 2.55, w: 5, h: 0.45,
    fontSize: 14, color: brand, fontFace: "Calibri", margin: 0
  });
  s6.addText("Generated by MetriQuill Free  ·  metriquill.com/free", {
    x: 0.6, y: 3.1, w: 7, h: 0.3,
    fontSize: 9, color: "475569", fontFace: "Calibri", margin: 0
  });

  // Download
  const filename = `metriquill-${(clientInfo.clientName || "report").replace(/[^a-z0-9]/gi,"_")}.pptx`;
  await pres.writeFile({ fileName: filename });
}
