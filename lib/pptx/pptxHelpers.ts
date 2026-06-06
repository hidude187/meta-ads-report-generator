// lib/pptx/pptxHelpers.ts
// Shared types, helpers, and slide primitives for PPTX export.

import { CampaignData, ClientInfo, KPISummary } from "../types";

export interface SlideCtx {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pres: any;
  brand: string;      // hex without #
  brandDark: string;  // hex without #
  W: number;
  H: number;
  clientInfo: ClientInfo;
  kpis: KPISummary;
  campaigns: CampaignData[];
}

/** Truncate campaign name for chart labels — strips non-Latin characters */
export function shortLabel(name: string, idx = 0): string {
  const clean = name.replace(/[^\x00-\x7F\u00C0-\u024F]/g, "").trim();
  const label = clean || `Campaign ${idx + 1}`;
  return label.length > 18 ? label.slice(0, 18) + "…" : label;
}

/** Standard light-background slide header band */
export function addSlideHeader(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  s: any,
  ctx: SlideCtx,
  title: string,
  subtitle?: string
): void {
  const { pres, brand, W } = ctx;
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.85,
    fill: { color: "F8FAFC" }, line: { color: "F8FAFC" },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.04,
    fill: { color: brand }, line: { color: brand },
  });
  s.addText(title, {
    x: 0.5, y: 0.12, w: 7, h: 0.45,
    fontSize: 22, bold: true, color: "0F172A", fontFace: "Calibri", margin: 0,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.5, y: 0.57, w: 7, h: 0.22,
      fontSize: 9, color: "64748B", fontFace: "Calibri", margin: 0,
    });
  }
}

/** Thin brand accent line at bottom of slide */
export function addSlideFooter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  s: any,
  ctx: SlideCtx
): void {
  const { pres, brand, W, H } = ctx;
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: H - 0.04, w: W, h: 0.04,
    fill: { color: brand }, line: { color: brand },
  });
}
