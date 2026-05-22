"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import Navbar from "./Navbar";
import ProBanner from "./ProBanner";
import ClientInfoForm from "./ClientInfoForm";
import CSVUploader from "./CSVUploader";
import ReportDashboard from "./ReportDashboard";
import { parseCSV, generateDemoData } from "@/lib/csvParser";
import { CampaignData, ClientInfo } from "@/lib/types";

export default function ReportTool() {
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    clientName: "",
    agencyName: "",
    dateFrom: "",
    dateTo: "",
    currency: "USD",
    brandColor: "#FF6B2B",
    logoDataUrl: "",
  });

  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [fileName, setFileName] = useState("");
  const [infoFilled, setInfoFilled] = useState(false);
  const [csvLoaded, setCsvLoaded] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    // Security: enforce file type and size limits
    if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
      alert("Please upload a .csv file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert("File is too large. Please upload a CSV under 20MB.");
      return;
    }
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data as Record<string, string>[];
          if (rows.length > 2000) {
            alert(`Your CSV has ${rows.length} rows. Only the first 2,000 campaigns will be loaded.`);
          }
          const parsed = parseCSV(rows.slice(0, 2000));
          if (!parsed.length) {
            alert("No valid campaign rows found. Make sure your CSV has spend or impressions data.");
            return;
          }
          setCampaigns(parsed);
          setCsvLoaded(true);
        } catch (err) {
          console.error("CSV parse error:", err);
          alert("Failed to parse CSV. Please check the file format and try again.");
        }
      },
    });
  }, []);

  const handleDemo = useCallback(() => {
    setCampaigns(generateDemoData());
    setFileName("demo-data.csv");
    setCsvLoaded(true);
  }, []);

  const handleLogoUpload = useCallback((dataUrl: string) => {
    setClientInfo((prev) => ({ ...prev, logoDataUrl: dataUrl }));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <ProBanner />
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
          Generate Client Report
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 32 }}>
          Upload your Meta Ads CSV export → get a beautiful, branded PDF report in seconds.{" "}
          <strong>No login. No subscription. Free forever.</strong>
        </p>

        <div style={{ display: "grid", gap: 20 }}>
          <ClientInfoForm
            info={clientInfo}
            onChange={(info) => { setClientInfo(info); setInfoFilled(!!(info.clientName && info.dateFrom && info.dateTo)); }}
            onLogoUpload={handleLogoUpload}
            stepDone={infoFilled}
          />
          <CSVUploader
            onFile={handleFileUpload}
            onDemo={handleDemo}
            fileName={fileName}
            stepDone={csvLoaded}
            currency={clientInfo.currency}
          />
          {campaigns.length > 0 && (
            <ReportDashboard
              campaigns={campaigns}
              clientInfo={clientInfo}
            />
          )}
        </div>
      </main>
    </div>
  );
}
