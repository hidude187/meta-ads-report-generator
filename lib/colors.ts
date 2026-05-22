// Shared hex color utilities — used by exportPDF (ExportButtons) and exportPPTX

export function hexToRgb(hex: string): [number, number, number] {
  const h = /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : "#2563EB";
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

export function darkenHex(hex: string, amount = 40): string {
  const h = /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : "#2563EB";
  const r = Math.max(0, parseInt(h.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(h.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(h.slice(5, 7), 16) - amount);
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
}

export function lightenHex(hex: string, amount = 180): string {
  const h = /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : "#2563EB";
  const r = Math.min(255, parseInt(h.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(h.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(h.slice(5, 7), 16) + amount);
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Returns hex without '#' prefix — for pptxgenjs which expects bare hex strings */
export function hexNoHash(hex: string): string {
  const h = /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : "#2563EB";
  return h.replace("#", "");
}
