// lib/textUtils.ts
// Shared text/filename utilities used by buildPdf, buildPng, and ExportButtons.

export function safeFilename(name: string): string {
  return (name || "report").replace(/[^a-z0-9\-_. ]/gi, "_").trim() || "report";
}

export function hasArabic(str: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(str);
}

export function reverseArabic(str: string): string {
  return str.split(" ").reverse().join(" ");
}

export async function fetchAmiriBase64(): Promise<string | null> {
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 5000)
    );
    const res = await Promise.race([
      fetch("https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.woff2"),
      timeout,
    ]);
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    bytes.forEach(b => { binary += String.fromCharCode(b); });
    return btoa(binary);
  } catch { return null; }
}

export function canvasRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);         ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y,   x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y,    x + r, y);
  ctx.closePath();
}
