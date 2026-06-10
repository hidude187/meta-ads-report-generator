// lib/pdf/page5Recs.ts
import { PdfCtx } from "@/lib/pdf/types";
import { CampaignData, ClientInfo } from "@/lib/types";
import { generateRecommendations } from "@/lib/formatters";
import { addWatermark } from "@/lib/pdf/pdfHelpers";

export function drawRecsPage(
  ctx: PdfCtx,
  campaigns: CampaignData[],
  clientInfo: ClientInfo,
): void {
  const { doc, W, H, br, bg, bb, cur, LF, pageFooter } = ctx;

  doc.addPage();
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, "F");
  addWatermark(ctx);
  doc.setFillColor(br, bg, bb); doc.rect(0, 0, W, 2, "F");
  doc.setFillColor(248, 250, 252); doc.rect(0, 2, W, 40, "F");
  doc.setFontSize(20); LF("bold"); doc.setTextColor(15, 23, 42); doc.text("Recommendations", 20, 26);
  doc.setFontSize(9); LF("normal"); doc.setTextColor(100, 116, 139);
  doc.text("Suggested actions for the next reporting period", 20, 36);

  const recs = generateRecommendations(campaigns, cur);
  const palette: [number, number, number][] = [
    [5, 150, 105], [220, 38, 38], [245, 158, 11], [99, 102, 241], [59, 130, 246],
  ];

  let y = 54;
  recs.forEach((rec, i) => {
    const [rR, rG, rB] = palette[i % palette.length];
    const wrapped = doc.splitTextToSize(rec, W - 62);
    const lineH = 5.5;
    const cardPadV = 10;
    const cardH = Math.max(26, wrapped.length * lineH + cardPadV * 2);

    if (y + cardH > H - 36) return;

    // Card background
    doc.setFillColor(248, 250, 252); doc.roundedRect(20, y, W - 40, cardH, 2.5, 2.5, "F");
    // Left accent bar
    doc.setFillColor(rR, rG, rB); doc.roundedRect(20, y, 3.5, cardH, 1.5, 1.5, "F");
    // Numbered badge
    doc.setFillColor(rR, rG, rB); doc.circle(33, y + 9, 5.5, "F");
    doc.setFontSize(7); LF("bold"); doc.setTextColor(255, 255, 255);
    doc.text(`${i + 1}`, 33, y + 9 + 1.8, { align: "center" });
    // Text
    doc.setFontSize(9); LF("normal"); doc.setTextColor(15, 23, 42);
    doc.text(wrapped, 43, y + cardPadV);

    y += cardH + 8;
  });

  // ── Upsell banner ─────────────────────────────────────────────────────────
  const bannerY = y + 6;
  if (bannerY + 32 < H - 20) {
    doc.setFillColor(br, bg, bb); doc.setGState(doc.GState({ opacity: 0.07 }));
    doc.roundedRect(20, bannerY, W - 40, 32, 3, 3, "F");
    doc.setGState(doc.GState({ opacity: 1 }));
    doc.setFillColor(br, bg, bb); doc.roundedRect(20, bannerY, 3.5, 32, 1.5, 1.5, "F");
    doc.setFontSize(10); LF("bold"); doc.setTextColor(br, bg, bb);
    doc.text("Upgrade to MetriQuill Pro", 27, bannerY + 12);
    doc.setFontSize(8.5); LF("normal"); doc.setTextColor(51, 65, 85);
    const upsell = "Get AI-powered analysis, budget reallocation recommendations, and industry-specific benchmarks.";
    doc.text(doc.splitTextToSize(upsell, W - 55), 27, bannerY + 22);
  }

  // Suppress unused var — clientInfo reserved for future personalisation
  void clientInfo;
  pageFooter(5);
}
