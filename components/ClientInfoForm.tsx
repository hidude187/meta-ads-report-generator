"use client";

import { ClientInfo } from "@/lib/types";
import { useRef } from "react";

interface Props {
  info: ClientInfo;
  onChange: (info: ClientInfo) => void;
  onLogoUpload: (dataUrl: string) => void;
  stepDone: boolean;
}

const CURRENCIES = ["USD", "EUR", "GBP", "AED", "SAR", "MAD", "DZD", "TND", "EGP", "TRY"];

export default function ClientInfoForm({ info, onChange, onLogoUpload, stepDone }: Props) {
  const logoRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof ClientInfo, value: string) =>
    onChange({ ...info, [key]: value });

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo image must be under 2MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onLogoUpload(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)", overflow: "hidden"
    }}>
      <div style={{
        padding: "16px 24px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 12
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: stepDone ? "var(--green)" : "var(--blue)",
          color: "white", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0
        }}>
          {stepDone ? "✓" : "1"}
        </div>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Client & Report Info</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>All fields optional</span>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Client Name</span>
            <input
              value={info.clientName}
              onChange={e => set("clientName", e.target.value)}
              placeholder="Acme Corp"
              style={inputStyle}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Agency Name</span>
            <input
              value={info.agencyName}
              onChange={e => set("agencyName", e.target.value)}
              placeholder="Your Agency"
              style={inputStyle}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Date From</span>
            <input type="date" value={info.dateFrom}
              onChange={e => set("dateFrom", e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Date To</span>
            <input type="date" value={info.dateTo}
              onChange={e => set("dateTo", e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Currency</span>
            <select value={info.currency} onChange={e => set("currency", e.target.value)} style={inputStyle}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Brand Color</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={info.brandColor}
                onChange={e => set("brandColor", e.target.value)}
                style={{ width: 44, height: 38, border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", padding: 2 }} />
              <input value={info.brandColor} onChange={e => set("brandColor", e.target.value)}
                style={{ ...inputStyle, flex: 1 }} placeholder="#2563EB" />
            </div>
          </label>
        </div>

        {/* Logo upload */}
        <div style={{ marginTop: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", display: "block", marginBottom: 6 }}>
            Agency Logo <span style={{ fontWeight: 400 }}>(appears on PDF cover & PNG)</span>
          </span>
          <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogo} />
          <button onClick={() => logoRef.current?.click()} style={{
            border: "1px dashed var(--border)", background: "var(--bg)",
            borderRadius: 8, padding: "10px 20px", cursor: "pointer",
            fontSize: 13, color: "var(--muted)", display: "flex", alignItems: "center", gap: 8
          }}>
            {info.logoDataUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <><img src={info.logoDataUrl} alt="logo" style={{ height: 24, objectFit: "contain" }} /> Change Logo</>
              : "📎 Upload Logo"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "9px 12px",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 14,
  outline: "none",
  width: "100%",
  background: "var(--surface2)",
  color: "var(--text)",
  colorScheme: "dark",
};
