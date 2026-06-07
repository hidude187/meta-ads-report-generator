// lib/pdf/pdfHelpers.ts
// PDF-specific text helper (different from safeFilename in textUtils).

import { hasArabic } from "@/lib/textUtils";

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
