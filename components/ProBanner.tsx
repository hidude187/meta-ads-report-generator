"use client";

export default function ProBanner() {
  return (
    <div style={{
      background: "rgba(255,107,43,0.06)",
      borderBottom: "1px solid rgba(255,107,43,0.14)",
      padding: "10px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      fontSize: 13,
      color: "var(--text2)",
      flexWrap: "wrap",
    }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF6B2B" aria-hidden="true">
          <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/>
        </svg>
        Want Google Ads, TikTok &amp; Snapchat support + AI insights + scheduled reports?
      </span>
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
