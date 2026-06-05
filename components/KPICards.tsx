"use client";

import { fmt, BENCHMARKS } from "@/lib/formatters";

interface KPIs {
  totalSpend: number; totalImpressions: number; totalClicks: number;
  avgCTR: number; avgCPC: number; avgCPM: number;
  totalConversions: number; avgROAS: number; avgCPA: number;
  avgFrequency: number; totalReach: number;
}

interface Props { currency: string; kpis: KPIs; }

// Benchmark signals: returns 'good' | 'poor' | 'neutral'
function signal(key: string, val: number): 'good' | 'poor' | 'neutral' {
  if (key === 'avgCTR')  return val >= BENCHMARKS.ctr.good  ? 'good' : val < BENCHMARKS.ctr.poor   ? 'poor' : 'neutral';
  if (key === 'avgROAS') return val >= BENCHMARKS.roas.good ? 'good' : val < BENCHMARKS.roas.poor  ? 'poor' : 'neutral';
  if (key === 'avgCPC')  return val <= BENCHMARKS.cpc.good  ? 'good' : val > BENCHMARKS.cpc.poor   ? 'poor' : 'neutral';
  if (key === 'avgCPM')  return val <= BENCHMARKS.cpm.good  ? 'good' : val > BENCHMARKS.cpm.poor   ? 'poor' : 'neutral';
  if (key === 'avgFrequency') return val >= BENCHMARKS.frequency.danger ? 'poor' : val >= BENCHMARKS.frequency.warn ? 'poor' : 'neutral';
  return 'neutral';
}

function benchmarkLabel(key: string): string | null {
  if (key === 'avgCTR')  return `avg ${BENCHMARKS.ctr.avg}%`;
  if (key === 'avgROAS') return `avg ${BENCHMARKS.roas.avg}x`;
  if (key === 'avgCPC')  return `avg $${BENCHMARKS.cpc.avg}`;
  if (key === 'avgCPM')  return `avg $${BENCHMARKS.cpm.avg}`;
  if (key === 'avgFrequency') return 'warn >2.5x';
  return null;
}

const CARDS = [
  { key: "totalSpend",       label: "Total Spend",   type: "currency", color: "#FF6B2B", icon: "💰" },
  { key: "avgROAS",          label: "Avg ROAS",      type: "decimal",  color: "#10B981", icon: "📈", suffix: "x" },
  { key: "totalConversions", label: "Conversions",   type: "number",   color: "#8B5CF6", icon: "✅" },
  { key: "avgCPA",           label: "Avg CPA",       type: "currency", color: "#F59E0B", icon: "🎯" },
  { key: "totalImpressions", label: "Impressions",   type: "number",   color: "#6366F1", icon: "👁️" },
  { key: "totalReach",       label: "Reach",         type: "number",   color: "#0891B2", icon: "📡" },
  { key: "avgFrequency",     label: "Avg Frequency", type: "decimal",  color: "#D97706", icon: "🔁", suffix: "x" },
  { key: "totalClicks",      label: "Clicks",        type: "number",   color: "#0891B2", icon: "🖱️" },
  { key: "avgCTR",           label: "Avg CTR",       type: "percent",  color: "#059669", icon: "📊" },
  { key: "avgCPC",           label: "Avg CPC",       type: "currency", color: "#DC2626", icon: "💸" },
  { key: "avgCPM",           label: "CPM",           type: "currency", color: "#7C3AED", icon: "📢" },
] as const;

export default function KPICards({ kpis, currency }: Props) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
      gap: 14,
    }}>
      {CARDS.map(card => {
        const val = kpis[card.key as keyof typeof kpis] as number;
        const sig = signal(card.key, val);
        const bLabel = benchmarkLabel(card.key);
        const isWarn = card.key === 'avgFrequency' && val >= BENCHMARKS.frequency.warn;
        const color = isWarn ? "#DC2626" : card.color;

        const formatted =
          card.type === "currency" ? fmt(val, "currency", currency) :
          card.type === "percent"  ? fmt(val, "percent") :
          card.type === "decimal"  ? fmt(val, "decimal") + ('suffix' in card ? card.suffix : '') :
          fmt(val, "number");

        // Signal arrow + color
        const sigColor = sig === 'good' ? '#10B981' : sig === 'poor' ? '#EF4444' : '#64748B';
        const sigArrow = sig === 'good' ? '▲' : sig === 'poor' ? '▼' : '—';

        return (
          <div key={card.key} style={{
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            padding: "18px 20px",
            boxShadow: "var(--shadow)",
            borderTop: `3px solid ${color}`,
            position: "relative",
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.2 }}>
              {formatted}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, fontWeight: 500 }}>
              {card.label}
              {isWarn && <span title="High frequency — possible ad fatigue" style={{ marginLeft: 4, color: "#EF4444", fontWeight: 700 }}>!</span>}
            </div>
            {/* Benchmark line */}
            {bLabel && (
              <div style={{
                marginTop: 6,
                fontSize: 10.5,
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: sigColor,
                fontWeight: 600,
              }}>
                <span>{sigArrow}</span>
                <span>{bLabel}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
