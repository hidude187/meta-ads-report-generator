"use client";

import { useState } from "react";
import { CampaignData, ClientInfo } from "@/lib/types";
import { fmt } from "@/lib/formatters";

interface Props {
  campaigns: CampaignData[];
  clientInfo: ClientInfo;
  kpis: Record<string, number>;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : "#2563EB";
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}

function darken(hex: string, amount = 40): string {
  const [r,g,b] = hexToRgb(hex);
  const d = (v: number) => Math.max(0, v - amount).toString(16).padStart(2,"0");
  return `#${d(r)}${d(g)}${d(b)}`;
}

function hasArabic(str: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(str);
}

// Reverse Arabic words for RTL rendering in canvas (which is LTR-only)
function reverseArabic(str: string): string {
  return str.split(" ").reverse().join(" ");
}

// Fetch Amiri font and return base64 string for jsPDF embedding
async function fetchAmiriBase64(): Promise<string | null> {
  try {
    const res = await fetch(
      "https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.woff2"
    );
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    bytes.forEach(b => { binary += String.fromCharCode(b); });
    return btoa(binary);
  } catch {
    return null;
  }
}

function canvasRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── component ─────────────────────────────────────────────────────────────────

export default function ExportButtons({ campaigns, clientInfo, kpis }: Props) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pngLoading, setPngLoading] = useState(false);

  // ── CSV ───────────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ["Campaign","Spend","Impressions","Clicks","CTR","CPC","CPM","Conversions","ROAS"];
    const rows = campaigns.map(c => [
      `"${c.name.replace(/"/g,'""')}"`,
      c.spend, c.impressions, c.clicks,
      (c.ctr ?? 0).toFixed(2), (c.cpc ?? 0).toFixed(2), (c.cpm ?? 0).toFixed(2),
      c.conversions, (c.roas ?? 0).toFixed(2),
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }); // BOM for Excel Arabic
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `metriquill-${clientInfo.clientName || "report"}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── PNG ───────────────────────────────────────────────────────────────────
  const exportPNG = async () => {
    setPngLoading(true);
    try {
      const W = 1200; const H = 675;
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      const brand = /^#[0-9A-Fa-f]{6}$/.test(clientInfo.brandColor)
        ? clientInfo.brandColor : "#2563EB";
      const dark = darken(brand, 50);

      // Load Inter + Amiri fonts
      try {
        const [interFont, amiriFont] = await Promise.allSettled([
          new FontFace("Inter","url(https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2)").load(),
          new FontFace("Amiri","url(https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.woff2)").load(),
        ]);
        if (interFont.status === "fulfilled") document.fonts.add(interFont.value);
        if (amiriFont.status === "fulfilled") document.fonts.add(amiriFont.value);
      } catch { /* fallback */ }

      // ── Background: dark gradient with brand stripe ──
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#0a0f1e");
      grad.addColorStop(1, "#111827");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Top brand stripe
      ctx.fillStyle = brand;
      ctx.fillRect(0, 0, W, 5);

      // Large circle accent top-right
      ctx.beginPath();
      ctx.arc(W + 40, -40, 260, 0, Math.PI * 2);
      ctx.fillStyle = brand + "18";
      ctx.fill();

      // Small circle bottom-left
      ctx.beginPath();
      ctx.arc(-30, H + 30, 160, 0, Math.PI * 2);
      ctx.fillStyle = brand + "12";
      ctx.fill();

      // ── Logo ──
      const logoY = 48;
      if (clientInfo.logoDataUrl) {
        try {
          const img = new Image();
          await new Promise<void>((res, rej) => {
            img.onload = () => res(); img.onerror = () => rej();
            img.src = clientInfo.logoDataUrl;
          });
          ctx.drawImage(img, 60, logoY, 110, 44);
        } catch { /* skip */ }
      }

      // ── Client name ──
      const nameY = clientInfo.logoDataUrl ? 160 : 120;
      const clientName = clientInfo.clientName || "Campaign Report";
      ctx.fillStyle = "#ffffff";
      const arabicName = hasArabic(clientName);
      ctx.font = `bold 54px ${arabicName ? "Amiri" : "Inter"}, sans-serif`;
      ctx.fillText(arabicName ? reverseArabic(clientName) : clientName, 60, nameY);

      // Subline
      ctx.font = "22px Inter, sans-serif";
      ctx.fillStyle = "#64748b";
      const period = clientInfo.dateFrom && clientInfo.dateTo
        ? `${clientInfo.dateFrom}  \u2192  ${clientInfo.dateTo}`
        : "Performance Summary";
      ctx.fillText(period, 60, nameY + 40);

      // Agency tag
      if (clientInfo.agencyName) {
        ctx.font = "16px Inter, sans-serif";
        ctx.fillStyle = brand;
        ctx.fillText(clientInfo.agencyName.toUpperCase(), 60, nameY + 72);
      }

      // ── KPI Cards (4) ──
      const cards = [
        { label: "Total Spend", value: fmt(kpis.totalSpend, "currency", clientInfo.currency), accent: brand },
        { label: "Avg ROAS",    value: fmt(kpis.avgROAS, "decimal") + "x",                  accent: "#10B981" },
        { label: "Conversions", value: fmt(kpis.totalConversions, "number"),                 accent: "#8B5CF6" },
        { label: "Avg CTR",     value: fmt(kpis.avgCTR, "percent"),                          accent: "#F59E0B" },
      ];
      const cW = 245; const cH = 115; const cY = 460; const cGap = 20;
      cards.forEach((card, i) => {
        const x = 60 + i * (cW + cGap);
        // Card glass bg
        ctx.fillStyle = "#ffffff0d";
        canvasRoundRect(ctx, x, cY, cW, cH, 12); ctx.fill();
        // Top accent line
        ctx.fillStyle = card.accent;
        canvasRoundRect(ctx, x, cY, cW, 3, 1); ctx.fill();
        // Label
        ctx.fillStyle = "#64748b";
        ctx.font = "14px Inter, sans-serif";
        ctx.fillText(card.label, x + 18, cY + 30);
        // Value
        ctx.fillStyle = "#f1f5f9";
        ctx.font = "bold 30px Inter, sans-serif";
        ctx.fillText(card.value, x + 18, cY + 78);
      });

      // ── Footer ──
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, H - 38, W, 38);
      ctx.font = "13px Inter, sans-serif";
      ctx.fillStyle = "#475569";
      ctx.textAlign = "left";
      ctx.fillText("Generated by MetriQuill Free  ·  metriquill.com/free", 60, H - 13);
      ctx.textAlign = "right";
      ctx.fillStyle = "#64748b";
      ctx.fillText("Confidential", W - 60, H - 13);
      ctx.textAlign = "left";

      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `metriquill-${clientInfo.clientName || "report"}.png`;
        a.click(); URL.revokeObjectURL(url);
      }, "image/png");
    } catch (e) { console.error(e); }
    finally { setPngLoading(false); }
  };

  // ── PDF ───────────────────────────────────────────────────────────────────
  const exportPDF = async () => {
    setPdfLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210; const H = 297;
      const brand = /^#[0-9A-Fa-f]{6}$/.test(clientInfo.brandColor)
        ? clientInfo.brandColor : "#2563EB";
      const [br, bg, bb] = hexToRgb(brand);
      const [dr, dg, db] = hexToRgb(darken(brand, 40));

      // ── Embed Amiri for Arabic ──
      let hasAmiri = false;
      const amiriB64 = await fetchAmiriBase64();
      if (amiriB64) {
        try {
          doc.addFileToVFS("Amiri-Regular.woff2", amiriB64);
          doc.addFont("Amiri-Regular.woff2", "Amiri", "normal");
          hasAmiri = true;
        } catch { /* fallback to helvetica */ }
      }

      const setLatinFont  = (style: "bold"|"normal" = "normal") =>
        doc.setFont("helvetica", style);
      const setArabicFont = () =>
        hasAmiri ? doc.setFont("Amiri", "normal") : doc.setFont("helvetica", "normal");

      const safeName = (name: string, maxLen = 38) => {
        if (hasArabic(name) && hasAmiri) {
          // Reverse for RTL rendering in LTR jsPDF
          const rev = reverseArabic(name);
          return rev.length > maxLen ? rev.slice(0, maxLen) + "..." : rev;
        }
        // Strip unrenderable chars for latin
        const clean = name.replace(/[^\x00-\x7F\u00C0-\u024F]/g, "").trim()
          || name.replace(/\s+/g," ").slice(0, maxLen);
        return clean.length > maxLen ? clean.slice(0, maxLen) + "..." : clean;
      };

      // ═══════════════════════════════════════════════
      // PAGE 1 — COVER  (dark premium)
      // ═══════════════════════════════════════════════

      // Dark background
      doc.setFillColor(10, 15, 30);
      doc.rect(0, 0, W, H, "F");

      // Brand colour block — left sidebar stripe
      doc.setFillColor(br, bg, bb);
      doc.rect(0, 0, 8, H, "F");

      // Large circle accent top-right
      doc.setFillColor(br, bg, bb);
      doc.setGState(doc.GState({ opacity: 0.12 }));
      doc.circle(W + 10, -10, 90, "F");
      doc.setGState(doc.GState({ opacity: 0.07 }));
      doc.circle(W - 10, 30, 60, "F");
      doc.setGState(doc.GState({ opacity: 1 }));

      // Bottom brand bar
      doc.setFillColor(dr, dg, db);
      doc.rect(0, H - 18, W, 18, "F");

      // Logo
      const logoX = 24; let logoBottom = 30;
      if (clientInfo.logoDataUrl) {
        try {
          doc.addImage(clientInfo.logoDataUrl, "PNG", logoX, 22, 38, 16);
          logoBottom = 46;
        } catch {}
      }

      // "CAMPAIGN PERFORMANCE REPORT" label
      doc.setFontSize(8); setLatinFont("bold");
      doc.setTextColor(br, bg, bb);
      doc.text("CAMPAIGN PERFORMANCE REPORT", logoX, logoBottom + 16);

      // Thin rule
      doc.setDrawColor(br, bg, bb); doc.setLineWidth(0.4);
      doc.line(logoX, logoBottom + 20, W - 20, logoBottom + 20);

      // Client name — large
      const clientName = clientInfo.clientName || "Client Name";
      const isAr = hasArabic(clientName);
      doc.setTextColor(241, 245, 249);
      doc.setFontSize(36);
      if (isAr && hasAmiri) {
        setArabicFont();
        doc.text(reverseArabic(clientName), W - 20, logoBottom + 56, { align: "right" });
      } else {
        setLatinFont("bold");
        const wrapped = doc.splitTextToSize(clientName, W - 44);
        doc.text(wrapped, logoX, logoBottom + 56);
      }
      setLatinFont("normal");

      // Agency line
      if (clientInfo.agencyName) {
        doc.setFontSize(11); doc.setTextColor(br, bg, bb);
        const isArAg = hasArabic(clientInfo.agencyName);
        if (isArAg && hasAmiri) {
          setArabicFont();
          doc.text(reverseArabic(clientInfo.agencyName), W - 20, logoBottom + 76, { align:"right" });
          setLatinFont("normal");
        } else {
          doc.text(clientInfo.agencyName, logoX, logoBottom + 76);
        }
      }

      // Period
      if (clientInfo.dateFrom && clientInfo.dateTo) {
        doc.setFontSize(10); doc.setTextColor(148, 163, 184);
        doc.text(`${clientInfo.dateFrom}  to  ${clientInfo.dateTo}`, logoX, logoBottom + 90);
      }

      // ── KPI summary boxes on cover ──
      const kpiBoxes = [
        { label: "Total Spend",  value: fmt(kpis.totalSpend,"currency",clientInfo.currency) },
        { label: "Avg ROAS",     value: fmt(kpis.avgROAS,"decimal") + "x" },
        { label: "Conversions",  value: fmt(kpis.totalConversions,"number") },
        { label: "Avg CTR",      value: fmt(kpis.avgCTR,"percent") },
        { label: "Impressions",  value: fmt(kpis.totalImpressions,"number") },
        { label: "Avg CPC",      value: fmt(kpis.avgCPC,"currency",clientInfo.currency) },
      ];
      const bCols = 3; const bW = 54; const bH = 28; const bGap = 8;
      const bStartX = logoX; const bStartY = H - 18 - 10 - (Math.ceil(kpiBoxes.length / bCols)) * (bH + bGap);
      kpiBoxes.forEach(({ label, value }, i) => {
        const col = i % bCols; const row = Math.floor(i / bCols);
        const x = bStartX + col * (bW + bGap);
        const y = bStartY + row * (bH + bGap);
        doc.setFillColor(255,255,255); doc.setGState(doc.GState({ opacity: 0.06 }));
        doc.roundedRect(x, y, bW, bH, 2, 2, "F");
        doc.setGState(doc.GState({ opacity: 1 }));
        doc.setFillColor(br, bg, bb); doc.rect(x, y, 2, bH, "F");
        doc.setFontSize(6); setLatinFont("normal"); doc.setTextColor(148, 163, 184);
        doc.text(label, x + 5, y + 8);
        doc.setFontSize(11); setLatinFont("bold"); doc.setTextColor(241, 245, 249);
        doc.text(value, x + 5, y + 20);
      });

      // Footer text
      doc.setFontSize(7); setLatinFont("normal"); doc.setTextColor(100, 116, 139);
      doc.text("Generated by MetriQuill Free  ·  metriquill.com/free  ·  Confidential", logoX, H - 6);

      // ═══════════════════════════════════════════════
      // PAGE 2 — PERFORMANCE SUMMARY
      // ═══════════════════════════════════════════════
      doc.addPage();
      // White background with subtle top band
      doc.setFillColor(255,255,255); doc.rect(0,0,W,H,"F");
      doc.setFillColor(br,bg,bb); doc.rect(0,0,W,2,"F");
      doc.setFillColor(248,250,252); doc.rect(0,2,W,40,"F");

      doc.setFontSize(20); setLatinFont("bold"); doc.setTextColor(15,23,42);
      doc.text("Performance Summary", 20, 26);
      doc.setFontSize(9); setLatinFont("normal"); doc.setTextColor(100,116,139);
      if (clientInfo.dateFrom && clientInfo.dateTo)
        doc.text(`${clientInfo.dateFrom}  to  ${clientInfo.dateTo}`, 20, 36);

      // 10 KPI cards in 2x5 grid
      const kpiAll = [
        { label: "Total Spend",    value: fmt(kpis.totalSpend,"currency",clientInfo.currency),    color: [br,bg,bb] as [number,number,number] },
        { label: "Avg ROAS",       value: fmt(kpis.avgROAS,"decimal")+"x",                        color: [16,185,129] as [number,number,number] },
        { label: "Impressions",    value: fmt(kpis.totalImpressions,"number"),                     color: [139,92,246] as [number,number,number] },
        { label: "Reach",          value: fmt(kpis.totalReach,"number"),                           color: [245,158,11] as [number,number,number] },
        { label: "Avg Frequency",  value: fmt(kpis.avgFrequency,"decimal")+"x",                   color: [239,68,68] as [number,number,number] },
        { label: "Total Clicks",   value: fmt(kpis.totalClicks,"number"),                          color: [br,bg,bb] as [number,number,number] },
        { label: "Avg CTR",        value: fmt(kpis.avgCTR,"percent"),                             color: [16,185,129] as [number,number,number] },
        { label: "Avg CPC",        value: fmt(kpis.avgCPC,"currency",clientInfo.currency),        color: [139,92,246] as [number,number,number] },
        { label: "CPM",            value: fmt(kpis.avgCPM,"currency",clientInfo.currency),        color: [245,158,11] as [number,number,number] },
        { label: "Conversions",    value: fmt(kpis.totalConversions,"number"),                     color: [239,68,68] as [number,number,number] },
      ];
      const kW = 82; const kH = 26; const kGapX = 7; const kGapY = 8;
      const kStartX = 20; const kStartY = 52;
      kpiAll.forEach(({ label, value, color }, i) => {
        const col = i % 2; const row = Math.floor(i / 2);
        const x = kStartX + col * (kW + kGapX);
        const y = kStartY + row * (kH + kGapY);
        // Card shadow illusion
        doc.setFillColor(226,232,240); doc.roundedRect(x+1,y+1,kW,kH,2,2,"F");
        doc.setFillColor(255,255,255); doc.roundedRect(x,y,kW,kH,2,2,"F");
        // Left accent
        doc.setFillColor(...color); doc.rect(x,y,2,kH,"F");
        // Label
        doc.setFontSize(6.5); setLatinFont("normal"); doc.setTextColor(100,116,139);
        doc.text(label, x+6, y+9);
        // Value
        doc.setFontSize(13); setLatinFont("bold"); doc.setTextColor(...color);
        doc.text(value, x+6, y+20);
      });

      // ── Insights section on page 2 ──
      const insightY = kStartY + 5 * (kH + kGapY) + 12;
      doc.setFillColor(248,250,252); doc.roundedRect(20, insightY, W-40, 8, 2, 2, "F");
      doc.setFontSize(10); setLatinFont("bold"); doc.setTextColor(15,23,42);
      doc.text("Campaign Insights", 26, insightY + 5.5);

      // Top 3 performers
      const sorted = [...campaigns].sort((a,b) => (b.roas??0)-(a.roas??0));
      let iY = insightY + 14;
      sorted.slice(0, 3).forEach((c, i) => {
        const colors: [number,number,number][] = [[16,185,129],[245,158,11],[239,68,68]];
        const col = colors[i];
        doc.setFillColor(...col); doc.circle(23, iY - 1, 2, "F");
        doc.setFontSize(8); setLatinFont("normal"); doc.setTextColor(15,23,42);
        const nm = safeName(c.name, 50);
        const isArNm = hasArabic(c.name);
        if (isArNm && hasAmiri) { setArabicFont(); }
        doc.text(nm, 28, iY);
        setLatinFont("normal");
        doc.setTextColor(100,116,139);
        doc.text(`ROAS ${(c.roas??0).toFixed(1)}x  ·  Spend ${fmt(c.spend,"currency",clientInfo.currency)}`, W - 20, iY, { align: "right" });
        iY += 10;
      });

      // Page footer
      doc.setFontSize(7); setLatinFont("normal"); doc.setTextColor(148,163,184);
      doc.text("metriquill.com/free", W/2, H-8, { align:"center" });
      doc.setFillColor(br,bg,bb); doc.rect(0,H-2,W,2,"F");

      // ═══════════════════════════════════════════════
      // PAGE 3 — CAMPAIGN BREAKDOWN TABLE
      // ═══════════════════════════════════════════════
      doc.addPage();
      doc.setFillColor(255,255,255); doc.rect(0,0,W,H,"F");
      doc.setFillColor(br,bg,bb); doc.rect(0,0,W,2,"F");
      doc.setFillColor(248,250,252); doc.rect(0,2,W,40,"F");

      doc.setFontSize(20); setLatinFont("bold"); doc.setTextColor(15,23,42);
      doc.text("Campaign Breakdown", 20, 26);
      doc.setFontSize(9); setLatinFont("normal"); doc.setTextColor(100,116,139);
      doc.text(`${campaigns.length} campaigns`, 20, 36);

      // Table header
      const tCols = ["Campaign","Spend","Impressions","CTR","CPC","ROAS"];
      const tX    = [20, 95, 122, 152, 167, 187];
      const tHY   = 50;
      doc.setFillColor(15,23,42); doc.rect(20, tHY - 5, W-40, 10, "F");
      doc.setFontSize(7); setLatinFont("bold"); doc.setTextColor(255,255,255);
      tCols.forEach((col, i) => doc.text(col, tX[i], tHY));

      // Table rows
      campaigns.forEach((c, i) => {
        const rowY = tHY + 10 + i * 11;
        if (rowY > H - 20) return;

        // Alternating row bg
        if (i % 2 === 0) {
          doc.setFillColor(248,250,252); doc.rect(20, rowY - 6, W-40, 11, "F");
        }

        // ROAS color coding
        const roasVal = c.roas ?? 0;
        const roasRgb: [number,number,number] = roasVal >= 3
          ? [5,150,105] : roasVal >= 1.5 ? [217,119,6] : [220,38,38];

        // Performance dot
        doc.setFillColor(...roasRgb); doc.circle(22, rowY - 1.5, 1.5, "F");

        // Campaign name — Arabic or Latin
        const isArRow = hasArabic(c.name);
        const rowName = safeName(c.name, 32);
        doc.setFontSize(7.5);
        if (isArRow && hasAmiri) {
          setArabicFont(); doc.setTextColor(15,23,42);
          doc.text(rowName, tX[0] + 5, rowY);
          setLatinFont("normal");
        } else {
          setLatinFont("normal"); doc.setTextColor(15,23,42);
          doc.text(rowName, tX[0] + 5, rowY);
        }

        // Numeric columns
        doc.setFontSize(7.5); setLatinFont("normal"); doc.setTextColor(51,65,85);
        doc.text(fmt(c.spend,"currency",clientInfo.currency), tX[1], rowY);
        doc.text(fmt(c.impressions,"number"), tX[2], rowY);
        doc.text(fmt(c.ctr,"percent"), tX[3], rowY);
        doc.text(fmt(c.cpc,"currency",clientInfo.currency), tX[4], rowY);

        // ROAS badge
        const roasText = roasVal > 0 ? fmt(roasVal,"decimal") + "x" : "—";
        doc.setFillColor(...roasRgb);
        doc.setGState(doc.GState({ opacity: 0.12 }));
        doc.roundedRect(tX[5] - 1, rowY - 5, 20, 7, 1.5, 1.5, "F");
        doc.setGState(doc.GState({ opacity: 1 }));
        doc.setFontSize(7); setLatinFont("bold"); doc.setTextColor(...roasRgb);
        doc.text(roasText, tX[5] + 1, rowY);
      });

      // Table border bottom
      doc.setDrawColor(226,232,240); doc.setLineWidth(0.3);
      const lastRowY = tHY + 10 + Math.min(campaigns.length, Math.floor((H-40-tHY)/11)) * 11;
      doc.line(20, lastRowY, W-20, lastRowY);

      // Page footer
      doc.setFontSize(7); setLatinFont("normal"); doc.setTextColor(148,163,184);
      doc.text("metriquill.com/free", W/2, H-8, { align:"center" });
      doc.setFillColor(br,bg,bb); doc.rect(0,H-2,W,2,"F");

      doc.save(`metriquill-${clientInfo.clientName || "report"}.pdf`);
    } catch (e) {
      console.error("PDF error:", e);
    } finally {
      setPdfLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const btnStyle = (primary?: boolean, gradient?: boolean): React.CSSProperties => ({
    padding: "11px 22px", borderRadius: 8, fontWeight: 600, fontSize: 14,
    cursor: "pointer", border: primary || gradient ? "none" : "1px solid var(--border)",
    background: gradient
      ? "linear-gradient(135deg,#1e40af,#7c3aed)"
      : primary ? "var(--blue)" : "var(--surface)",
    color: primary || gradient ? "white" : "var(--text)",
    display: "flex", alignItems: "center", gap: 8,
    textDecoration: "none",
  });

  return (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)", padding: "20px 24px",
      display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
    }}>
      <span style={{ fontWeight: 600, fontSize: 15, marginRight: 8 }}>Export:</span>
      <button onClick={exportPDF} disabled={pdfLoading} style={btnStyle(true)}>
        <span style={{ display:"inline-block" }}>{pdfLoading ? "⏳" : "📄"}</span>
        {pdfLoading ? "Generating PDF…" : "Download PDF"}
      </button>
      <button onClick={exportPNG} disabled={pngLoading} style={btnStyle()}>
        <span style={{ display:"inline-block" }}>{pngLoading ? "⏳" : "🖼️"}</span>
        {pngLoading ? "Generating PNG…" : "Export PNG"}
      </button>
      <button onClick={exportCSV} style={btnStyle()}>📊 Export CSV</button>
      <a
        href="https://metriquill.com?utm_source=metriquill-free&utm_medium=export-bar&utm_campaign=upgrade"
        target="_blank" rel="noopener noreferrer"
        style={{ ...btnStyle(false, true), marginLeft: "auto" }}
      >
        ⚡ Try MetriQuill Pro
      </a>
    </div>
  );
}
