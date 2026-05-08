"use client";

import { useRef, useState } from "react";

interface Props {
  onFile: (file: File) => void;
  onDemo: () => void;
  fileName: string;
  stepDone: boolean;
}

export default function CSVUploader({ onFile, onDemo, fileName, stepDone }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith(".csv")) onFile(file);
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
          justifyContent: "center", fontSize: 13, fontWeight: 700
        }}>2</div>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Upload Ads Data</span>
      </div>

      <div style={{ padding: 24 }}>
        <input ref={inputRef} type="file" accept=".csv" style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />

        <div
          className={`dropzone${drag ? " drag" : ""}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>📂</div>
          {fileName ? (
            <p style={{ fontWeight: 600, color: "var(--green)" }}>✓ {fileName}</p>
          ) : (
            <>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>Drop your CSV here or click to browse</p>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>
                Export from Meta Ads Manager → Campaigns → Export Table Data → CSV
              </p>
            </>
          )}
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 12, margin: "16px 0"
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--muted)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <button onClick={onDemo} style={{
          width: "100%", padding: "11px", border: "1px solid var(--border)",
          borderRadius: 8, background: "var(--bg)", cursor: "pointer",
          fontSize: 14, fontWeight: 500, color: "var(--text)",
        }}>
          🎯 Load Demo Data (5 campaigns, DZD)
        </button>
      </div>
    </div>
  );
}
