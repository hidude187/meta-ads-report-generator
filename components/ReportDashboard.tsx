"use client";

import { useState } from "react";
import { CampaignData, ClientInfo, KPISummary } from "@/lib/types";
import { calcKPIs } from "@/lib/csvParser";
import { generateInsights } from "@/lib/formatters";
import KPICards from "./KPICards";
import CampaignTable from "./CampaignTable";
import dynamic from "next/dynamic";
import InsightsPanel from "./InsightsPanel";

const Charts = dynamic(() => import("./Charts"), { ssr: false });
const ExportButtons = dynamic(() => import("./ExportButtons"), { ssr: false });

interface Props {
  campaigns: CampaignData[];
  clientInfo: ClientInfo;
}

const sectionTitle = (text: string) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0 4px" }}>
    <div style={{ width: 3, height: 18, borderRadius: 2, background: "var(--blue)", flexShrink: 0 }} />
    <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.2px" }}>
      {text}
    </h2>
  </div>
);

export default function ReportDashboard({ campaigns, clientInfo }: Props) {
  const kpis: KPISummary = calcKPIs(campaigns);
  const insights = generateInsights(campaigns, clientInfo.currency);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Step badge */}
      <div style={{ background:"var(--surface)", borderRadius:"var(--radius)", boxShadow:"var(--shadow)", overflow:"hidden" }}>
        <div style={{
          padding:"16px 24px", borderBottom:"1px solid var(--border)",
          display:"flex", alignItems:"center", gap:12, background:"var(--green-light)",
        }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--green)", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>✓</div>
          <span style={{ fontWeight:600, fontSize:15, color:"var(--green)" }}>
            Report Ready — {campaigns.length} campaigns loaded
          </span>
        </div>
      </div>

      {/* Save-report banner */}
      {!bannerDismissed && (
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "var(--radius)", padding: "14px 20px",
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          border: "1px solid rgba(255,107,43,0.22)",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>Want to save this report?</span>
            <span style={{ color: "#94a3b8", fontSize: 13, marginLeft: 8 }}>Access anytime, schedule exports &amp; share with clients.</span>
          </div>
          <a
            href="https://metriquill.com?utm_source=metriquill-free&utm_medium=save-banner&utm_campaign=upgrade"
            target="_blank" rel="noopener noreferrer"
            style={{ background: "var(--orange, #FF6B2B)", color: "white", padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
          >
            Try MetriQuill Pro →
          </a>
          <button
            onClick={() => setBannerDismissed(true)}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20, padding: "0 4px", lineHeight: 1, flexShrink: 0 }}
            aria-label="Dismiss"
          >×</button>
        </div>
      )}

      {/* Export buttons at top */}
      <ExportButtons campaigns={campaigns} clientInfo={clientInfo} kpis={kpis} insights={insights} />

      {/* KPI Cards */}
      {sectionTitle("Key Performance Indicators")}
      <KPICards currency={clientInfo.currency} kpis={kpis} />

      {/* Charts */}
      {sectionTitle("Visual Analysis")}
      <Charts campaigns={campaigns} currency={clientInfo.currency} brandColor={clientInfo.brandColor} />

      {/* Campaign Table */}
      {sectionTitle("Campaign Breakdown")}
      <CampaignTable campaigns={campaigns} currency={clientInfo.currency} />

      {/* Insights */}
      {sectionTitle("Insights & Recommendations")}
      <InsightsPanel insights={insights} />

      {/* AI teaser card */}
      <div style={{
        padding: "18px 22px",
        background: "linear-gradient(135deg, rgba(79,70,229,0.07) 0%, rgba(124,58,237,0.07) 100%)",
        borderRadius: "var(--radius)", border: "1px solid rgba(79,70,229,0.18)",
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
          <path d="M19 2l.5 1.5L21 4l-1.5.5L19 6l-.5-1.5L17 4l1.5-.5L19 2z"/>
          <path d="M5 18l.5 1.5L7 20l-1.5.5L5 22l-.5-1.5L3 20l1.5-.5L5 18z"/>
        </svg>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#4F46E5", marginBottom: 4 }}>
            These insights are rule-based
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.55 }}>
            MetriQuill Pro uses AI to give you a layered Pre-Click → Post-Click → Economics diagnosis — not just flags.
          </div>
        </div>
        <a
          href="https://metriquill.com?utm_source=metriquill-free&utm_medium=ai-teaser&utm_campaign=upgrade"
          target="_blank" rel="noopener noreferrer"
          style={{
            background: "#4F46E5", color: "white", padding: "10px 18px",
            borderRadius: 8, fontWeight: 700, fontSize: 13,
            textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          Get AI Analysis →
        </a>
      </div>
    </div>
  );
}
