"use client";

import { useState } from "react";
import { CampaignData, ClientInfo, KPISummary } from "@/lib/types";
import { safeFilename } from "@/lib/textUtils";

interface Props {
  campaigns: CampaignData[];
  clientInfo: ClientInfo;
  kpis: KPISummary;
  insights?: string[];
}

export default function ExportButtons({ campaigns, clientInfo, kpis, insights = [] }: Props) {
  const [pdfLoading,  setPdfLoading]  = useState(false);
  const [pngLoading,  setPngLoading]  = useState(false);
  const [pptxLoading, setPptxLoading] = useState(false);
  const [showToast,   setShowToast]   = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 6000);
  };

  // ── PDF ──────────────────────────────────────────────────────────────────
  const exportPDF = async () => {
    setPdfLoading(true);
    try {
      const { buildPdf } = await import("@/lib/buildPdf");
      await buildPdf(campaigns, clientInfo, kpis, insights);
      triggerToast();
    } catch (e) { console.error("PDF error:", e); }
    finally { setPdfLoading(false); }
  };

  // ── PNG ──────────────────────────────────────────────────────────────────
  const exportPNG = async () => {
    setPngLoading(true);
    try {
      const { buildPng } = await import("@/lib/buildPng");
      await buildPng(clientInfo, kpis);
    } catch (e) { console.error("PNG error:", e); }
    finally { setPngLoading(false); }
  };

  // ── PPTX ─────────────────────────────────────────────────────────────────
  const exportPPTX = async () => {
    setPptxLoading(true);
    try {
      const { exportPPTX: run } = await import("@/lib/exportPPTX");
      await run(campaigns, clientInfo);
      triggerToast();
    } catch (e) { console.error("PPTX error:", e); }
    finally { setPptxLoading(false); }
  };

  // ── CSV ──────────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ["Campaign", "Spend", "Impressions", "Clicks", "CTR", "CPC", "CPM", "CPA", "Conversions", "ROAS"];
    const csvCell = (v: string | number) => {
      const s = String(v);
      const safe = /^[=+\-@]/.test(s) ? `\t${s}` : s;
      return `"${safe.replace(/"/g, '""')}"`;
    };
    const rows = campaigns.map(c => [
      csvCell(c.name),
      c.spend, c.impressions, c.clicks,
      (c.ctr ?? 0).toFixed(2), (c.cpc ?? 0).toFixed(2), (c.cpm ?? 0).toFixed(2),
      c.cpa > 0 ? c.cpa.toFixed(2) : "",
      c.conversions, (c.roas ?? 0).toFixed(2),
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `metriquill-${safeFilename(clientInfo.clientName)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const btnStyle = (primary?: boolean, upgrade?: boolean): React.CSSProperties => ({
    padding: "11px 22px", borderRadius: 8, fontWeight: 600, fontSize: 14,
    cursor: "pointer", border: primary || upgrade ? "none" : "1px solid var(--border)",
    background: upgrade ? "var(--orange)" : primary ? "var(--blue)" : "var(--surface)",
    color: primary || upgrade ? "white" : "var(--text)",
    display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
    position: "relative", overflow: "hidden",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)", padding: "20px 24px",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      {/* Row 1: label + primary PDF button + Pro CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Export:</span>
        <button onClick={exportPDF} disabled={pdfLoading} style={btnStyle(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
          {pdfLoading ? "Generating PDF…" : "Download PDF (5 pages)"}
        </button>
        <a
          href="https://metriquill.com?utm_source=metriquill-free&utm_medium=export-bar&utm_campaign=upgrade"
          target="_blank" rel="noopener noreferrer"
          style={{ ...btnStyle(false, true), marginLeft: "auto" }}
        >
          Try MetriQuill Pro →
        </a>
      </div>

      {/* Row 2: secondary export buttons */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={exportPPTX} disabled={pptxLoading} style={btnStyle()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          {pptxLoading ? "Generating…" : "Export PowerPoint"}
        </button>

        <button onClick={exportPNG} disabled={pngLoading} style={btnStyle()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
          {pngLoading ? "Generating…" : "Export PNG"}
        </button>

        <button onClick={exportCSV} style={btnStyle()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <line x1="8" y1="13" x2="16" y2="13"/>
            <line x1="8" y1="17" x2="16" y2="17"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* Post-download toast */}
      {showToast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#0f172a", color: "white", borderRadius: 12,
          padding: "14px 18px", zIndex: 9999,
          display: "flex", alignItems: "center", gap: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)", maxWidth: 500, width: "calc(100% - 48px)",
        }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>💾</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Report downloaded!</div>
            <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>
              Save reports, schedule exports &amp; share with clients in MetriQuill Pro.
            </div>
          </div>
          <a
            href="https://metriquill.com?utm_source=metriquill-free&utm_medium=toast&utm_campaign=upgrade"
            target="_blank" rel="noopener noreferrer"
            style={{
              background: "var(--orange, #FF6B2B)", color: "white",
              padding: "8px 14px", borderRadius: 8, fontWeight: 700,
              fontSize: 13, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            Try Pro →
          </a>
          <button
            onClick={() => setShowToast(false)}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20, padding: "0 2px", lineHeight: 1, flexShrink: 0 }}
            aria-label="Dismiss"
          >×</button>
        </div>
      )}
    </div>
  );
}
