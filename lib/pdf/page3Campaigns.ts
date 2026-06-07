// lib/pdf/page3Campaigns.ts
import { PdfCtx } from "@/lib/pdf/types";
import { CampaignData } from "@/lib/types";
import { fmt, getCampaignBadge } from "@/lib/formatters";
import { safeName } from "@/lib/pdf/pdfHelpers";

export function drawCampaignsPage(ctx: PdfCtx, campaigns: CampaignData[]): void {
  const { doc, W, H, br, bg, bb, cur, LF, pageFooter } = ctx;

  doc.addPage();
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, "F");
  doc.setFillColor(br, bg, bb); doc.rect(0, 0, W, 2, "F");
  doc.setFillColor(248, 250, 252); doc.rect(0, 2, W, 40, "F");
  doc.setFontSize(20); LF("bold"); doc.setTextColor(15, 23, 42); doc.text("Campaign Breakdown", 20, 26);
  doc.setFontSize(9); LF("normal"); doc.setTextColor(100, 116, 139); doc.text(`${campaigns.length} campaigns`, 20, 36);

  const tCols = ["Campaign", "Spend", "Impr.", "CTR", "CPC", "CPA", "Conv.", "ROAS"];
  const tX    = [20, 90, 115, 137, 153, 167, 181, 193];
  const tHY   = 50;
  doc.setFillColor(15, 23, 42); doc.rect(20, tHY - 5, W - 40, 10, "F");
  doc.setFontSize(6.5); LF("bold"); doc.setTextColor(255, 255, 255);
  tCols.forEach((col, i) => doc.text(col, tX[i], tHY));

  campaigns.forEach((c, i) => {
    const rowY = tHY + 10 + i * 12;
    if (rowY > H - 30) return;
    if (i % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(20, rowY - 6, W - 40, 12, "F"); }

    const roasVal = c.roas ?? 0;
    const roasRgb: [number, number, number] = roasVal >= 3 ? [5, 150, 105] : roasVal >= 1.5 ? [217, 119, 6] : [220, 38, 38];
    doc.setFillColor(...roasRgb); doc.circle(22, rowY - 1.5, 1.5, "F");

    const rowName = safeName(c.name, i, 28);
    doc.setFontSize(7);
    LF("normal"); doc.setTextColor(15, 23, 42); doc.text(rowName, tX[0] + 5, rowY);

    const badge = getCampaignBadge(c);
    if (badge) {
      const bColors: Record<string, [number, number, number]> = { TOP: [5, 150, 105], REVIEW: [220, 38, 38], WATCH: [217, 119, 6] };
      const [bR, bG, bBl] = bColors[badge] || [100, 116, 139];
      doc.setFillColor(bR, bG, bBl); doc.setGState(doc.GState({ opacity: 0.15 }));
      doc.roundedRect(tX[0] + 5 + doc.getTextWidth(rowName) + 2, rowY - 5, badge.length * 2.2 + 4, 6, 1, 1, "F");
      doc.setGState(doc.GState({ opacity: 1 }));
      doc.setFontSize(5); LF("bold"); doc.setTextColor(bR, bG, bBl);
      doc.text(badge, tX[0] + 5 + doc.getTextWidth(rowName) + 4, rowY - 1);
    }

    doc.setFontSize(7); LF("normal"); doc.setTextColor(51, 65, 85);
    doc.text(fmt(c.spend, "currency", cur),   tX[1], rowY);
    doc.text(fmt(c.impressions, "number"),     tX[2], rowY);
    const ctrRgb: [number, number, number] = c.ctr >= 1.49 ? [5, 150, 105] : c.ctr < 0.72 ? [220, 38, 38] : [51, 65, 85];
    doc.setTextColor(...ctrRgb); doc.text(fmt(c.ctr, "percent"), tX[3], rowY);
    doc.setTextColor(51, 65, 85);
    doc.text(fmt(c.cpc, "currency", cur), tX[4], rowY);
    doc.text(c.cpa > 0 ? fmt(c.cpa, "currency", cur) : "—", tX[5], rowY);
    doc.text(fmt(c.conversions, "number"), tX[6], rowY);
    const roasText = roasVal > 0 ? fmt(roasVal, "decimal") + "x" : "—";
    doc.setFillColor(...roasRgb); doc.setGState(doc.GState({ opacity: 0.12 }));
    doc.roundedRect(tX[7] - 1, rowY - 5, 18, 7, 1.5, 1.5, "F"); doc.setGState(doc.GState({ opacity: 1 }));
    doc.setFontSize(6.5); LF("bold"); doc.setTextColor(...roasRgb); doc.text(roasText, tX[7] + 1, rowY);
  });

  const legY = tHY + 10 + Math.min(campaigns.length, Math.floor((H - 40 - tHY) / 12)) * 12 + 8;
  const legends: { label: string; color: [number, number, number]; desc: string }[] = [
    { label: "TOP",    color: [5, 150, 105],  desc: "ROAS ≥3x" },
    { label: "REVIEW", color: [220, 38, 38],  desc: "ROAS <1.5x" },
    { label: "WATCH",  color: [217, 119, 6],  desc: "Frequency ≥2.5x" },
  ];
  let legX = 20;
  legends.forEach(l => {
    doc.setFontSize(6); LF("bold"); doc.setTextColor(...l.color); doc.text(l.label, legX, legY);
    legX += doc.getTextWidth(l.label) + 2;
    doc.setFontSize(6); LF("normal"); doc.setTextColor(100, 116, 139); doc.text(l.desc, legX, legY);
    legX += doc.getTextWidth(l.desc) + 12;
  });
  pageFooter(3);
}
