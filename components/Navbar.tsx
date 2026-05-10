"use client";

export default function Navbar() {
  return (
    <nav style={{
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      padding: "0 32px",
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 18 }}>
        <div style={{
          width: 32, height: 32, background: "var(--blue)",
          borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "white" }}>
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        MetriQuill
        <span style={{
          background: "var(--blue-light)", color: "var(--blue)",
          fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20
        }}>Free</span>
      </div>

      <a
        href="https://metriquill.com?utm_source=metriquill-free&utm_medium=navbar&utm_campaign=upgrade"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: "var(--blue)", color: "white",
          padding: "8px 16px", borderRadius: 8,
          fontSize: 13, fontWeight: 600, textDecoration: "none",
          transition: "0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--blue-dark)")}
        onMouseLeave={e => (e.currentTarget.style.background = "var(--blue)")}
      >
        Try MetriQuill Pro →
      </a>
    </nav>
  );
}
