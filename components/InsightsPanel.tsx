"use client";

interface Props { insights: string[]; }

// Color-code based on emoji/icon prefix
function insightAccent(text: string): string {
  if (text.startsWith('🚀')) return '#10B981'; // scale = green
  if (text.startsWith('⛔')) return '#EF4444'; // review = red
  if (text.startsWith('⚠️')) return '#F59E0B'; // warning = amber
  if (text.startsWith('🔁')) return '#F59E0B'; // fatigue = amber
  if (text.startsWith('💰')) return '#6366F1'; // budget = indigo
  if (text.startsWith('📉')) return '#10B981'; // savings = green
  if (text.startsWith('📊')) return '#3B82F6'; // CTR = blue
  if (text.startsWith('🛑')) return '#EF4444'; // don't react = red
  if (text.startsWith('⏳')) return '#8B5CF6'; // too early = purple
  return '#3B82F6';
}

function insightCategory(text: string): { label: string; bg: string; color: string } | null {
  if (text.startsWith('🛑') || (text.startsWith('⚠️') && text.includes("Don't make"))) {
    return { label: "⚡ Don't React", bg: "#FEE2E2", color: "#991B1B" };
  }
  if (text.startsWith('⏳')) {
    return { label: "⏳ Too Early", bg: "#EDE9FE", color: "#5B21B6" };
  }
  return null;
}

export default function InsightsPanel({ insights }: Props) {
  if (!insights.length) return null;

  const dontReactCount = insights.filter(i =>
    i.startsWith('🛑') || i.startsWith('⏳') || (i.startsWith('⚠️') && i.includes("Don't make"))
  ).length;

  return (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)", overflow: "hidden",
    }}>
      <div style={{
        padding: "16px 24px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 18 }}>💡</span>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Campaign Insights</span>
        <span style={{
          background: "var(--amber-light)", color: "var(--amber)",
          fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
        }}>{insights.length} insights</span>
        {dontReactCount > 0 && (
          <span style={{
            background: "#FEE2E2", color: "#991B1B",
            fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
          }}>{dontReactCount} don&apos;t-react warning{dontReactCount > 1 ? 's' : ''}</span>
        )}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)" }}>
          Rules-based · 2025 industry benchmarks
        </span>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        {insights.map((insight, i) => {
          const accent = insightAccent(insight);
          const category = insightCategory(insight);
          return (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "14px 16px",
              background: "var(--bg)", borderRadius: 8,
              borderLeft: `3px solid ${accent}`,
            }}>
              <span style={{ fontWeight: 700, color: accent, fontSize: 13, flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div style={{ flex: 1 }}>
                {category && (
                  <span style={{
                    display: "inline-block", fontSize: 10, fontWeight: 700,
                    padding: "1px 6px", borderRadius: 4,
                    background: category.bg, color: category.color,
                    marginBottom: 5, letterSpacing: "0.04em",
                  }}>{category.label}</span>
                )}
                <div style={{ fontSize: 13.5, lineHeight: 1.65 }}>{insight}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        padding: "10px 24px", borderTop: "1px solid var(--border)",
        fontSize: 11, color: "var(--muted)",
      }}>
        💎 Upgrade to MetriQuill Pro for AI-powered analysis with layered Pre-Click → Post-Click → Economics diagnosis →
      </div>
    </div>
  );
}
