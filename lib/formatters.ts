export function fmt(val: number | undefined | null, type: 'currency' | 'number' | 'percent' | 'decimal', currency = 'USD'): string {
  const n = (val === undefined || val === null || isNaN(val as number)) ? 0 : val;
  if (type === 'currency') return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  if (type === 'percent') return n.toFixed(2) + '%';
  if (type === 'decimal') return n.toFixed(2);
  return new Intl.NumberFormat('en-US').format(Math.round(n));
}

// ── Industry benchmarks (2025–2026 cross-industry averages) ──────────────────
export const BENCHMARKS = {
  ctr:  { avg: 0.90, good: 1.49, poor: 0.72 },   // %
  cpc:  { avg: 1.72, good: 1.00, poor: 3.00 },   // USD (scale-relative)
  cpm:  { avg: 14.0, good: 8.00, poor: 25.0 },   // USD
  roas: { avg: 2.19, good: 3.00, poor: 1.50 },   // x
  cpa:  { avg: 23.1, good: 15.0, poor: 45.0 },   // USD (scale-relative)
  frequency: { warn: 2.5, danger: 4.0 },
};

// ── Per-metric health signal for table cells ─────────────────────────────────
// Returns: 'good' | 'warn' | 'poor' | 'neutral'
export type HealthSignal = 'good' | 'warn' | 'poor' | 'neutral';

export function metricHealth(key: 'ctr' | 'cpc' | 'cpm' | 'cpa' | 'roas' | 'frequency', val: number): HealthSignal {
  if (val <= 0) return 'neutral';
  switch (key) {
    case 'ctr':
      return val >= BENCHMARKS.ctr.good ? 'good' : val < BENCHMARKS.ctr.poor ? 'poor' : 'warn';
    case 'roas':
      return val >= BENCHMARKS.roas.good ? 'good' : val < BENCHMARKS.roas.poor ? 'poor' : 'warn';
    case 'cpc':
      return val <= BENCHMARKS.cpc.good ? 'good' : val > BENCHMARKS.cpc.poor ? 'poor' : 'warn';
    case 'cpm':
      return val <= BENCHMARKS.cpm.good ? 'good' : val > BENCHMARKS.cpm.poor ? 'poor' : 'warn';
    case 'cpa':
      return val <= BENCHMARKS.cpa.good ? 'good' : val > BENCHMARKS.cpa.poor ? 'poor' : 'warn';
    case 'frequency':
      return val >= BENCHMARKS.frequency.danger ? 'poor' : val >= BENCHMARKS.frequency.warn ? 'warn' : 'neutral';
    default:
      return 'neutral';
  }
}

export function metricTooltip(key: 'ctr' | 'cpc' | 'cpm' | 'cpa' | 'roas' | 'frequency', val: number, signal: HealthSignal): string {
  const benchmarks: Record<string, string> = {
    ctr: `Benchmark: good ≥1.49% · poor <0.72% · avg 0.90%`,
    cpc: `Benchmark: good ≤$1.00 · poor >$3.00 · avg $1.72`,
    cpm: `Benchmark: good ≤$8.00 · poor >$25.00 · avg $14.00`,
    cpa: `Benchmark: good ≤$15 · poor >$45 · avg $23`,
    roas: `Benchmark: good ≥3.00x · poor <1.50x · avg 2.19x`,
    frequency: `Benchmark: warn ≥2.5x · danger ≥4.0x`,
  };
  const advice: Partial<Record<typeof key, Partial<Record<HealthSignal, string>>>> = {
    ctr:  { good: 'Strong click-through — ad is resonating.', warn: 'Average — try a new hook or creative angle.', poor: 'Low CTR — audience-ad mismatch, test new creatives.' },
    cpc:  { good: 'Efficient cost per click.', warn: 'CPC is moderate — monitor.', poor: 'High CPC — broaden audience or refresh creative.' },
    cpm:  { good: 'Low cost per 1000 impressions.', warn: 'CPM is elevated — check audience size.', poor: 'High CPM — audience too narrow or heavy competition.' },
    cpa:  { good: 'Efficient cost per acquisition.', warn: 'CPA is moderate — room to improve.', poor: 'High CPA — review landing page and offer.' },
    frequency: { warn: 'Early fatigue — prepare fresh creatives.', poor: "Don't pause — refresh creative instead to avoid algorithm reset." },
  };
  const tip = advice[key]?.[signal];
  return `${benchmarks[key]}${tip ? '\n→ ' + tip : ''}`;
}

// Detect campaign type from name keywords
function detectCampaignType(name: string): 'retargeting' | 'awareness' | 'lead' | 'traffic' | 'conversion' | 'unknown' {
  const n = name.toLowerCase();
  if (n.includes('retarget') || n.includes('remarketing') || n.includes('warm') || n.includes('dpa') || n.includes('catalog')) return 'retargeting';
  if (n.includes('awareness') || n.includes('brand') || n.includes('video view') || n.includes('reach')) return 'awareness';
  if (n.includes('lead') || n.includes('form')) return 'lead';
  if (n.includes('traffic') || n.includes('click')) return 'traffic';
  if (n.includes('conversion') || n.includes('purchase') || n.includes('sale') || n.includes('lookalike') || n.includes('cold')) return 'conversion';
  return 'unknown';
}

