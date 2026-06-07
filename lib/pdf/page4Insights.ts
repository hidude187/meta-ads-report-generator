// lib/pdf/page4Insights.ts
import { PdfCtx } from "@/lib/pdf/types";

export function drawInsightsPage(ctx: PdfCtx, insights: string[]): void {
  const { doc, W, H, br, bg, bb, LF, pageFooter } = ctx;

  doc.addPage();
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, "F");
  doc.setFillColor(br, bg, bb); doc.rect(0, 0, W, 2, "F");
  doc.setFillColor(248, 250, 252); doc.rect(0, 2, W, 40, "F");
  doc.setFontSize(20); LF("bold"); doc.setTextColor(15, 23, 42); doc.text("Campaign Insights", 20, 26);
  doc.setFontSize(9); LF("normal"); doc.setTextColor(100, 116, 139);
  doc.text("Rules-based analysis using 2025 industry benchmarks", 20, 36);

  const accents: [number, number, number][] = [
    [16, 185, 129], [239, 68, 68], [245, 158, 11], [245, 158, 11], [99, 102, 241], [16, 185, 129],
  ];

  let y = 54;
  insights.forEach((text, i) => {
    const [iR, iG, iB] = accents[i % accents.length];
    doc.setFillColor(iR, iG, iB); doc.rect(20, y, 3, 30, "F");
    doc.setFillColor(248, 250, 252); doc.roundedRect(23, y, W - 43, 30, 0, 0, "F");
    doc.setFontSize(8); LF("bold"); doc.setTextColor(iR, iG, iB);
    doc.text(`0${i + 1}`, 26, y + 10);
    // Strip emoji/symbol characters jsPDF can't render
    const clean = text
      .replace(/[\u{1F000}-\u{1FFFF}]|[\u2600-\u27FF]|⚠️|⛔|🚀|🔁|💰|📉|📊/gu, "")
      .trim();
    const wrapped = doc.splitTextToSize(clean, W - 60);
    doc.setFontSize(8.5); LF("normal"); doc.setTextColor(15, 23, 42); doc.text(wrapped, 36, y + 10);
    y += Math.max(30, wrapped.length * 5.5 + 10) + 6;
  });

  if (insights.length === 0) {
    doc.setFontSize(9); LF("normal"); doc.setTextColor(100, 116, 139);
    doc.text("No insights generated.", 20, 60);
  }
  pageFooter(4);
}
