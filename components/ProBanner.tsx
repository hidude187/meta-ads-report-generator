"use client";

export default function ProBanner() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
      color: "white",
      padding: "10px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      fontSize: 13,
    }}>
      <span>⚡ Want Google Ads, TikTok, Snapchat + AI insights?</span>
      <a
        href="https://metriquill.com?utm_source=metriquill-free&utm_medium=probanner&utm_campaign=upgrade"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: "white",
          color: "#1e40af",
          padding: "4px 12px",
          borderRadius: 6,
          fontWeight: 700,
          fontSize: 12,
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        MetriQuill Pro — Coming Soon
      </a>
    </div>
  );
}