// Get campaign health badge
export function getCampaignBadge(c: import('./types').CampaignData): 'TOP' | 'REVIEW' | 'WATCH' | null {
  const type = detectCampaignType(c.name);
  if (type === 'awareness') return null;
  if (c.roas >= 4 || (c.roas >= 3 && c.ctr >= 1.2)) return 'TOP';
  if ((c.roas > 0 && c.roas < 1.5) || (c.ctr < 0.5 && c.spend > 500)) return 'REVIEW';
  if ((c.frequency ?? 0) >= BENCHMARKS.frequency.warn) return 'WATCH';
  return null;
}

export function generateInsights(campaigns: import('./types').CampaignData[], currency: string): string[] {
  const insights: string[] = [];
  if (!campaigns.length) return insights;

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  const roasCampaigns = campaigns.filter(c => c.roas > 0);
  const sorted = [...roasCampaigns].sort((a, b) => b.roas - a.roas);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  // 1. Scale winner
  if (best && best.roas >= 3) {
    const spendPct = totalSpend > 0 ? ((best.spend / totalSpend) * 100).toFixed(0) : '0';
    insights.push(
      `🚀 Scale "${best.name}" — ${best.roas.toFixed(1)}x ROAS is your top performer (${spendPct}% of spend). ` +
      `Increase budget 20–30% to capture more volume without disrupting the algorithm.`
    );
  }

  // 2. Pause / review loser
  if (worst && worst.roas < 1.5 && worst.spend > totalSpend * 0.08) {
    const type = detectCampaignType(worst.name);
    const note = type === 'retargeting'
      ? 'Audience may be exhausted — try a fresh creative or expand the custom audience.'
      : 'Pause or restructure creative and targeting.';
    insights.push(
      `⛔ Review "${worst.name}" — ${worst.roas.toFixed(1)}x ROAS is below break-even. ${note}`
    );
  }

  // 3. CTR vs Conversion diagnostic
  const highCTRLowConv = campaigns.filter(c => c.ctr >= 1.2 && c.conversions === 0 && c.clicks > 50);
  if (highCTRLowConv.length) {
    const names = highCTRLowConv.map(c => `"${c.name}"`).join(', ');
    insights.push(
      `⚠️ ${names} ${highCTRLowConv.length > 1 ? 'have' : 'has'} strong CTR but zero conversions — ` +
      `the ad is getting clicks but the landing page or offer isn't converting. Check page load speed, form errors, and offer clarity.`
    );
  }

  // 4. Frequency / ad fatigue
  const fatigueCampaigns = campaigns.filter(c => (c.frequency ?? 0) >= BENCHMARKS.frequency.warn);
  const dangerCampaigns  = campaigns.filter(c => (c.frequency ?? 0) >= BENCHMARKS.frequency.danger);
  if (dangerCampaigns.length) {
    insights.push(
      `🔁 Ad fatigue — ${dangerCampaigns.map(c => `"${c.name}" (${(c.frequency??0).toFixed(1)}x)`).join(', ')} ` +
      `exceeded frequency 4.0. Audiences are oversaturated. Pause and rotate creatives immediately.`
    );
  } else if (fatigueCampaigns.length) {
    insights.push(
      `🔁 Frequency warning on ${fatigueCampaigns.map(c => `"${c.name}"`).join(', ')} — ` +
      `frequency above 2.5 signals early fatigue. Start preparing fresh creatives now.`
    );
  }

  // 5. Budget concentration risk
  const topSpender = [...campaigns].sort((a, b) => b.spend - a.spend)[0];
  if (topSpender && totalSpend > 0) {
    const pct = (topSpender.spend / totalSpend) * 100;
    if (pct > 60) {
      const roasNote = topSpender.roas >= 2.5
        ? `with strong ${topSpender.roas.toFixed(1)}x ROAS — justified, but consider diversifying.`
        : `but ROAS is only ${topSpender.roas > 0 ? topSpender.roas.toFixed(1)+'x' : 'unmeasured'} — high concentration risk.`;
      insights.push(`💰 "${topSpender.name}" absorbs ${pct.toFixed(0)}% of total spend ${roasNote}`);
    }
  }

  // 6. CPA efficiency
  if (totalConversions > 0) {
    const avgCPA = totalSpend / totalConversions;
    const bestCPA = [...campaigns.filter(c => c.conversions > 0)].sort((a, b) => a.cpa - b.cpa)[0];
    if (bestCPA && avgCPA > 0) {
      const saving = avgCPA - bestCPA.cpa;
      if (saving > avgCPA * 0.3) {
        insights.push(
          `📉 "${bestCPA.name}" has your lowest CPA at ${fmt(bestCPA.cpa,'currency',currency)} ` +
          `vs. account average of ${fmt(avgCPA,'currency',currency)}. ` +
          `Shifting budget toward this campaign could reduce cost per acquisition by ${fmt(saving,'currency',currency)}.`
        );
      }
    }
  }

  // 7. Low CTR warning (non-awareness)
  const lowCTR = campaigns.filter(c => {
    const type = detectCampaignType(c.name);
    return type !== 'awareness' && c.ctr < BENCHMARKS.ctr.poor && c.spend > 200;
  });
  if (lowCTR.length && insights.length < 5) {
    insights.push(
      `📊 ${lowCTR.map(c => `"${c.name}"`).join(', ')} ${lowCTR.length > 1 ? 'have' : 'has'} CTR below 0.72% ` +
      `(industry average: 0.90%). Audience-ad mismatch — test new creative angles or tighten targeting.`
    );
  }

  // ── DON'T REACT warnings (from PrePilot BlackBox method) ─────────────────

  // 8. Frequency danger zone — don't pause, refresh creative
  const freqDanger = campaigns.filter(c => (c.frequency ?? 0) >= 4.5);
  if (freqDanger.length) {
    insights.push(
      `🛑 Don't pause ${freqDanger.map(c => `"${c.name}"`).join(', ')} yet — frequency above 4.5 feels alarming ` +
      `but pausing resets the algorithm's learning phase. Instead: refresh the creative with a new angle, keep the same targeting and budget. ` +
      `Pausing now could cost 5–7 days of re-learning when you reactivate.`
    );
  }

  // 9. High CPM with low spend — too early to judge
  const highCPMEarly = campaigns.filter(c =>
    c.cpm > BENCHMARKS.cpm.poor && c.spend < 150 && c.impressions < 10000
  );
  if (highCPMEarly.length && insights.length < 7) {
    insights.push(
      `⏳ ${highCPMEarly.map(c => `"${c.name}"`).join(', ')} ${highCPMEarly.length > 1 ? 'show' : 'shows'} high CPM ` +
      `but with limited spend — CPM fluctuates heavily in the first 48–72 hours as the algorithm tests audiences. ` +
      `Wait until each campaign has at least $150 spend before making CPM-based decisions.`
    );
  }

  // 10. Low conversion count — statistically unreliable ROAS
  const singleDayRisk = campaigns.filter(c =>
    c.roas > 0 && c.roas < 1.8 && c.roas >= 1.2 && c.conversions > 0 && c.conversions < 5 && c.spend < 300
  );
  if (singleDayRisk.length && insights.length < 7) {
    insights.push(
      `⚠️ Don't make structural changes to ${singleDayRisk.map(c => `"${c.name}"`).join(', ')} based on this data. ` +
      `Under 5 conversions means the ROAS reading is statistically unreliable — one conversion difference can swing ROAS by 30–50%. ` +
      `Wait for at least 10 conversions before pausing, scaling, or changing creative.`
    );
  }

  return insights.slice(0, 8);
}

