"use client";

interface Props { insights: string[]; }

export default function InsightsPanel({ insights }: Props) {
  if (!insights.length) return null;

  return (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)", overflow: "hidden",
    }}>
      <div style={{
        padding: "16px 24px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>💡</span>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Campaign Insights</span>
        <span style={{
          background: "var(--amber-light)", color: "var(--amber)",
          fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
        }}>{insights.length} insights</span>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {insights.map((insight, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, padding: "14px 16px",
            background: "var(--bg)", borderRadius: 8,
            borderLeft: "3px solid var(--blue)",
          }}>
            <span style={{ fontWeight: 700, color: "var(--blue)", fontSize: 13, flexShrink: 0 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ fontSize: 14, lineHeight: 1.6 }}>{insight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
