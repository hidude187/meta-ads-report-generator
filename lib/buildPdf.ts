// lib/buildPdf.ts
// Orchestrator: initialises the jsPDF document, loads fonts, builds context,
// calls each page module, then triggers the browser download.

import { CampaignData, ClientInfo, KPISummary } from "@/lib/types";
import { hexToRgb, darkenHex } from "@/lib/colors";
import { safeFilename } from "@/lib/textUtils";
import type { PdfCtx } from "@/lib/pdf/types";
import { drawCoverPage }     from "@/lib/pdf/page1Cover";
import { drawSummaryPage }   from "@/lib/pdf/page2Summary";
import { drawCampaignsPage } from "@/lib/pdf/page3Campaigns";
import { drawInsightsPage }  from "@/lib/pdf/page4Insights";
import { drawRecsPage }      from "@/lib/pdf/page5Recs";

export async function buildPdf(
  campaigns: CampaignData[],
  clientInfo: ClientInfo,
  kpis: KPISummary,
  insights: string[],
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc  = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, H = 297;

  // Brand colours
  const brand = /^#[0-9A-Fa-f]{6}$/.test(clientInfo.brandColor) ? clientInfo.brandColor : "#2563EB";
  const [br, bg, bb] = hexToRgb(brand);
  const [dr, dg, db] = hexToRgb(darkenHex(brand, 40));
  const cur = clientInfo.currency || "USD";

  // Font shorthand helper
  const LF = (s: "bold" | "normal" = "normal") => doc.setFont("helvetica", s);

  // Shared footer drawn on every content page
  const pageFooter = (pageNum: number) => {
    LF(); doc.setFontSize(7); doc.setTextColor(148, 163, 184);
    doc.text("metriquill.com/free", W / 2, H - 8, { align: "center" });
    doc.text(`${pageNum}`, W - 20, H - 8, { align: "right" });
    doc.setFillColor(br, bg, bb); doc.rect(0, H - 2, W, 2, "F");
  };

  const ctx: PdfCtx = { doc, W, H, br, bg, bb, dr, dg, db, cur, LF, pageFooter };

  // Draw pages (each page module calls doc.addPage() except page 1)
  await drawCoverPage(ctx, clientInfo, kpis);
  drawSummaryPage(ctx, campaigns, clientInfo, kpis);
  drawCampaignsPage(ctx, campaigns);
  drawInsightsPage(ctx, insights);
  drawRecsPage(ctx, campaigns, clientInfo);

  doc.save(`metriquill-${safeFilename(clientInfo.clientName)}.pdf`);
}
