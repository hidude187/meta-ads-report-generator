"use client";

import { CampaignData, ClientInfo } from "@/lib/types";
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
  <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "8px 0 4px" }}>
    {text}
  </h2>
);

export default function ReportDashboard({ campaigns, clientInfo }: Props) {
  const kpis    = calcKPIs(campaigns);
  const insights = generateInsights(campaigns, clientInfo.currency);

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

      {/* Export buttons at top */}
      <ExportButtons campaigns={campaigns} clientInfo={clientInfo} kpis={kpis as Record<string, number>} insights={insights} />

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

      {/* Bottom export */}
      <ExportButtons campaigns={campaigns} clientInfo={clientInfo} kpis={kpis as Record<string, number>} insights={insights} />
    </div>
  );
}
