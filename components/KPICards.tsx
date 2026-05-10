"use client";

import { fmt } from "@/lib/formatters";

interface KPIs {
  totalSpend: number; totalImpressions: number; totalClicks: number;
  avgCTR: number; avgCPC: number; avgCPM: number;
  totalConversions: number; avgROAS: number;
  avgFrequency: number; totalReach: number;
}

interface Props {
  currency: string;
  kpis: KPIs;
}

const CARDS = [
  { key: "totalSpend", label: "Total Spend", type: "currency", color: "#2563EB", icon: "💰" },
  { key: "totalImpressions", label: "Impressions", type: "number", color: "#7C3AED", icon: "👁️" },
  { key: "totalReach", label: "Reach", type: "number", color: "#0891B2", icon: "📡" },
  { key: "avgFrequency", label: "Avg Frequency", type: "decimal", color: "#D97706", icon: "🔁", suffix: "x", warn: (v: number) => v > 3 },
  { key: "totalClicks", label: "Clicks", type: "number", color: "#0891B2", icon: "🖱️" },
  { key: "avgCTR", label: "Avg CTR", type: "percent", color: "#059669", icon: "📊" },
  { key: "avgCPC", label: "Avg CPC", type: "currency", color: "#DC2626", icon: "💸" },
  { key: "avgCPM", label: "CPM", type: "currency", color: "#6366F1", icon: "📢" },
  { key: "totalConversions", label: "Conversions", type: "number", color: "#059669", icon: "✅" },
  { key: "avgROAS", label: "Avg ROAS", type: "decimal", color: "#7C3AED", icon: "📈", suffix: "x" },
] as const;

export default function KPICards({ kpis, currency }: Props) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))",
      gap: 14,
    }}>
      {CARDS.map(card => {
        const val = kpis[card.key as keyof typeof kpis] as number;
        const hasWarn = 'warn' in card && card.warn ? card.warn(val) : false;
        const formatted = card.type === "currency"
          ? fmt(val, "currency", currency)
          : card.type === "percent"
          ? fmt(val, "percent")
          : card.type === "decimal"
          ? fmt(val, "decimal") + ('suffix' in card ? card.suffix : '')
          : fmt(val, "number");

        const color = hasWarn ? "#DC2626" : card.color;

        return (
          <div key={card.key} style={{
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            padding: "18px 20px",
            boxShadow: "var(--shadow)",
            borderTop: `3px solid ${color}`,
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{card.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.2 }}>
              {formatted}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
              {card.label}
              {hasWarn && <span title="High frequency — possible ad fatigue" style={{ color: "#DC2626", fontSize: 13 }}>⚠️</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
