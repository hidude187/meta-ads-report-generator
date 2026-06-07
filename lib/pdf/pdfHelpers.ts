// lib/pdf/pdfHelpers.ts
// PDF-specific text helper (different from safeFilename in textUtils).

import { hasArabic } from "@/lib/textUtils";
import type { PdfCtx } from "@/lib/pdf/types";

/**
 * Returns a PDF-safe display name for a campaign row.
 * Arabic text always falls back to "Campaign N" — jsPDF cannot shape Arabic glyphs.
 * Non-Latin non-Arabic also falls back to "Campaign N".
 */
export function safeName(name: string, idx = 0, maxLen = 38): string {
  if (hasArabic(name)) return `Campaign ${idx + 1}`;
  const clean =
    name.replace(/[^\x00-\x7F\u00C0-\u024F]/g, "").trim() ||
    name.replace(/\s+/g, " ").slice(0, maxLen);
  return clean.length > maxLen ? clean.slice(0, maxLen) + "..." : clean;
}

/**
 * Adds a light diagonal "MetriQuill Free" watermark to the current page.
 * Call at the end of every non-cover page (pages 2–5).
 */
export function addWatermark(ctx: PdfCtx): void {
  const { doc, W, H } = ctx;
  doc.setFontSize(34);
  doc.setTextColor(218, 218, 218);
  doc.text("MetriQuill Free", W / 2, H / 2, { angle: 45, align: "center" });
  // Reset to standard dark text color
  doc.setTextColor(15, 23, 42);
}
