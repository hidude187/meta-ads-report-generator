"use client";

import { CampaignData } from "@/lib/types";
import { fmt, getCampaignBadge, metricHealth, metricTooltip, HealthSignal } from "@/lib/formatters";

interface Props { campaigns: CampaignData[]; currency: string; }

const BADGE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  TOP:    { bg: "#D1FAE5", color: "#065F46", label: "TOP" },
  REVIEW: { bg: "#FEE2E2", color: "#991B1B", label: "REVIEW" },
  WATCH:  { bg: "#FEF3C7", color: "#92400E", label: "WATCH" },
};

// Health dot component — shows colored dot with native tooltip
function HealthDot({ signal, tooltip }: { signal: HealthSignal; tooltip: string }) {
  if (signal === 'neutral') return null;
  const colors: Record<HealthSignal, string> = {
    good:    'var(--green)',
    warn:    'var(--amber)',
    poor:    'var(--red)',
    neutral: 'transparent',
  };
  return (
    <span
      title={tooltip}
      style={{
        display: 'inline-block',
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: colors[signal],
        marginLeft: 5,
        flexShrink: 0,
        cursor: 'help',
        verticalAlign: 'middle',
      }}
    />
  );
}

export default function CampaignTable({ campaigns, currency }: Props) {
  return (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)", overflow: "hidden",
    }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Campaign Performance</span>
        <span style={{
          background: "var(--blue-light)", color: "var(--blue)",
          fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20
        }}>{campaigns.length} campaigns</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)" }}>
          Hover colored dots for benchmark details
        </span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
              {["Campaign", "Spend", "Impressions", "Clicks", "CTR", "CPC", "CPM", "CPA", "Conversions", "ROAS"].map(h => (
                <th key={h} style={{
                  padding: "10px 14px", textAlign: h === "Campaign" ? "left" : "right",
                  fontWeight: 600, color: "var(--muted)", whiteSpace: "nowrap", fontSize: 12,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => {
              const badge = getCampaignBadge(c);
              const bs = badge ? BADGE_STYLES[badge] : null;
              const roasColor = c.roas >= 3 ? "var(--green)" : c.roas >= 1.5 ? "var(--amber)" : c.roas > 0 ? "var(--red)" : "var(--muted)";
              const roasBg    = c.roas >= 3 ? "var(--green-light)" : c.roas >= 1.5 ? "var(--amber-light)" : c.roas > 0 ? "var(--red-light)" : "var(--bg)";

              // Health signals per metric
              const ctrSig  = metricHealth('ctr',  c.ctr);
              const cpcSig  = metricHealth('cpc',  c.cpc);
              const cpmSig  = metricHealth('cpm',  c.cpm);
              const cpaSig  = c.cpa > 0 ? metricHealth('cpa', c.cpa) : 'neutral' as HealthSignal;

              return (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}>

                  {/* Campaign name + badge */}
                  <td style={{ padding: "12px 14px", fontWeight: 500, maxWidth: 240 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                        background: c.roas >= 3 ? "var(--green)" : c.roas >= 1.5 ? "var(--amber)" : c.roas > 0 ? "var(--red)" : "var(--muted)"
                      }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.name}
                      </span>
                      {bs && (
                        <span style={{
                          flexShrink: 0, fontSize: 10, fontWeight: 700,
                          padding: "2px 6px", borderRadius: 4,
                          background: bs.bg, color: bs.color,
                          letterSpacing: "0.05em",
                        }}>
                          {bs.label}
                        </span>
                      )}
                    </div>
                  </td>

                  <td style={{ padding: "12px 14px", textAlign: "right" }}>{fmt(c.spend, "currency", currency)}</td>
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>{fmt(c.impressions, "number")}</td>
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>{fmt(c.clicks, "number")}</td>

                  {/* CTR with health dot */}
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end" }}>
                      <span style={{ color: c.ctr >= 1.49 ? "var(--green)" : c.ctr < 0.72 ? "var(--red)" : "inherit" }}>
                        {fmt(c.ctr, "percent")}
                      </span>
                      <HealthDot signal={ctrSig} tooltip={metricTooltip('ctr', c.ctr, ctrSig)} />
                    </span>
                  </td>

                  {/* CPC with health dot */}
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end" }}>
                      {fmt(c.cpc, "currency", currency)}
                      <HealthDot signal={cpcSig} tooltip={metricTooltip('cpc', c.cpc, cpcSig)} />
                    </span>
                  </td>

                  {/* CPM with health dot */}
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end" }}>
                      {c.cpm > 0 ? fmt(c.cpm, "currency", currency) : <span style={{ color: "var(--muted)" }}>—</span>}
                      {c.cpm > 0 && <HealthDot signal={cpmSig} tooltip={metricTooltip('cpm', c.cpm, cpmSig)} />}
                    </span>
                  </td>

                  {/* CPA with health dot */}
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end" }}>
                      {c.cpa > 0
                        ? <>{fmt(c.cpa, "currency", currency)}<HealthDot signal={cpaSig} tooltip={metricTooltip('cpa', c.cpa, cpaSig)} /></>
                        : <span style={{ color: "var(--muted)" }}>—</span>
                      }
                    </span>
                  </td>

                  <td style={{ padding: "12px 14px", textAlign: "right" }}>{fmt(c.conversions, "number")}</td>

                  {/* ROAS badge */}
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                    <span style={{
                      padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                      background: roasBg, color: roasColor,
                    }}>
                      {c.roas > 0 ? fmt(c.roas, "decimal") + "x" : "—"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{
        padding: "10px 24px", borderTop: "1px solid var(--border)",
        display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center",
      }}>
        {Object.entries(BADGE_STYLES).map(([key, s]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--muted)" }}>
            <span style={{ padding: "1px 5px", borderRadius: 3, background: s.bg, color: s.color, fontWeight: 700, fontSize: 10 }}>{s.label}</span>
            <span>{ key === 'TOP' ? 'ROAS ≥3x' : key === 'REVIEW' ? 'ROAS <1.5x' : 'Freq ≥2.5x' }</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "var(--muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} /> good
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--amber)", display: "inline-block" }} /> watch
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} /> poor
          </span>
          <span style={{ color: "var(--muted)", marginLeft: 4 }}>hover dots for benchmarks</span>
        </div>
      </div>
    </div>
  );
}
