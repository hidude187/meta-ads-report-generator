// lib/exportPPTX.ts
// Entry point for PPTX export — assembles all slides and triggers download.
// Dynamically imported (browser only).

import { CampaignData, ClientInfo } from "./types";
import { calcKPIs } from "./kpi";
import { hexNoHash, darkenHex } from "./colors";
import { SlideCtx } from "./pptx/pptxHelpers";
import { buildCoverSlide } from "./pptx/coverSlide";
import { buildKpiSlide } from "./pptx/kpiSlide";
import { buildSpendChartSlide, buildBubbleChartSlide } from "./pptx/chartSlides";
import { buildTableSlide } from "./pptx/tableSlide";
import { buildEndSlide } from "./pptx/endSlide";

export async function exportPPTX(
  campaigns: CampaignData[],
  clientInfo: ClientInfo
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PptxGenJS = (await import("pptxgenjs")).default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pres: any = new PptxGenJS();
  pres.layout = "LAYOUT_16x9";
  pres.title = `MetriQuill Report — ${clientInfo.clientName || "Campaign"}`;
  pres.author = clientInfo.agencyName || "MetriQuill";

  const kpis = calcKPIs(campaigns);
  const ctx: SlideCtx = {
    pres,
    brand:     hexNoHash(clientInfo.brandColor),
    brandDark: hexNoHash(darkenHex(clientInfo.brandColor, 50)),
    W: 10,
    H: 5.625,
    clientInfo,
    kpis,
    campaigns,
  };

  buildCoverSlide(ctx);
  buildKpiSlide(ctx);
  buildSpendChartSlide(ctx);
  buildBubbleChartSlide(ctx);
  buildTableSlide(ctx);
  buildEndSlide(ctx);

  const filename = `metriquill-${(clientInfo.clientName || "report").replace(/[^a-z0-9]/gi, "_")}.pptx`;
  await pres.writeFile({ fileName: filename });
}
