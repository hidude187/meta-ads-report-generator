// lib/pdf/page4Insights.ts
import { PdfCtx } from "@/lib/pdf/types";
import { addWatermark } from "@/lib/pdf/pdfHelpers";

export function drawInsightsPage(ctx: PdfCtx, insights: string[]): void {
  const { doc, W, H, br, bg, bb, LF, pageFooter } = ctx;

  doc.addPage();
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, "F");
  addWatermark(ctx);
  doc.setFillColor(br, bg, bb); doc.rect(0, 0, W, 2, "F");
  doc.setFillColor(248, 250, 252); doc.rect(0, 2, W, 40, "F");
  doc.setFontSize(20); LF("bold"); doc.setTextColor(15, 23, 42); doc.text("Campaign Insights", 20, 26);
  doc.setFontSize(9); LF("normal"); doc.setTextColor(100, 116, 139);
  doc.text("Rules-based analysis \u00B7 2025 industry benchmarks", 20, 36);

  // Accent palette: green, red, amber, amber, indigo, green
  const accents: [number, number, number][] = [
    [16, 185, 129], [239, 68, 68], [245, 158, 11],
    [245, 158, 11], [99, 102, 241], [16, 185, 129],
  ];

  let y = 54;
  insights.forEach((text, i) => {
    const [iR, iG, iB] = accents[i % accents.length];
    // Strip [TAG] prefix — clean string for jsPDF rendering
    const clean = text.replace(/^\[[A-Z]+\]\s*/, "").trim();
    const wrapped = doc.splitTextToSize(clean, W - 62);
    const lineH = 5.3;
    const cardPadV = 10;
    const boxH = Math.max(26, wrapped.length * lineH + cardPadV * 2);

    if (y + boxH > H - 20) return; // skip if overflows footer area

    // Card background (rounded)
    doc.setFillColor(248, 250, 252); doc.roundedRect(20, y, W - 40, boxH, 2.5, 2.5, "F");
    // Left accent bar
    doc.setFillColor(iR, iG, iB); doc.roundedRect(20, y, 3.5, boxH, 1.5, 1.5, "F");
    // Numbered badge (filled circle with white numeral)
    doc.setFillColor(iR, iG, iB); doc.circle(33, y + 9, 5.5, "F");
    doc.setFontSize(7); LF("bold"); doc.setTextColor(255, 255, 255);
    doc.text(`${i + 1}`, 33, y + 9 + 1.8, { align: "center" });
    // Insight text
    doc.setFontSize(8.5); LF("normal"); doc.setTextColor(15, 23, 42);
    doc.text(wrapped, 43, y + cardPadV);

    y += boxH + 7;
  });

  if (insights.length === 0) {
    doc.setFontSize(9); LF("normal"); doc.setTextColor(100, 116, 139);
    doc.text("No insights generated for this data set.", 20, 60);
  }
  pageFooter(4);
}
