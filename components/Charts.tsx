"use client";

import { Bar, Doughnut, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, PointElement, Tooltip, Legend, Title
} from "chart.js";
import { CampaignData } from "@/lib/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, Tooltip, Legend, Title);

interface Props { campaigns: CampaignData[]; currency: string; brandColor: string; }

const COLORS = ["#2563EB","#7C3AED","#059669","#D97706","#DC2626","#0891B2","#9333EA","#16A34A"];

export default function Charts({ campaigns, currency, brandColor }: Props) {
  const labels = campaigns.map(c => c.name.length > 22 ? c.name.slice(0, 22) + "…" : c.name);

  const barData = {
    labels,
    datasets: [{
      label: "Spend",
      data: campaigns.map(c => c.spend),
      backgroundColor: brandColor + "CC",
      borderColor: brandColor,
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const donutData = {
    labels,
    datasets: [{
      data: campaigns.map(c => c.spend),
      backgroundColor: COLORS.slice(0, campaigns.length),
      borderWidth: 2,
      borderColor: "#FFFFFF",
    }],
  };

  const bubbleData = {
    datasets: campaigns.map((c, i) => ({
      label: c.name.length > 18 ? c.name.slice(0, 18) + "…" : c.name,
      data: [{ x: c.ctr, y: c.roas, r: Math.max(6, Math.sqrt(c.spend / 800)) }],
      backgroundColor: COLORS[i % COLORS.length] + "99",
      borderColor: COLORS[i % COLORS.length],
    })),
  };

  const chartCard = (title: string, children: React.ReactNode) => (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)", padding: 20,
    }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: "var(--muted)" }}>{title}</div>
      {children}
    </div>
  );

  const LABEL_COLOR = "#8B93A8";
  const GRID_COLOR  = "rgba(0,0,0,0.06)";

  const opts = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: { color: LABEL_COLOR, font: { size: 11 } },
      },
    },
    scales: {
      x: {
        ticks: { color: LABEL_COLOR, font: { size: 11 } },
        grid:  { color: GRID_COLOR },
      },
      y: {
        ticks: { color: LABEL_COLOR, font: { size: 11 } },
        grid:  { color: GRID_COLOR },
      },
    },
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ gridColumn: "1 / -1" }}>
        {chartCard("Spend by Campaign", <Bar data={barData} options={opts} height={90} />)}
      </div>
      {chartCard("Budget Distribution",
        <div style={{ maxWidth: 280, margin: "0 auto" }}>
          <Doughnut data={donutData} options={{ responsive: true, plugins: { legend: { position: "bottom", labels: { color: LABEL_COLOR, font: { size: 11 } } } } }} />
        </div>
      )}
      {chartCard("CTR vs ROAS Matrix (bubble = spend)",
        <Bubble data={bubbleData} options={{
          responsive: true,
          plugins: { legend: { position: "bottom", labels: { color: LABEL_COLOR, font: { size: 11 } } } },
          scales: {
            x: { title: { display: true, text: "CTR (%)", color: LABEL_COLOR }, ticks: { color: LABEL_COLOR }, grid: { color: GRID_COLOR } },
            y: { title: { display: true, text: "ROAS (x)", color: LABEL_COLOR }, ticks: { color: LABEL_COLOR }, grid: { color: GRID_COLOR } },
          },
        }} />
      )}
    </div>
  );
}
