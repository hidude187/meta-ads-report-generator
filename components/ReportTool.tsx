"use client";

import { useState, useRef, useCallback } from "react";
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
    brandColor: "#2563EB",
    logoDataUrl: "",
  });

  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [fileName, setFileName] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);

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
        const rows = results.data as Record<string, string>[];
        if (rows.length > 2000) {
          alert(`Your CSV has ${rows.length} rows. Only the first 2,000 campaigns will be loaded.`);
        }
        const parsed = parseCSV(rows.slice(0, 2000));
        setCampaigns(parsed);
        setStep(3);
      },
    });
  }, []);

  const handleDemo = useCallback(() => {
    setCampaigns(generateDemoData());
    setFileName("demo-data.csv");
    setStep(3);
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
            onChange={setClientInfo}
            onLogoUpload={handleLogoUpload}
            stepDone={step >= 2}
          />
          <CSVUploader
            onFile={handleFileUpload}
            onDemo={handleDemo}
            fileName={fileName}
            stepDone={step >= 3}
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
