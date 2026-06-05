"use client";

interface Props { insights: string[]; }

// Strip leading emoji from insight string (emoji stays in raw string for accent detection)
function stripEmoji(text: string): string {
  return text.replace(/^[\u{1F300}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{231A}-\u{23FF}\u{25AA}-\u{27BF}]\s*/u, "");
}

// Color-code based on emoji prefix (accent left-border + number color)
function insightAccent(text: string): string {
  if (text.startsWith("🚀")) return "#059669"; // scale = green
  if (text.startsWith("⛔")) return "#DC2626"; // review = red
  if (text.startsWith("⚠️")) return "#D97706"; // warning = amber
  if (text.startsWith("🔁")) return "#D97706"; // fatigue = amber
  if (text.startsWith("💰")) return "#4F46E5"; // budget = indigo
  if (text.startsWith("📉")) return "#059669"; // savings = green
  if (text.startsWith("📊")) return "#2563EB"; // CTR = blue
  if (text.startsWith("🛑")) return "#DC2626"; // don't react = red
  if (text.startsWith("⏳")) return "#7C3AED"; // too early = purple
  return "#2563EB";
}

function insightCategory(text: string): { label: string; bg: string; color: string } | null {
  if (text.startsWith("🛑") || (text.startsWith("⚠️") && text.includes("Don't make"))) {
    return { label: "Don't React", bg: "rgba(220,38,38,0.08)", color: "#DC2626" };
  }
  if (text.startsWith("⏳")) {
    return { label: "Too Early", bg: "rgba(124,58,237,0.08)", color: "#7C3AED" };
  }
  return null;
}

export default function InsightsPanel({ insights }: Props) {
  if (!insights.length) return null;

  const dontReactCount = insights.filter(i =>
    i.startsWith("🛑") || i.startsWith("⏳") || (i.startsWith("⚠️") && i.includes("Don't make"))
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3.5 6.5V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
        </svg>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Campaign Insights</span>
        <span style={{
          background: "var(--amber-light)", color: "var(--amber)",
          fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
          border: "1px solid rgba(217,119,6,0.18)",
        }}>{insights.length} insights</span>
        {dontReactCount > 0 && (
          <span style={{
            background: "rgba(220,38,38,0.08)", color: "#DC2626",
            border: "1px solid rgba(220,38,38,0.18)",
            fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
          }}>{dontReactCount} don&apos;t-react warning{dontReactCount > 1 ? "s" : ""}</span>
        )}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)" }}>
          Rules-based · 2025 industry benchmarks
        </span>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        {insights.map((insight, i) => {
          const accent   = insightAccent(insight);
          const category = insightCategory(insight);
          return (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "14px 16px",
              background: "var(--surface2)", borderRadius: 8,
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
                    border: `1px solid ${category.color}22`,
                  }}>{category.label}</span>
                )}
                <div style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--text2)" }}>
                  {stripEmoji(insight)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        padding: "10px 24px", borderTop: "1px solid var(--border)",
        fontSize: 11, color: "var(--muted)",
      }}>
        Upgrade to MetriQuill Pro for AI-powered analysis with layered Pre-Click → Post-Click → Economics diagnosis →
      </div>
    </div>
  );
}
