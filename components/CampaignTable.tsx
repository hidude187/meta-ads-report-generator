"use client";

import { CampaignData } from "@/lib/types";
import { fmt } from "@/lib/formatters";

interface Props {
  campaigns: CampaignData[];
  currency: string;
}

export default function CampaignTable({ campaigns, currency }: Props) {
  return (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)", overflow: "hidden",
    }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Campaign Performance</span>
        <span style={{
          marginLeft: 10, background: "var(--blue-light)", color: "var(--blue)",
          fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20
        }}>{campaigns.length} campaigns</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
              {["Campaign", "Spend", "Impressions", "Clicks", "CTR", "CPC", "Conversions", "ROAS"].map(h => (
                <th key={h} style={{
                  padding: "10px 16px", textAlign: h === "Campaign" ? "left" : "right",
                  fontWeight: 600, color: "var(--muted)", whiteSpace: "nowrap"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                onMouseLeave={e => (e.currentTarget.style.background = "")}>
                <td style={{ padding: "12px 16px", fontWeight: 500, maxWidth: 220 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                      background: c.roas >= 3 ? "var(--green)" : c.roas >= 1.5 ? "var(--amber)" : "var(--red)"
                    }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.name}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>{fmt(c.spend, "currency", currency)}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>{fmt(c.impressions, "number")}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>{fmt(c.clicks, "number")}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>{fmt(c.ctr, "percent")}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>{fmt(c.cpc, "currency", currency)}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>{fmt(c.conversions, "number")}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <span style={{
                    padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                    background: c.roas >= 3 ? "var(--green-light)" : c.roas >= 1.5 ? "var(--amber-light)" : "var(--red-light)",
                    color: c.roas >= 3 ? "var(--green)" : c.roas >= 1.5 ? "var(--amber)" : "var(--red)",
                  }}>
                    {c.roas > 0 ? fmt(c.roas, "decimal") + "x" : "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
