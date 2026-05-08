"use client";

import { CampaignData } from "@/lib/types";
import { fmt } from "@/lib/formatters";

interface Props {
  campaigns: CampaignData[];
  currency: string;
  kpis: {
    totalSpend: number; totalImpressions: number; totalClicks: number;
    avgCTR: number; avgCPC: number; avgCPM: number;
    totalConversions: number; avgROAS: number;
  };
}

const CARDS = [
  { key: "totalSpend", label: "Total Spend", type: "currency", color: "#2563EB", icon: "💰" },
  { key: "totalImpressions", label: "Impressions", type: "number", color: "#7C3AED", icon: "👁️" },
  { key: "totalClicks", label: "Clicks", type: "number", color: "#0891B2", icon: "🖱️" },
  { key: "avgCTR", label: "Avg CTR", type: "percent", color: "#059669", icon: "📊" },
  { key: "avgCPC", label: "Avg CPC", type: "currency", color: "#D97706", icon: "💸" },
  { key: "avgCPM", label: "CPM", type: "currency", color: "#DC2626", icon: "📢" },
  { key: "totalConversions", label: "Conversions", type: "number", color: "#059669", icon: "✅" },
  { key: "avgROAS", label: "Avg ROAS", type: "decimal", color: "#7C3AED", icon: "📈" },
] as const;

export default function KPICards({ kpis, currency }: Props) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: 14,
    }}>
      {CARDS.map(card => {
        const val = kpis[card.key as keyof typeof kpis] as number;
        const formatted = card.type === "currency"
          ? fmt(val, "currency", currency)
          : card.type === "percent"
          ? fmt(val, "percent")
          : card.type === "decimal"
          ? fmt(val, "decimal") + "x"
          : fmt(val, "number");

        return (
          <div key={card.key} style={{
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            padding: "18px 20px",
            boxShadow: "var(--shadow)",
            borderTop: `3px solid ${card.color}`,
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{card.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: card.color, lineHeight: 1.2 }}>
              {formatted}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, fontWeight: 500 }}>
              {card.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