// Generate recommendations for the PDF recommendations page
export function generateRecommendations(campaigns: import('./types').CampaignData[], currency: string): string[] {
  const recs: string[] = [];
  const roasCampaigns = campaigns.filter(c => c.roas > 0);
  const sorted = [...roasCampaigns].sort((a, b) => b.roas - a.roas);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  if (best && best.roas >= 3)
    recs.push(`Increase budget on "${best.name}" by 20–30% — it is your most efficient campaign at ${best.roas.toFixed(1)}x ROAS.`);
  if (worst && worst.roas < 1.5)
    recs.push(`Pause or rebuild "${worst.name}" — ROAS of ${worst.roas.toFixed(1)}x is unprofitable. Test a new creative direction before reactivating.`);

  const fatigued = campaigns.filter(c => (c.frequency ?? 0) >= BENCHMARKS.frequency.warn);
  if (fatigued.length)
    recs.push(`Refresh creatives on ${fatigued.map(c=>`"${c.name}"`).join(', ')} — frequency above 2.5 means your audience has seen these ads too many times.`);

  const noConv = campaigns.filter(c => c.ctr >= 1.0 && c.conversions === 0 && c.clicks > 30);
  if (noConv.length)
    recs.push(`Audit landing pages for ${noConv.map(c=>`"${c.name}"`).join(', ')} — strong click-through rates with zero conversions indicate post-click friction.`);

  const highCPC = campaigns.filter(c => c.cpc > 20 && detectCampaignType(c.name) !== 'awareness');
  if (highCPC.length && recs.length < 5)
    recs.push(`CPC on ${highCPC.map(c=>`"${c.name}"`).join(', ')} is above ${fmt(highCPC[0].cpc,'currency',currency)} — broaden targeting or test new creatives to improve relevance score.`);

  if (recs.length < 3)
    recs.push(`Maintain current pacing and review performance again in 7–10 days before making structural changes.`);

  return recs.slice(0, 5);
}
