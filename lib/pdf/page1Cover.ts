// lib/pdf/page1Cover.ts
// Corporate light-theme cover: white background, brand colour header block,
// KPI overview cards, mini TOC. No dark backgrounds.
import { PdfCtx } from "@/lib/pdf/types";
import { ClientInfo, KPISummary } from "@/lib/types";
import { fmt } from "@/lib/formatters";

export async function drawCoverPage(
  ctx: PdfCtx,
  clientInfo: ClientInfo,
  kpis: KPISummary,
): Promise<void> {
  const { doc, W, H, br, bg, bb, cur, LF } = ctx;

  // ── 1. Pre-calculate logo dimensions ──────────────────────────────────────
  let logoData: { dataUrl: string; fmt: string; w: number; h: number } | null = null;
  if (clientInfo.logoDataUrl) {
    try {
      const imgFmt =
        clientInfo.logoDataUrl.startsWith("data:image/jpeg") ||
        clientInfo.logoDataUrl.startsWith("data:image/jpg")
          ? "JPEG"
          : clientInfo.logoDataUrl.startsWith("data:image/webp")
          ? "WEBP"
          : "PNG";
      const img = new Image();
      img.src = clientInfo.logoDataUrl;
      await new Promise<void>((r) => { img.onload = () => r(); });
      const ratio = img.naturalWidth / img.naturalHeight;
      const maxW = 50, maxH = 18;
      const w = ratio > maxW / maxH ? maxW : maxH * ratio;
      const h = ratio > maxW / maxH ? maxW / ratio : maxH;
      logoData = { dataUrl: clientInfo.logoDataUrl, fmt: imgFmt, w, h };
    } catch { /* */ }
  }

  // ── 2. Calculate dynamic header height ────────────────────────────────────
  const LOGO_Y = 15;
  const logoBottom = logoData ? LOGO_Y + logoData.h + 5 : 24;
  const cName = clientInfo.clientName || "Client Name";
  // Estimate name lines (2nd pass will re-split after font is set, use this for height calc)
  const approxCharsPerLine = Math.floor((W - 40) / 6.5); // 27pt ≈ 6.5mm per char rough
  const nameLineCount = Math.ceil(cName.length / approxCharsPerLine) || 1;
  const NAME_Y = logoBottom + 25;
  const nameEnd = NAME_Y + Math.max(0, nameLineCount - 1) * 11;
  let lastHeaderY = nameEnd + 5;
  if (clientInfo.agencyName)               lastHeaderY = nameEnd + 13;
  if (clientInfo.dateFrom && clientInfo.dateTo)
    lastHeaderY = nameEnd + (clientInfo.agencyName ? 25 : 15);
  const HEADER_H = Math.max(88, Math.ceil(lastHeaderY) + 10);

  // ── 3. White full-page background ─────────────────────────────────────────
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, "F");

  // ── 4. Brand colour header block ──────────────────────────────────────────
  doc.setFillColor(br, bg, bb); doc.rect(0, 0, W, HEADER_H, "F");

  // Decorative circles (white, very low opacity) for depth
  doc.setFillColor(255, 255, 255);
  doc.setGState(doc.GState({ opacity: 0.07 })); doc.circle(W + 12, -12, 92, "F");
  doc.setGState(doc.GState({ opacity: 0.04 })); doc.circle(W - 10, HEADER_H + 12, 56, "F");
  doc.setGState(doc.GState({ opacity: 1 }));

  // ── 5. Logo ───────────────────────────────────────────────────────────────
  if (logoData) {
    doc.addImage(logoData.dataUrl, logoData.fmt, 20, LOGO_Y, logoData.w, logoData.h);
  }

  // ── 6. "CAMPAIGN PERFORMANCE REPORT" label ────────────────────────────────
  doc.setGState(doc.GState({ opacity: 0.65 }));
  doc.setFontSize(7); LF("bold"); doc.setTextColor(255, 255, 255);
  doc.text("CAMPAIGN PERFORMANCE REPORT", 20, logoBottom + 7);
  doc.setGState(doc.GState({ opacity: 1 }));

  // Thin white divider below label
  doc.setDrawColor(255, 255, 255); doc.setLineWidth(0.3);
  doc.setGState(doc.GState({ opacity: 0.18 }));
  doc.line(20, logoBottom + 11, W - 20, logoBottom + 11);
  doc.setGState(doc.GState({ opacity: 1 }));

  // ── 7. Client name ────────────────────────────────────────────────────────
  doc.setFontSize(27); LF("bold"); doc.setTextColor(255, 255, 255);
  const nameLines = doc.splitTextToSize(cName, W - 40);
  doc.text(nameLines, 20, NAME_Y);
  const nameEndActual = NAME_Y + Math.max(0, nameLines.length - 1) * 11;

  // ── 8. Agency & dates ─────────────────────────────────────────────────────
  if (clientInfo.agencyName) {
    doc.setGState(doc.GState({ opacity: 0.82 }));
    doc.setFontSize(10); LF("normal"); doc.setTextColor(255, 255, 255);
    doc.text(clientInfo.agencyName, 20, nameEndActual + 11);
    doc.setGState(doc.GState({ opacity: 1 }));
  }
  if (clientInfo.dateFrom && clientInfo.dateTo) {
    doc.setGState(doc.GState({ opacity: 0.6 }));
    doc.setFontSize(8.5); LF("normal"); doc.setTextColor(255, 255, 255);
    const dateY = nameEndActual + (clientInfo.agencyName ? 23 : 13);
    if (dateY < HEADER_H - 4)
      doc.text(`${clientInfo.dateFrom}  –  ${clientInfo.dateTo}`, 20, dateY);
    doc.setGState(doc.GState({ opacity: 1 }));
  }

  // ── 9. "Performance Overview" section heading ─────────────────────────────
  const whiteY = HEADER_H + 14;
  doc.setFillColor(br, bg, bb); doc.roundedRect(20, whiteY, 3, 13, 1, 1, "F");
  doc.setFontSize(11); LF("bold"); doc.setTextColor(15, 23, 42);
  doc.text("Performance Overview", 27, whiteY + 9.5);

  // ── 10. KPI cards (3 × 2) ────────────────────────────────────────────────
  const coverKPIs = [
    { label: "Total Spend",  value: fmt(kpis.totalSpend,       "currency", cur) },
    { label: "Avg ROAS",     value: fmt(kpis.avgROAS,          "decimal")  + "x" },
    { label: "Avg CPA",      value: fmt(kpis.avgCPA,           "currency", cur) },
    { label: "Conversions",  value: fmt(kpis.totalConversions, "number") },
    { label: "Impressions",  value: fmt(kpis.totalImpressions, "number") },
    { label: "Avg CTR",      value: fmt(kpis.avgCTR,           "percent") },
  ];
  const cW = 54, cH = 30, cGapX = 8, cGapY = 8;
  const cStartX = 20, cStartY = whiteY + 17;

  coverKPIs.forEach(({ label, value }, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = cStartX + col * (cW + cGapX);
    const y = cStartY + row * (cH + cGapY);
    // Card
    doc.setFillColor(248, 250, 252); doc.roundedRect(x, y, cW, cH, 2, 2, "F");
    // Left accent bar
    doc.setFillColor(br, bg, bb); doc.roundedRect(x, y, 2.5, cH, 1.5, 1.5, "F");
    // Value
    doc.setFontSize(12); LF("bold"); doc.setTextColor(br, bg, bb);
    doc.text(value, x + 7, y + 13);
    // Label
    doc.setFontSize(7); LF("normal"); doc.setTextColor(148, 163, 184);
    doc.text(label, x + 7, y + 23);
  });

  // ── 11. Separator + metadata row ──────────────────────────────────────────
  const kpiGridEnd = cStartY + 2 * cH + cGapY; // cStartY + 68
  const sepY = kpiGridEnd + 12;
  doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3);
  doc.line(20, sepY, W - 20, sepY);
  doc.setFontSize(7.5); LF("normal"); doc.setTextColor(100, 116, 139);
  const metaParts: string[] = [];
  if (clientInfo.clientName)  metaParts.push(`Client: ${clientInfo.clientName}`);
  if (clientInfo.agencyName)  metaParts.push(`Prepared by: ${clientInfo.agencyName}`);
  if (clientInfo.dateFrom && clientInfo.dateTo)
    metaParts.push(`Period: ${clientInfo.dateFrom} – ${clientInfo.dateTo}`);
  metaParts.push(`Currency: ${cur}`);
  const half = Math.ceil(metaParts.length / 2);
  if (metaParts.length > 0) {
    doc.text(metaParts.slice(0, half).join("  ·  "), 20, sepY + 7);
    if (metaParts.length > half)
      doc.text(metaParts.slice(half).join("  ·  "), W - 20, sepY + 7, { align: "right" });
  }

  // ── 12. "What's Inside" mini-TOC (conditional — skip if header pushed content down) ──
  const tocY = sepY + 18;
  const TOC_H = 48;
  const FOOTER_Y = H - 14;
  const hasSpaceForTOC = tocY + TOC_H + 10 < FOOTER_Y;

  if (hasSpaceForTOC) {
    doc.setFillColor(248, 250, 252); doc.roundedRect(20, tocY, W - 40, TOC_H, 3, 3, "F");
    doc.setFillColor(br, bg, bb); doc.roundedRect(20, tocY, 3, TOC_H, 1.5, 1.5, "F");
    doc.setFontSize(8); LF("bold"); doc.setTextColor(15, 23, 42);
    doc.text("What\u2019s Inside", 27, tocY + 11);
    const tocItems = [
      "Executive Summary & Benchmark Comparison   \u00B7   Page 2",
      "Campaign Performance Breakdown   \u00B7   Page 3",
      "Campaign Insights   \u00B7   Page 4",
      "Recommendations & Next Steps   \u00B7   Page 5",
    ];
    doc.setFontSize(7.5); LF("normal");
    tocItems.forEach((item, i) => {
      const ty = tocY + 20 + i * 8.5;
      doc.setFillColor(br, bg, bb); doc.circle(25.5, ty - 1.5, 1.5, "F");
      doc.setTextColor(71, 85, 105); doc.text(item, 30, ty);
    });
  }

  // ── 13. Footer ────────────────────────────────────────────────────────────
  doc.setFillColor(248, 250, 252); doc.rect(0, FOOTER_Y, W, H - FOOTER_Y, "F");
  doc.setFillColor(br, bg, bb); doc.rect(0, FOOTER_Y, W, 2, "F");
  doc.setFontSize(7); LF("normal"); doc.setTextColor(100, 116, 139);
  doc.text(
    "Generated by MetriQuill Free  \u00B7  metriquill.com/free  \u00B7  Confidential",
    W / 2, H - 4, { align: "center" }
  );
}
