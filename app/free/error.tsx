"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#080C14",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
      fontFamily: "DM Sans, sans-serif",
      color: "#f1f5f9",
      textAlign: "center",
      padding: 24,
    }}>
      <div style={{ fontSize: 48 }}>⚠️</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Something went wrong</h2>
      <p style={{ color: "#94a3b8", margin: 0, maxWidth: 400 }}>
        The report tool hit an unexpected error. This sometimes happens with certain CSV formats.
        Try refreshing or using the demo data first.
      </p>
      <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>
        Error: {error?.message || "Unknown error"}
      </p>
      <button
        onClick={reset}
        style={{
          padding: "10px 24px",
          background: "#3B82F6",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
