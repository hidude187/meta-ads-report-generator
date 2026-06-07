"use client";

const FEATURES = ["Google Ads", "TikTok", "Snapchat", "AI Insights", "Scheduled Reports"];

export default function ProBanner() {
  return (
    <div style={{
      background: "rgba(255,107,43,0.07)",
      borderBottom: "1px solid rgba(255,107,43,0.16)",
      padding: "10px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      flexWrap: "wrap",
    }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#FF6B2B", letterSpacing: "0.2px", whiteSpace: "nowrap" }}>
        ⚡ MetriQuill Pro
      </span>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        {FEATURES.map((f) => (
          <span key={f} style={{
            fontSize: 11, fontWeight: 600,
            padding: "2px 8px", borderRadius: 20,
            background: "rgba(255,107,43,0.10)",
            border: "1px solid rgba(255,107,43,0.20)",
            color: "var(--text2, #c4b5a5)",
            whiteSpace: "nowrap",
          }}>
            {f}
          </span>
        ))}
      </div>

      <a
        href="https://metriquill.com/signup?utm_source=free-tool&utm_medium=probanner&utm_campaign=upgrade"
        className="btn-primary"
        style={{
          padding: "5px 14px",
          borderRadius: 6,
          fontSize: 12,
          textDecoration: "none",
          whiteSpace: "nowrap",
          letterSpacing: "-0.1px",
          display: "inline-block",
          fontWeight: 700,
        }}
      >
        Try free →
      </a>
    </div>
  );
}
