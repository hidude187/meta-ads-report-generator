"use client";

export default function ProBanner() {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,107,43,0.12) 0%, rgba(224,64,140,0.10) 100%)",
      borderBottom: "1px solid rgba(255,107,43,0.18)",
      padding: "10px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      fontSize: 13,
      color: "var(--text2)",
      flexWrap: "wrap",
    }}>
      <span>⚡ Want Google Ads, TikTok & Snapchat support + AI insights + scheduled reports?</span>
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
        }}
      >
        Try MetriQuill free →
      </a>
    </div>
  );
}
