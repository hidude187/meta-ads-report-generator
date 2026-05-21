"use client";

import { useRef, useState } from "react";

interface Props {
  onFile: (file: File) => void;
  onDemo: () => void;
  fileName: string;
  stepDone: boolean;
}

const REQUIRED_COLUMNS = [
  "Amount spent",
  "Impressions",
  "Reach",
  "Link clicks",
  "CTR (link click-through rate)",
  "CPC (cost per link click)",
  "CPM (cost per 1,000 impressions)",
  "Results",
  "Purchase ROAS (return on ad spend)",
];

export default function CSVUploader({ onFile, onDemo, fileName, stepDone }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

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
        }}>{stepDone ? "✓" : "2"}</div>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Upload Ads Data</span>
        <button
          onClick={() => setGuideOpen(o => !o)}
          style={{
            marginLeft: "auto", fontSize: 12, fontWeight: 600,
            color: "var(--blue)", background: "var(--blue-light)",
            border: "none", borderRadius: 6, padding: "4px 10px",
            cursor: "pointer",
          }}
        >
          {guideOpen ? "Hide guide ▲" : "How to export from Meta ▼"}
        </button>
      </div>

      {guideOpen && (
        <div style={{
          padding: "16px 24px", borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
        }}>
          <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: "var(--text)" }}>
            📋 How to export the right CSV from Meta Ads Manager
          </p>

          {/* Steps */}
          {[
            { n: "1", text: 'Go to Meta Ads Manager and click the "Campaigns" tab at the top.' },
            { n: "2", text: 'Click "Columns" (top right of the table) → "Customize Columns".' },
            { n: "3", text: "Make sure these columns are selected:" },
            { n: "4", text: 'Click "Apply", then click "Export" (top right) → "Export Table Data" → "CSV".' },
          ].map(({ n, text }) => (
            <div key={n} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: "var(--blue)", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
              }}>{n}</div>
              <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{text}</span>
            </div>
          ))}

          {/* Required columns list */}
          <div style={{
            marginLeft: 34, marginBottom: 14,
            display: "flex", flexWrap: "wrap", gap: 6,
          }}>
            {REQUIRED_COLUMNS.map(col => (
              <span key={col} style={{
                fontSize: 11, fontWeight: 600, padding: "3px 8px",
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 5, color: "var(--text)", fontFamily: "monospace",
              }}>{col}</span>
            ))}
          </div>

          {/* Warning */}
          <div style={{
            marginLeft: 34, padding: "10px 14px",
            background: "var(--amber-light)", borderRadius: 8,
            borderLeft: "3px solid var(--amber)",
          }}>
            <p style={{ fontSize: 12, color: "var(--amber)", fontWeight: 700, marginBottom: 4 }}>
              ⚠️ Common mistake — getting all zeros?
            </p>
            <p style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.6, margin: 0 }}>
              If Spend, Clicks, and CTR all show as 0, your export is missing the cost columns.
              This happens when you export "Post Engagement" or "Reach" campaigns without
              customizing the columns first. Follow the steps above and re-export.
            </p>
          </div>
        </div>
      )}

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
                Export from Meta Ads Manager → Campaigns → Customize Columns → Export CSV
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
