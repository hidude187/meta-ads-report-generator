// lib/pdf/page5Recs.ts
import { PdfCtx } from "@/lib/pdf/types";
import { CampaignData, ClientInfo } from "@/lib/types";
import { generateRecommendations } from "@/lib/formatters";

export function drawRecsPage(
  ctx: PdfCtx,
  campaigns: CampaignData[],
  clientInfo: ClientInfo,
): void {
  const { doc, W, H, br, bg, bb, cur, LF, pageFooter } = ctx;

  doc.addPage();
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, "F");
  doc.setFillColor(br, bg, bb); doc.rect(0, 0, W, 2, "F");
  doc.setFillColor(248, 250, 252); doc.rect(0, 2, W, 40, "F");
  doc.setFontSize(20); LF("bold"); doc.setTextColor(15, 23, 42); doc.text("Recommendations", 20, 26);
  doc.setFontSize(9); LF("normal"); doc.setTextColor(100, 116, 139);
  doc.text("Suggested actions for the next reporting period", 20, 36);

  const recs = generateRecommendations(campaigns, cur);
  const bulletColors: [number, number, number][] = [
    [5, 150, 105], [220, 38, 38], [245, 158, 11], [99, 102, 241], [59, 130, 246],
  ];
  let y = 54;
  recs.forEach((rec, i) => {
    const [rR, rG, rB] = bulletColors[i % bulletColors.length];
    doc.setFillColor(rR, rG, rB); doc.circle(24, y - 1, 2.5, "F");
    doc.setFillColor(rR, rG, rB); doc.setGState(doc.GState({ opacity: 0.06 }));
    doc.roundedRect(20, y - 8, W - 40, 20, 3, 3, "F");
    doc.setGState(doc.GState({ opacity: 1 }));
    const wrapped = doc.splitTextToSize(rec, W - 55);
    doc.setFontSize(9); LF("normal"); doc.setTextColor(15, 23, 42); doc.text(wrapped, 30, y);
    y += wrapped.length * 5.5 + 14;
  });

  // Upsell banner
  y += 4;
  doc.setFillColor(br, bg, bb); doc.setGState(doc.GState({ opacity: 0.08 }));
  doc.roundedRect(20, y, W - 40, 28, 4, 4, "F");
  doc.setGState(doc.GState({ opacity: 1 }));
  doc.setFillColor(br, bg, bb); doc.rect(20, y, 3, 28, "F");
  doc.setFontSize(10); LF("bold"); doc.setTextColor(br, bg, bb);
  doc.text("Upgrade to MetriQuill Pro", 26, y + 10);
  doc.setFontSize(8.5); LF("normal"); doc.setTextColor(51, 65, 85);
  doc.text(
    "Get AI-powered analysis, budget reallocation recommendations, and industry-specific benchmarks.",
    26, y + 20,
  );

  // Suppress unused var warning — clientInfo reserved for future personalisation
  void clientInfo;
  pageFooter(5);
}
