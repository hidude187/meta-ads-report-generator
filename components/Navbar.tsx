"use client";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav style={{
      background: "rgba(8,6,14,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "0 32px",
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Image
          src="/metriquill logo.png"
          alt="MetriQuill"
          width={32}
          height={32}
          style={{ borderRadius: 8, objectFit: "contain" }}
        />
        <span style={{ fontWeight: 700, fontSize: 17, color: "#FFF1E8", letterSpacing: "-0.3px", fontFamily: "var(--font-display)" }}>
          MetriQuill
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
          background: "rgba(255,107,43,0.12)",
          border: "1px solid rgba(255,107,43,0.25)",
          color: "#FF6B2B",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}>
          Free
        </span>
      </div>

      {/* CTA */}
      <a
        href="https://metriquill.com?utm_source=free-tool&utm_medium=navbar&utm_campaign=upgrade"
        className="btn-primary"
        style={{
          padding: "8px 18px",
          borderRadius: 8,
          fontSize: 13,
          textDecoration: "none",
          letterSpacing: "-0.1px",
          whiteSpace: "nowrap",
          display: "inline-block",
        }}
      >
        Get Full Access →
      </a>
    </nav>
  );
}
