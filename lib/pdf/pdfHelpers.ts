// lib/pdf/pdfHelpers.ts
// PDF-specific text helper (different from safeFilename in textUtils).

import { hasArabic, reverseArabic } from "@/lib/textUtils";

/**
 * Returns a PDF-safe display name for a campaign row.
 * Arabic text is reversed for RTL display; non-Latin non-Arabic falls back to "Campaign N".
 */
export function safeName(
  name: string,
  idx = 0,
  maxLen = 38,
  hasAmiri = false,
): string {
  if (hasArabic(name) && hasAmiri) {
    const r = reverseArabic(name);
    return r.length > maxLen ? r.slice(0, maxLen) + "..." : r;
  }
  if (hasArabic(name) && !hasAmiri) return `Campaign ${idx + 1}`;
  const clean =
    name.replace(/[^\x00-\x7F\u00C0-\u024F]/g, "").trim() ||
    name.replace(/\s+/g, " ").slice(0, maxLen);
  return clean.length > maxLen ? clean.slice(0, maxLen) + "..." : clean;
}
