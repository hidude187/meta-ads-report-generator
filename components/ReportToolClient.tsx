"use client";

import dynamic from "next/dynamic";

const ReportTool = dynamic(() => import("@/components/ReportTool"), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: "100vh",
      background: "#F4F6F9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#9BA3AF",
      fontFamily: "DM Sans, sans-serif",
      fontSize: 16,
    }}>
      Loading MetriQuill…
    </div>
  ),
});

export default function ReportToolClient() {
  return <ReportTool />;
}
