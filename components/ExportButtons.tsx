"use client";

import { useState } from "react";
import { CampaignData, ClientInfo, KPISummary } from "@/lib/types";
import { fmt, BENCHMARKS, getCampaignBadge, generateRecommendations } from "@/lib/formatters";
import { hexToRgb, darkenHex } from "@/lib/colors";

interface Props {
  campaigns: CampaignData[];
  clientInfo: ClientInfo;
  kpis: KPISummary;
  insights?: string[];
}

// ── helpers ───────────────────────────────────────────────────────────────────

// Sanitize a string for safe use as a filename
function safeFilename(name: string): string {
  return (name || "report").replace(/[^a-z0-9\-_. ]/gi, "_").trim() || "report";
}

function hasArabic(str: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(str);
}

function reverseArabic(str: string): string {
  return str.split(" ").reverse().join(" ");
}

async function fetchAmiriBase64(): Promise<string | null> {
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

function canvasRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
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

export default function ExportButtons({ campaigns, clientInfo, kpis, insights = [] }: Props) {
  const [pdfLoading, setPdfLoading]   = useState(false);
  const [pngLoading, setPngLoading]   = useState(false);
  const [pptxLoading, setPptxLoading] = useState(false);

  const exportPPTX = async () => {
    setPptxLoading(true);
    try {
      const { exportPPTX: run } = await import("@/lib/exportPPTX");
      await run(campaigns, clientInfo);
    } catch (e) { console.error("PPTX error:", e); }
    finally { setPptxLoading(false); }
  };

  // ── CSV ──────────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ["Campaign","Spend","Impressions","Clicks","CTR","CPC","CPM","CPA","Conversions","ROAS"];
    // Sanitize cell value: escape quotes + prevent CSV formula injection
    const csvCell = (v: string | number) => {
      const s = String(v);
      // Prefix formula-injection characters with a tab to neutralize them in Excel
      const safe = /^[=+\-@]/.test(s) ? `\t${s}` : s;
      return `"${safe.replace(/"/g, '""')}"`;
    };
    const rows = campaigns.map(c => [
      csvCell(c.name),
      c.spend, c.impressions, c.clicks,
      (c.ctr??0).toFixed(2), (c.cpc??0).toFixed(2), (c.cpm??0).toFixed(2),
      c.cpa > 0 ? (c.cpa).toFixed(2) : '',
      c.conversions, (c.roas??0).toFixed(2),
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `metriquill-${safeFilename(clientInfo.clientName)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── PNG ──────────────────────────────────────────────────────────────────
  const exportPNG = async () => {
    setPngLoading(true);
    try {
      const W = 1200; const H = 675;
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      const brand = /^#[0-9A-Fa-f]{6}$/.test(clientInfo.brandColor) ? clientInfo.brandColor : "#2563EB";
      const dark  = darkenHex(brand, 50);
      try {
        const [iF, aF] = await Promise.allSettled([
          new FontFace("Inter","url(https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2)").load(),
          new FontFace("Amiri","url(https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.woff2)").load(),
        ]);
        if (iF.status === "fulfilled") document.fonts.add(iF.value);
        if (aF.status === "fulfilled") document.fonts.add(aF.value);
      } catch { /* fallback */ }
      const grad = ctx.createLinearGradient(0,0,W,H);
      grad.addColorStop(0,"#0a0f1e"); grad.addColorStop(1,"#111827");
      ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = brand; ctx.fillRect(0,0,W,5);
      ctx.beginPath(); ctx.arc(W+40,-40,260,0,Math.PI*2); ctx.fillStyle = brand+"18"; ctx.fill();
      ctx.beginPath(); ctx.arc(-30,H+30,160,0,Math.PI*2); ctx.fillStyle = brand+"12"; ctx.fill();
      const logoY = 48;
      if (clientInfo.logoDataUrl) {
        try {
          const img = new Image();
          await new Promise<void>((res,rej) => { img.onload=()=>res(); img.onerror=()=>rej(); img.src=clientInfo.logoDataUrl; });
          ctx.drawImage(img, 60, logoY, 110, 44);
        } catch { /* skip */ }
      }
      const nameY = clientInfo.logoDataUrl ? 160 : 120;
      const isAr  = hasArabic(clientInfo.clientName||"");
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 54px ${isAr ? "Amiri" : "Inter"}, sans-serif`;
      ctx.fillText(isAr ? reverseArabic(clientInfo.clientName||"") : (clientInfo.clientName||"Campaign Report"), 60, nameY);
      ctx.font = "22px Inter, sans-serif"; ctx.fillStyle = "#64748b";
      const period = clientInfo.dateFrom && clientInfo.dateTo ? `${clientInfo.dateFrom}  →  ${clientInfo.dateTo}` : "Performance Summary";
      ctx.fillText(period, 60, nameY+40);
      if (clientInfo.agencyName) { ctx.font="16px Inter,sans-serif"; ctx.fillStyle=brand; ctx.fillText(clientInfo.agencyName.toUpperCase(),60,nameY+72); }
      const cards = [
        { label:"Total Spend",  value: fmt(kpis.totalSpend,"currency",clientInfo.currency), accent: brand },
        { label:"Avg ROAS",     value: fmt(kpis.avgROAS,"decimal")+"x",                    accent:"#10B981" },
        { label:"Avg CPA",      value: fmt(kpis.avgCPA,"currency",clientInfo.currency),    accent:"#F59E0B" },
        { label:"Avg CTR",      value: fmt(kpis.avgCTR,"percent"),                         accent:"#8B5CF6" },
      ];
      const cW=245,cH=115,cY=460,cGap=20;
      cards.forEach((card,i) => {
        const x = 60+i*(cW+cGap);
        ctx.fillStyle="#ffffff0d"; canvasRoundRect(ctx,x,cY,cW,cH,12); ctx.fill();
        ctx.fillStyle=card.accent; canvasRoundRect(ctx,x,cY,cW,3,1); ctx.fill();
        ctx.fillStyle="#64748b"; ctx.font="14px Inter,sans-serif"; ctx.fillText(card.label,x+18,cY+30);
        ctx.fillStyle="#f1f5f9"; ctx.font="bold 30px Inter,sans-serif"; ctx.fillText(card.value,x+18,cY+78);
      });
      ctx.fillStyle="#1e293b"; ctx.fillRect(0,H-38,W,38);
      ctx.font="13px Inter,sans-serif"; ctx.fillStyle="#475569"; ctx.textAlign="left";
      ctx.fillText("Generated by MetriQuill Free  ·  metriquill.com/free",60,H-13);
      ctx.textAlign="right"; ctx.fillStyle="#64748b"; ctx.fillText("Confidential",W-60,H-13); ctx.textAlign="left";
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href=url; a.download=`metriquill-${safeFilename(clientInfo.clientName)}.png`; a.click(); URL.revokeObjectURL(url);
      }, "image/png");
    } catch (e) { console.error(e); } finally { setPngLoading(false); }
  };

  // ── PDF ──────────────────────────────────────────────────────────────────
  const exportPDF = async () => {
    setPdfLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
      const W=210, H=297;
      const brand = /^#[0-9A-Fa-f]{6}$/.test(clientInfo.brandColor) ? clientInfo.brandColor : "#2563EB";
      const [br,bg,bb] = hexToRgb(brand);
      const [dr,dg,db] = hexToRgb(darkenHex(brand,40));
      const cur = clientInfo.currency || "USD";

      let hasAmiri = false;
      const amiriB64 = await fetchAmiriBase64();
      if (amiriB64) {
        try { doc.addFileToVFS("Amiri-Regular.woff2",amiriB64); doc.addFont("Amiri-Regular.woff2","Amiri","normal"); hasAmiri=true; } catch { /**/ }
      }
      const LF = (s:"bold"|"normal"="normal") => doc.setFont("helvetica",s);
      const AF = () => hasAmiri ? doc.setFont("Amiri","normal") : LF();

      const safeName = (name: string, idx=0, maxLen=38) => {
        if (hasArabic(name) && hasAmiri) { const r=reverseArabic(name); return r.length>maxLen?r.slice(0,maxLen)+"...":r; }
        if (hasArabic(name) && !hasAmiri) return `Campaign ${idx + 1}`;
        const clean = name.replace(/[^\x00-\x7F\u00C0-\u024F]/g,"").trim() || name.replace(/\s+/g," ").slice(0,maxLen);
        return clean.length>maxLen?clean.slice(0,maxLen)+"...":clean;
      };

      const pageFooter = (pageNum: number) => {
        LF(); doc.setFontSize(7); doc.setTextColor(148,163,184);
        doc.text("metriquill.com/free", W/2, H-8, {align:"center"});
        doc.text(`${pageNum}`, W-20, H-8, {align:"right"});
        doc.setFillColor(br,bg,bb); doc.rect(0,H-2,W,2,"F");
      };

      // ══════════════════════════════════════════════
      // PAGE 1 — COVER
      // ══════════════════════════════════════════════
      doc.setFillColor(10,15,30); doc.rect(0,0,W,H,"F");
      doc.setFillColor(br,bg,bb); doc.rect(0,0,8,H,"F");
      doc.setFillColor(br,bg,bb); doc.setGState(doc.GState({opacity:0.12})); doc.circle(W+10,-10,90,"F");
      doc.setGState(doc.GState({opacity:0.07})); doc.circle(W-10,30,60,"F");
      doc.setGState(doc.GState({opacity:1}));
      doc.setFillColor(dr,dg,db); doc.rect(0,H-18,W,18,"F");
      let logoBottom=30;
      if (clientInfo.logoDataUrl) { try { doc.addImage(clientInfo.logoDataUrl,"PNG",24,22,38,16); logoBottom=46; } catch {/**/ } }
      doc.setFontSize(8); LF("bold"); doc.setTextColor(br,bg,bb); doc.text("CAMPAIGN PERFORMANCE REPORT",24,logoBottom+16);
      doc.setDrawColor(br,bg,bb); doc.setLineWidth(0.4); doc.line(24,logoBottom+20,W-20,logoBottom+20);
      const cName = clientInfo.clientName||"Client Name";
      const isArC = hasArabic(cName);
      doc.setTextColor(241,245,249); doc.setFontSize(36);
      if (isArC && hasAmiri) { AF(); doc.text(reverseArabic(cName),W-20,logoBottom+56,{align:"right"}); } else { LF("bold"); doc.text(doc.splitTextToSize(cName,W-44),24,logoBottom+56); }
      LF("normal");
      if (clientInfo.agencyName) { doc.setFontSize(11); doc.setTextColor(br,bg,bb); const isArA=hasArabic(clientInfo.agencyName); if(isArA&&hasAmiri){AF();doc.text(reverseArabic(clientInfo.agencyName),W-20,logoBottom+76,{align:"right"});LF("normal");}else{doc.text(clientInfo.agencyName,24,logoBottom+76);} }
      if (clientInfo.dateFrom&&clientInfo.dateTo) { doc.setFontSize(10); doc.setTextColor(148,163,184); doc.text(`${clientInfo.dateFrom}  to  ${clientInfo.dateTo}`,24,logoBottom+90); }
      // KPI summary on cover
      const coverKPIs = [
        {label:"Total Spend",  value:fmt(kpis.totalSpend,"currency",cur)},
        {label:"Avg ROAS",     value:fmt(kpis.avgROAS,"decimal")+"x"},
        {label:"Avg CPA",      value:fmt(kpis.avgCPA,"currency",cur)},
        {label:"Conversions",  value:fmt(kpis.totalConversions,"number")},
        {label:"Impressions",  value:fmt(kpis.totalImpressions,"number")},
        {label:"Avg CTR",      value:fmt(kpis.avgCTR,"percent")},
      ];
      const bW=54,bH=28,bGap=8,bCols=3;
      const bSX=24, bSY=H-18-10-(Math.ceil(coverKPIs.length/bCols))*(bH+bGap);
      coverKPIs.forEach(({label,value},i)=>{
        const col=i%bCols, row=Math.floor(i/bCols);
        const x=bSX+col*(bW+bGap), y=bSY+row*(bH+bGap);
        doc.setFillColor(255,255,255); doc.setGState(doc.GState({opacity:0.06})); doc.roundedRect(x,y,bW,bH,2,2,"F"); doc.setGState(doc.GState({opacity:1}));
        doc.setFillColor(br,bg,bb); doc.rect(x,y,2,bH,"F");
        doc.setFontSize(6); LF("normal"); doc.setTextColor(148,163,184); doc.text(label,x+5,y+8);
        doc.setFontSize(11); LF("bold"); doc.setTextColor(241,245,249); doc.text(value,x+5,y+20);
      });
      doc.setFontSize(7); LF("normal"); doc.setTextColor(100,116,139);
      doc.text("Generated by MetriQuill Free  ·  metriquill.com/free  ·  Confidential",24,H-6);

      // ══════════════════════════════════════════════
      // PAGE 2 — EXECUTIVE SUMMARY + BENCHMARKS
      // ══════════════════════════════════════════════
      doc.addPage();
      doc.setFillColor(255,255,255); doc.rect(0,0,W,H,"F");
      doc.setFillColor(br,bg,bb); doc.rect(0,0,W,2,"F");
      doc.setFillColor(248,250,252); doc.rect(0,2,W,40,"F");
      doc.setFontSize(20); LF("bold"); doc.setTextColor(15,23,42); doc.text("Executive Summary",20,26);
      doc.setFontSize(9); LF("normal"); doc.setTextColor(100,116,139);
      if (clientInfo.dateFrom&&clientInfo.dateTo) doc.text(`${clientInfo.dateFrom}  to  ${clientInfo.dateTo}`,20,36);

      // Narrative summary
      const totalSpend = kpis.totalSpend||0;
      const avgROAS    = kpis.avgROAS||0;
      const totalConv  = kpis.totalConversions||0;
      const avgCTR     = kpis.avgCTR||0;
      const avgCPA     = kpis.avgCPA||0;
      const roasSorted = [...campaigns].filter(c=>c.roas>0).sort((a,b)=>b.roas-a.roas);
      const topCampaign = roasSorted[0];
      const summaryLines = [
        `Total ad spend for this period: ${fmt(totalSpend,"currency",cur)} across ${campaigns.length} campaigns.`,
        avgROAS>=3
          ? `Overall ROAS of ${avgROAS.toFixed(2)}x is above the industry average of 2.19x — strong account performance.`
          : avgROAS>=1.5
          ? `Overall ROAS of ${avgROAS.toFixed(2)}x is near the industry average of 2.19x. Optimization opportunities exist.`
          : `Overall ROAS of ${avgROAS.toFixed(2)}x is below the industry average of 2.19x. Immediate review recommended.`,
        totalConv>0 ? `Generated ${fmt(totalConv,"number")} conversions at an average cost of ${fmt(avgCPA,"currency",cur)} per acquisition.` : `No conversion data available for this period.`,
        topCampaign ? `Top performer: "${topCampaign.name}" at ${topCampaign.roas.toFixed(1)}x ROAS.` : "",
        avgCTR>=1.49 ? `Average CTR of ${avgCTR.toFixed(2)}% is above the industry benchmark of 1.49%.` : `Average CTR of ${avgCTR.toFixed(2)}% is below the industry benchmark of 1.49% — creative refresh may help.`,
      ].filter(Boolean);

      let summaryY = 52;
      summaryLines.forEach(line => {
        doc.setFontSize(9); LF("normal"); doc.setTextColor(51,65,85);
        const wrapped = doc.splitTextToSize(line, W-50);
        doc.text(wrapped, 20, summaryY);
        summaryY += wrapped.length * 6 + 4;
      });

      // KPI + Benchmark table
      summaryY += 8;
      doc.setFillColor(248,250,252); doc.roundedRect(20,summaryY,W-40,8,2,2,"F");
      doc.setFontSize(10); LF("bold"); doc.setTextColor(15,23,42); doc.text("KPI vs Industry Benchmarks",26,summaryY+5.5);
      summaryY += 12;

      const benchRows = [
        { label:"Avg CTR",      value:fmt(kpis.avgCTR,"percent"),              benchmark:"0.90%",  good:(kpis.avgCTR||0)>0&&(kpis.avgCTR||0)>=BENCHMARKS.ctr.good,   bad:(kpis.avgCTR||0)>0&&(kpis.avgCTR||0)<BENCHMARKS.ctr.poor },
        { label:"Avg CPC",      value:fmt(kpis.avgCPC,"currency",cur),         benchmark:"$1.72",  good:(kpis.avgCPC||0)>0&&(kpis.avgCPC||0)<=BENCHMARKS.cpc.good,   bad:(kpis.avgCPC||0)>0&&(kpis.avgCPC||0)>BENCHMARKS.cpc.poor },
        { label:"Avg CPM",      value:fmt(kpis.avgCPM,"currency",cur),         benchmark:"$14.00", good:(kpis.avgCPM||0)>0&&(kpis.avgCPM||0)<=BENCHMARKS.cpm.good,   bad:(kpis.avgCPM||0)>0&&(kpis.avgCPM||0)>BENCHMARKS.cpm.poor },
        { label:"Avg ROAS",     value:fmt(kpis.avgROAS,"decimal")+"x",         benchmark:"2.19x",  good:(kpis.avgROAS||0)>0&&(kpis.avgROAS||0)>=BENCHMARKS.roas.good, bad:(kpis.avgROAS||0)>0&&(kpis.avgROAS||0)<BENCHMARKS.roas.poor },
        { label:"Avg Frequency",value:fmt(kpis.avgFrequency,"decimal")+"x",   benchmark:"<2.5x",  good:(kpis.avgFrequency||0)<2.0,                                   bad:(kpis.avgFrequency||0)>=BENCHMARKS.frequency.warn },
      ];

      // Header
      doc.setFontSize(7.5); LF("bold"); doc.setTextColor(100,116,139);
      doc.text("Metric",20,summaryY); doc.text("Your Result",100,summaryY,{align:"right"}); doc.text("Industry Avg",135,summaryY,{align:"right"}); doc.text("Signal",165,summaryY,{align:"right"});
      doc.setDrawColor(226,232,240); doc.setLineWidth(0.3); doc.line(20,summaryY+2,W-20,summaryY+2);
      summaryY += 8;

      benchRows.forEach(row => {
        if (row.label==="Avg Frequency" && (kpis.avgFrequency||0)===0) return;
        doc.setFontSize(8.5); LF("normal"); doc.setTextColor(15,23,42);
        doc.text(row.label,20,summaryY);
        LF("bold"); doc.text(row.value,100,summaryY,{align:"right"});
        LF("normal"); doc.setTextColor(100,116,139); doc.text(row.benchmark,135,summaryY,{align:"right"});
        const sigColor: [number,number,number] = row.good?[5,150,105]:row.bad?[220,38,38]:[100,116,139];
        const sigText = row.good?"▲ Above avg":row.bad?"▼ Below avg":"— On track";
        doc.setTextColor(...sigColor); LF("bold"); doc.text(sigText,165,summaryY,{align:"right"});
        doc.setDrawColor(241,245,249); doc.setLineWidth(0.2); doc.line(20,summaryY+3,W-20,summaryY+3);
        summaryY += 10;
      });
      pageFooter(2);

      // ══════════════════════════════════════════════
      // PAGE 3 — CAMPAIGN TABLE (with CPA + badges)
      // ══════════════════════════════════════════════
      doc.addPage();
      doc.setFillColor(255,255,255); doc.rect(0,0,W,H,"F");
      doc.setFillColor(br,bg,bb); doc.rect(0,0,W,2,"F");
      doc.setFillColor(248,250,252); doc.rect(0,2,W,40,"F");
      doc.setFontSize(20); LF("bold"); doc.setTextColor(15,23,42); doc.text("Campaign Breakdown",20,26);
      doc.setFontSize(9); LF("normal"); doc.setTextColor(100,116,139); doc.text(`${campaigns.length} campaigns`,20,36);

      // Table header
      const tCols = ["Campaign","Spend","Impr.","CTR","CPC","CPA","Conv.","ROAS"];
      const tX    = [20,90,115,137,153,167,181,193];
      const tHY   = 50;
      doc.setFillColor(15,23,42); doc.rect(20,tHY-5,W-40,10,"F");
      doc.setFontSize(6.5); LF("bold"); doc.setTextColor(255,255,255);
      tCols.forEach((col,i) => doc.text(col,tX[i],tHY));

      campaigns.forEach((c,i) => {
        const rowY = tHY+10+i*12;
        if (rowY>H-30) return;
        if (i%2===0) { doc.setFillColor(248,250,252); doc.rect(20,rowY-6,W-40,12,"F"); }
        const badge    = getCampaignBadge(c);
        const roasVal  = c.roas??0;
        const roasRgb: [number,number,number] = roasVal>=3?[5,150,105]:roasVal>=1.5?[217,119,6]:[220,38,38];
        // dot
        doc.setFillColor(...roasRgb); doc.circle(22,rowY-1.5,1.5,"F");
        // name
        const isArRow = hasArabic(c.name);
        const rowName = safeName(c.name, i, 28);
        doc.setFontSize(7); isArRow&&hasAmiri ? (AF(),doc.setTextColor(15,23,42),doc.text(rowName,tX[0]+5,rowY),LF("normal")) : (LF("normal"),doc.setTextColor(15,23,42),doc.text(rowName,tX[0]+5,rowY));
        // badge
        if (badge) {
          const badgeColors: Record<string,[number,number,number]> = { TOP:[5,150,105], REVIEW:[220,38,38], WATCH:[217,119,6] };
          const [bR,bG,bBl] = badgeColors[badge]||[100,116,139];
          doc.setFillColor(bR,bG,bBl); doc.setGState(doc.GState({opacity:0.15})); doc.roundedRect(tX[0]+5+doc.getTextWidth(rowName)+2,rowY-5,badge.length*2.2+4,6,1,1,"F"); doc.setGState(doc.GState({opacity:1}));
          doc.setFontSize(5); LF("bold"); doc.setTextColor(bR,bG,bBl); doc.text(badge,tX[0]+5+doc.getTextWidth(rowName)+4,rowY-1);
        }
        // numeric cols
        doc.setFontSize(7); LF("normal"); doc.setTextColor(51,65,85);
        doc.text(fmt(c.spend,"currency",cur),tX[1],rowY);
        doc.text(fmt(c.impressions,"number"),tX[2],rowY);
        // CTR — color coded
        const ctrRgb: [number,number,number] = c.ctr>=1.49?[5,150,105]:c.ctr<0.72?[220,38,38]:[51,65,85];
        doc.setTextColor(...ctrRgb); doc.text(fmt(c.ctr,"percent"),tX[3],rowY);
        doc.setTextColor(51,65,85);
        doc.text(fmt(c.cpc,"currency",cur),tX[4],rowY);
        doc.text(c.cpa>0?fmt(c.cpa,"currency",cur):"—",tX[5],rowY);
        doc.text(fmt(c.conversions,"number"),tX[6],rowY);
        // ROAS badge
        const roasText = roasVal>0?fmt(roasVal,"decimal")+"x":"—";
        doc.setFillColor(...roasRgb); doc.setGState(doc.GState({opacity:0.12})); doc.roundedRect(tX[7]-1,rowY-5,18,7,1.5,1.5,"F"); doc.setGState(doc.GState({opacity:1}));
        doc.setFontSize(6.5); LF("bold"); doc.setTextColor(...roasRgb); doc.text(roasText,tX[7]+1,rowY);
      });

      // Legend
      const legY = tHY+10+Math.min(campaigns.length,Math.floor((H-40-tHY)/12))*12+8;
      const legends = [{label:"TOP",color:[5,150,105] as [number,number,number],desc:"ROAS ≥3x"},{label:"REVIEW",color:[220,38,38] as [number,number,number],desc:"ROAS <1.5x"},{label:"WATCH",color:[217,119,6] as [number,number,number],desc:"Frequency ≥2.5x"}];
      let legX=20;
      legends.forEach(l => {
        doc.setFontSize(6); LF("bold"); doc.setTextColor(...l.color); doc.text(l.label,legX,legY);
        legX+=doc.getTextWidth(l.label)+2;
        doc.setFontSize(6); LF("normal"); doc.setTextColor(100,116,139); doc.text(l.desc,legX,legY);
        legX+=doc.getTextWidth(l.desc)+12;
      });
      pageFooter(3);

      // ══════════════════════════════════════════════
      // PAGE 4 — INSIGHTS
      // ══════════════════════════════════════════════
      doc.addPage();
      doc.setFillColor(255,255,255); doc.rect(0,0,W,H,"F");
      doc.setFillColor(br,bg,bb); doc.rect(0,0,W,2,"F");
      doc.setFillColor(248,250,252); doc.rect(0,2,W,40,"F");
      doc.setFontSize(20); LF("bold"); doc.setTextColor(15,23,42); doc.text("Campaign Insights",20,26);
      doc.setFontSize(9); LF("normal"); doc.setTextColor(100,116,139); doc.text("Rules-based analysis using 2025 industry benchmarks",20,36);

      const insightAccents: [number,number,number][] = [[16,185,129],[239,68,68],[245,158,11],[245,158,11],[99,102,241],[16,185,129]];
      let insY = 54;
      insights.forEach((text, i) => {
        const [iR,iG,iB] = insightAccents[i % insightAccents.length];
        // Card bg
        doc.setFillColor(248,250,252); doc.roundedRect(20,insY,W-40,2,1,1,"F"); // top rule
        doc.setFillColor(iR,iG,iB); doc.rect(20,insY,3,30,"F");
        doc.setFillColor(248,250,252); doc.roundedRect(23,insY,W-43,30,0,0,"F");
        // Number
        doc.setFontSize(8); LF("bold"); doc.setTextColor(iR,iG,iB); doc.text(`0${i+1}`,26,insY+10);
        // Text — strip emoji for PDF
        const clean = text.replace(/[\u{1F000}-\u{1FFFF}]|[\u2600-\u27FF]|⚠️|⛔|🚀|🔁|💰|📉|📊/gu,"").trim();
        const wrapped = doc.splitTextToSize(clean, W-60);
        doc.setFontSize(8.5); LF("normal"); doc.setTextColor(15,23,42); doc.text(wrapped,36,insY+10);
        const blockH = Math.max(30, wrapped.length*5.5+10);
        insY += blockH+6;
      });

      if (insights.length===0) {
        doc.setFontSize(9); LF("normal"); doc.setTextColor(100,116,139); doc.text("No insights generated.",20,60);
      }
      pageFooter(4);

      // ══════════════════════════════════════════════
      // PAGE 5 — RECOMMENDATIONS
      // ══════════════════════════════════════════════
      doc.addPage();
      doc.setFillColor(255,255,255); doc.rect(0,0,W,H,"F");
      doc.setFillColor(br,bg,bb); doc.rect(0,0,W,2,"F");
      doc.setFillColor(248,250,252); doc.rect(0,2,W,40,"F");
      doc.setFontSize(20); LF("bold"); doc.setTextColor(15,23,42); doc.text("Recommendations",20,26);
      doc.setFontSize(9); LF("normal"); doc.setTextColor(100,116,139); doc.text("Suggested actions for the next reporting period",20,36);

      const recs = generateRecommendations(campaigns, cur);
      let recY = 54;
      recs.forEach((rec, i) => {
        const bulletColors: [number,number,number][] = [[5,150,105],[220,38,38],[245,158,11],[99,102,241],[59,130,246]];
        const [rR,rG,rB] = bulletColors[i%bulletColors.length];
        doc.setFillColor(rR,rG,rB); doc.circle(24,recY-1,2.5,"F");
        doc.setFillColor(rR,rG,rB); doc.setGState(doc.GState({opacity:0.06})); doc.roundedRect(20,recY-8,W-40,20,3,3,"F"); doc.setGState(doc.GState({opacity:1}));
        const wrapped = doc.splitTextToSize(rec, W-55);
        doc.setFontSize(9); LF("normal"); doc.setTextColor(15,23,42); doc.text(wrapped,30,recY);
        recY += wrapped.length*5.5+14;
      });

      // Pro upsell box
      recY += 4;
      doc.setFillColor(br,bg,bb); doc.setGState(doc.GState({opacity:0.08})); doc.roundedRect(20,recY,W-40,28,4,4,"F"); doc.setGState(doc.GState({opacity:1}));
      doc.setFillColor(br,bg,bb); doc.rect(20,recY,3,28,"F");
      doc.setFontSize(10); LF("bold"); doc.setTextColor(br,bg,bb); doc.text("Upgrade to MetriQuill Pro",26,recY+10);
      doc.setFontSize(8.5); LF("normal"); doc.setTextColor(51,65,85);
      doc.text("Get AI-powered analysis, budget reallocation recommendations, and industry-specific benchmarks.",26,recY+20);

      pageFooter(5);

      doc.save(`metriquill-${safeFilename(clientInfo.clientName)}.pdf`);
    } catch (e) { console.error("PDF error:",e); }
    finally { setPdfLoading(false); }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const btnStyle = (primary?: boolean, upgrade?: boolean): React.CSSProperties => ({
    padding: "11px 22px", borderRadius: 8, fontWeight: 600, fontSize: 14,
    cursor: "pointer", border: primary || upgrade ? "none" : "1px solid var(--border)",
    background: upgrade ? "var(--orange)" : primary ? "var(--blue)" : "var(--surface)",
    color: primary || upgrade ? "white" : "var(--text)",
    display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
    position: "relative", overflow: "hidden",
  });

  return (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)", padding: "20px 24px",
      display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
    }}>
      <span style={{ fontWeight: 600, fontSize: 15, marginRight: 8 }}>Export:</span>
      <button onClick={exportPDF} disabled={pdfLoading} style={btnStyle(true)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
        {pdfLoading ? "Generating PDF…" : "Download PDF (5 pages)"}
      </button>
      <button onClick={exportPPTX} disabled={pptxLoading} style={btnStyle()}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        {pptxLoading ? "Generating…" : "Export PowerPoint"}
      </button>
      <button onClick={exportPNG} disabled={pngLoading} style={btnStyle()}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
        {pngLoading ? "Generating…" : "Export PNG"}
      </button>
      <button onClick={exportCSV} style={btnStyle()}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><polyline points="14,2 14,8 20,8"/></svg>
        Export CSV
      </button>
      <a
        href="https://metriquill.com?utm_source=metriquill-free&utm_medium=export-bar&utm_campaign=upgrade"
        target="_blank" rel="noopener noreferrer"
        style={{ ...btnStyle(false, true), marginLeft: "auto" }}
      >
        Try MetriQuill Pro →
      </a>
    </div>
  );
}
