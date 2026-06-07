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
          <span style={{ fontSize: 18, flexShrink: 0 }}>💾</span>
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
        <div style={{ fontSize: 30, flexShrink: 0 }}>🤖</div>
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
