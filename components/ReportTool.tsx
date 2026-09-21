"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import Navbar from "./Navbar";
import ProBanner from "./ProBanner";
import Footer from "./Footer";
import ClientInfoForm from "./ClientInfoForm";
import CSVUploader from "./CSVUploader";
import ReportDashboard from "./ReportDashboard";
import { parseCSV, extractCSVDates, parseGoogleAdsCSV, extractGoogleAdsDates, generateDemoData } from "@/lib/csvParser";
import { AdPlatform, CampaignData, ClientInfo } from "@/lib/types";

function StepArrow({ done }: { done?: boolean }) {
  const color = done ? "var(--green, #22c55e)" : "var(--border)";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 0" }}>
      <div style={{ width: 1, height: 14, background: color }} />
      <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L6 6L11 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

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
  const [platform, setPlatform] = useState<AdPlatform>("meta");

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
    // Google Ads exports can have title/date lines above the header row, so they are
    // read without headers and parseGoogleAdsCSV locates the header itself.
    const isGoogle = platform === "google";
    Papa.parse<Record<string, string> | string[]>(file, {
      header: !isGoogle,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          let parsed: CampaignData[];
          let dates: { dateFrom: string; dateTo: string };
          if (isGoogle) {
            const table = results.data as string[][];
            parsed = parseGoogleAdsCSV(table);
            dates = extractGoogleAdsDates(table);
            if (parsed.length > 2000) {
              alert(`Your CSV has ${parsed.length} campaigns. Only the first 2,000 campaigns will be loaded.`);
              parsed = parsed.slice(0, 2000);
            }
          } else {
            const rows = results.data as Record<string, string>[];
            if (rows.length > 2000) {
              alert(`Your CSV has ${rows.length} rows. Only the first 2,000 campaigns will be loaded.`);
            }
            parsed = parseCSV(rows.slice(0, 2000));
            dates = extractCSVDates(rows);
          }
          if (!parsed.length) {
            alert(isGoogle
              ? "No valid campaign rows found. Make sure you exported the Campaigns table from Google Ads as .csv with the Campaign, Cost and Impr. columns."
              : "No valid campaign rows found. Make sure your CSV has spend or impressions data.");
            return;
          }
          // Auto-fill dates from CSV if fields are currently empty
          const { dateFrom, dateTo } = dates;
          setClientInfo(prev => ({
            ...prev,
            dateFrom: prev.dateFrom || dateFrom,
            dateTo:   prev.dateTo   || dateTo,
          }));
          setCampaigns(parsed);
          setCsvLoaded(true);
        } catch (err) {
          console.error("CSV parse error:", err);
          alert("Failed to parse CSV. Please check the file format and try again.");
        }
      },
    });
  }, [platform]);

  const handleDemo = useCallback(() => {
    setCampaigns(generateDemoData());
    setFileName("demo-data.csv");
    setCsvLoaded(true);
  }, []);

  const handleLogoUpload = useCallback((dataUrl: string) => {
    setClientInfo((prev) => ({ ...prev, logoDataUrl: dataUrl }));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <ProBanner />
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px", width: "100%", flex: 1 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
          Generate Client Report
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 32 }}>
          Upload your Meta Ads CSV export → get a beautiful, branded PDF report in seconds.{" "}
          <strong>No login. No subscription. Free forever.</strong>
        </p>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <ClientInfoForm
            info={clientInfo}
            onChange={(info) => { setClientInfo(info); setInfoFilled(!!(info.clientName && info.dateFrom && info.dateTo)); }}
            onLogoUpload={handleLogoUpload}
            stepDone={infoFilled}
          />
          <StepArrow />
          <CSVUploader
            onFile={handleFileUpload}
            onDemo={handleDemo}
            fileName={fileName}
            stepDone={csvLoaded}
            currency={clientInfo.currency}
            platform={platform}
            onPlatformChange={setPlatform}
          />
          {campaigns.length > 0 && (
            <>
              <StepArrow done />
              <ReportDashboard
                campaigns={campaigns}
                clientInfo={clientInfo}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
