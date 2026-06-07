// lib/pdf/page2Summary.ts
import { PdfCtx } from "@/lib/pdf/types";
import { CampaignData, ClientInfo, KPISummary } from "@/lib/types";
import { fmt, BENCHMARKS } from "@/lib/formatters";

export function drawSummaryPage(
  ctx: PdfCtx,
  campaigns: CampaignData[],
  clientInfo: ClientInfo,
  kpis: KPISummary,
): void {
  const { doc, W, H, br, bg, bb, cur, LF, pageFooter } = ctx;

  doc.addPage();
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, "F");
  doc.setFillColor(br, bg, bb); doc.rect(0, 0, W, 2, "F");
  doc.setFillColor(248, 250, 252); doc.rect(0, 2, W, 40, "F");
  doc.setFontSize(20); LF("bold"); doc.setTextColor(15, 23, 42); doc.text("Executive Summary", 20, 26);
  doc.setFontSize(9); LF("normal"); doc.setTextColor(100, 116, 139);
  if (clientInfo.dateFrom && clientInfo.dateTo)
    doc.text(`${clientInfo.dateFrom}  to  ${clientInfo.dateTo}`, 20, 36);

  // Narrative
  const avgROAS = kpis.avgROAS || 0, totalConv = kpis.totalConversions || 0;
  const avgCTR = kpis.avgCTR || 0, avgCPA = kpis.avgCPA || 0;
  const top = [...campaigns].filter(c => c.roas > 0).sort((a, b) => b.roas - a.roas)[0];
  const summaryLines = [
    `Total ad spend for this period: ${fmt(kpis.totalSpend || 0, "currency", cur)} across ${campaigns.length} campaigns.`,
    avgROAS >= 3 ? `Overall ROAS of ${avgROAS.toFixed(2)}x is above the industry average of 2.19x — strong account performance.`
      : avgROAS >= 1.5 ? `Overall ROAS of ${avgROAS.toFixed(2)}x is near the industry average of 2.19x. Optimization opportunities exist.`
      : `Overall ROAS of ${avgROAS.toFixed(2)}x is below the industry average of 2.19x. Immediate review recommended.`,
    totalConv > 0
      ? `Generated ${fmt(totalConv, "number")} conversions at an average cost of ${fmt(avgCPA, "currency", cur)} per acquisition.`
      : `No conversion data available for this period.`,
    top ? `Top performer: "${top.name}" at ${top.roas.toFixed(1)}x ROAS.` : "",
    avgCTR >= 1.49
      ? `Average CTR of ${avgCTR.toFixed(2)}% is above the industry benchmark of 1.49%.`
      : `Average CTR of ${avgCTR.toFixed(2)}% is below the industry benchmark of 1.49% — creative refresh may help.`,
  ].filter(Boolean);

  let y = 52;
  summaryLines.forEach(line => {
    const wrapped = doc.splitTextToSize(line, W - 50);
    doc.setFontSize(9); LF("normal"); doc.setTextColor(51, 65, 85); doc.text(wrapped, 20, y);
    y += wrapped.length * 6 + 4;
  });

  // Benchmark table header
  y += 8;
  doc.setFillColor(248, 250, 252); doc.roundedRect(20, y, W - 40, 8, 2, 2, "F");
  doc.setFontSize(10); LF("bold"); doc.setTextColor(15, 23, 42); doc.text("KPI vs Industry Benchmarks", 26, y + 5.5);
  y += 12;

  const rows = [
    { label: "Avg CTR",       value: fmt(kpis.avgCTR, "percent"),             bench: "0.90%",  good: (kpis.avgCTR || 0) > 0 && (kpis.avgCTR || 0) >= BENCHMARKS.ctr.good,       bad: (kpis.avgCTR || 0) > 0 && (kpis.avgCTR || 0) < BENCHMARKS.ctr.poor },
    { label: "Avg CPC",       value: fmt(kpis.avgCPC, "currency", cur),       bench: "$1.72",  good: (kpis.avgCPC || 0) > 0 && (kpis.avgCPC || 0) <= BENCHMARKS.cpc.good,      bad: (kpis.avgCPC || 0) > 0 && (kpis.avgCPC || 0) > BENCHMARKS.cpc.poor },
    { label: "Avg CPM",       value: fmt(kpis.avgCPM, "currency", cur),       bench: "$14.00", good: (kpis.avgCPM || 0) > 0 && (kpis.avgCPM || 0) <= BENCHMARKS.cpm.good,      bad: (kpis.avgCPM || 0) > 0 && (kpis.avgCPM || 0) > BENCHMARKS.cpm.poor },
    { label: "Avg ROAS",      value: fmt(kpis.avgROAS, "decimal") + "x",      bench: "2.19x",  good: (kpis.avgROAS || 0) > 0 && (kpis.avgROAS || 0) >= BENCHMARKS.roas.good,    bad: (kpis.avgROAS || 0) > 0 && (kpis.avgROAS || 0) < BENCHMARKS.roas.poor },
    { label: "Avg Frequency", value: fmt(kpis.avgFrequency, "decimal") + "x", bench: "<2.5x",  good: (kpis.avgFrequency || 0) < 2.0,                                           bad: (kpis.avgFrequency || 0) >= BENCHMARKS.frequency.warn },
  ];
  doc.setFontSize(7.5); LF("bold"); doc.setTextColor(100, 116, 139);
  doc.text("Metric", 20, y); doc.text("Your Result", 100, y, { align: "right" });
  doc.text("Industry Avg", 135, y, { align: "right" }); doc.text("Signal", 165, y, { align: "right" });
  doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3); doc.line(20, y + 2, W - 20, y + 2);
  y += 8;

  rows.forEach(row => {
    if (row.label === "Avg Frequency" && (kpis.avgFrequency || 0) === 0) return;
    doc.setFontSize(8.5); LF("normal"); doc.setTextColor(15, 23, 42); doc.text(row.label, 20, y);
    LF("bold"); doc.text(row.value, 100, y, { align: "right" });
    LF("normal"); doc.setTextColor(100, 116, 139); doc.text(row.bench, 135, y, { align: "right" });
    const rgb: [number, number, number] = row.good ? [5, 150, 105] : row.bad ? [220, 38, 38] : [100, 116, 139];
    doc.setTextColor(...rgb); LF("bold");
    doc.text(row.good ? "▲ Above avg" : row.bad ? "▼ Below avg" : "— On track", 165, y, { align: "right" });
    doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.2); doc.line(20, y + 3, W - 20, y + 3);
    y += 10;
  });
  pageFooter(2);
}
