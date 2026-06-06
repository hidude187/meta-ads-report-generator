// lib/textUtils.ts
// Shared text helpers used across PDF, PNG, and PPTX export

export function safeFilename(name: string): string {
  return (name || "report").replace(/[^a-z0-9\-_. ]/gi, "_").trim() || "report";
}

export function hasArabic(str: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(str);
}

export function reverseArabic(str: string): string {
  return str.split(" ").reverse().join(" ");
}
