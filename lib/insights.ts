import { CampaignData } from "./types";
import { fmt } from "./formatters";
import { BENCHMARKS, detectCampaignType } from "./benchmarks";

export function generateInsights(campaigns: CampaignData[], currency: string): string[] {
  const insights: string[] = [];
  if (!campaigns.length) return insights;

  // Strip Arabic, emojis, and other non-jsPDF-renderable chars; fall back to "this campaign"
  const cap = (name: string, max = 40) => {
    const safe = name
      .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '') // Arabic
      .replace(/[\u200E\u200F\u202A-\u202E]/g, '')  // RTL/LTR marks
      .replace(/[\u{1F000}-\u{1FFFF}]|[\u2600-\u27FF]/gu, '') // emoji
      .replace(/[^\x20-\x7E\u00C0-\u024F]/g, '') // keep ASCII + Latin Extended only
      .replace(/\s{2,}/g, ' ')
      .trim();
    if (!safe || safe.length < 2) return 'this campaign';
    return safe.length > max ? safe.slice(0, max - 1) + '...' : safe;
  };

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  const roasCampaigns = campaigns.filter(c => c.roas > 0);
  const sorted = [...roasCampaigns].sort((a, b) => b.roas - a.roas);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  if (best && best.roas >= 3) {
    const spendPct = totalSpend > 0 ? ((best.spend / totalSpend) * 100).toFixed(0) : '0';
    insights.push(`[SCALE] Scale "${cap(best.name)}" — ${best.roas.toFixed(1)}x ROAS is your top performer (${spendPct}% of spend). Increase budget 20–30% to capture more volume without disrupting the algorithm.`);
  }

  if (worst && worst.roas < 1.5 && worst.spend > totalSpend * 0.08) {
    const type = detectCampaignType(worst.name);
    const note = type === 'retargeting'
      ? 'Audience may be exhausted — try a fresh creative or expand the custom audience.'
      : 'Pause or restructure creative and targeting.';
    insights.push(`[REVIEW] Review "${cap(worst.name)}" — ${worst.roas.toFixed(1)}x ROAS is below break-even. ${note}`);
  }

  const highCTRLowConv = campaigns.filter(c => c.ctr >= 1.2 && c.conversions === 0 && c.clicks > 50);
  if (highCTRLowConv.length) {
    const names = highCTRLowConv.map(c => `"${cap(c.name)}"`).join(', ');
    insights.push(`[WARN] ${names} ${highCTRLowConv.length > 1 ? 'have' : 'has'} strong CTR but zero conversions — the ad is getting clicks but the landing page or offer isn't converting. Check page load speed, form errors, and offer clarity.`);
  }

  const fatigueCampaigns = campaigns.filter(c => (c.frequency ?? 0) >= BENCHMARKS.frequency.warn);
  const dangerCampaigns  = campaigns.filter(c => (c.frequency ?? 0) >= BENCHMARKS.frequency.danger);
  if (dangerCampaigns.length) {
    insights.push(`[FATIGUE] Ad fatigue — ${dangerCampaigns.map(c => `"${cap(c.name)}" (${(c.frequency??0).toFixed(1)}x)`).join(', ')} exceeded frequency 4.0. Audiences are oversaturated. Pause and rotate creatives immediately.`);
  } else if (fatigueCampaigns.length) {
    insights.push(`[FATIGUE] Frequency warning on ${fatigueCampaigns.map(c => `"${cap(c.name)}"`).join(', ')} — frequency above 2.5 signals early fatigue. Start preparing fresh creatives now.`);
  }

  const topSpender = [...campaigns].sort((a, b) => b.spend - a.spend)[0];
  if (topSpender && totalSpend > 0) {
    const pct = (topSpender.spend / totalSpend) * 100;
    if (pct > 60) {
      const roasNote = topSpender.roas >= 2.5
        ? `with strong ${topSpender.roas.toFixed(1)}x ROAS — justified, but consider diversifying.`
        : `but ROAS is only ${topSpender.roas > 0 ? topSpender.roas.toFixed(1)+'x' : 'unmeasured'} — high concentration risk.`;
      insights.push(`[BUDGET] "${cap(topSpender.name)}" absorbs ${pct.toFixed(0)}% of total spend ${roasNote}`);
    }
  }

  if (totalConversions > 0) {
    const avgCPA = totalSpend / totalConversions;
    const bestCPA = [...campaigns.filter(c => c.conversions > 0)].sort((a, b) => a.cpa - b.cpa)[0];
    if (bestCPA && avgCPA > 0) {
      const saving = avgCPA - bestCPA.cpa;
      if (saving > avgCPA * 0.3) {
        insights.push(`[SAVINGS] "${cap(bestCPA.name)}" has your lowest CPA at ${fmt(bestCPA.cpa,'currency',currency)} vs. account average of ${fmt(avgCPA,'currency',currency)}. Shifting budget toward this campaign could reduce cost per acquisition by ${fmt(saving,'currency',currency)}.`);
      }
    }
  }

  const lowCTR = campaigns.filter(c => {
    const type = detectCampaignType(c.name);
    return type !== 'awareness' && c.ctr > 0 && c.ctr < BENCHMARKS.ctr.poor && c.spend > 200;
  });
  if (lowCTR.length && insights.length < 5) {
    insights.push(`[CTR] ${lowCTR.map(c => `"${cap(c.name)}"`).join(', ')} ${lowCTR.length > 1 ? 'have' : 'has'} CTR below 0.72% (industry average: 0.90%). Audience-ad mismatch — test new creative angles or tighten targeting.`);
  }

  const freqDanger = campaigns.filter(c => (c.frequency ?? 0) >= 4.5);
  if (freqDanger.length) {
    insights.push(`[NOREACT] Don't pause ${freqDanger.map(c => `"${cap(c.name)}"`).join(', ')} yet — frequency above 4.5 feels alarming but pausing resets the algorithm's learning phase. Instead: refresh the creative with a new angle, keep the same targeting and budget.`);
  }

  const highCPMEarly = campaigns.filter(c => c.cpm > BENCHMARKS.cpm.poor && c.spend < 150 && c.impressions < 10000);
  if (highCPMEarly.length && insights.length < 7) {
    insights.push(`[EARLY] ${highCPMEarly.map(c => `"${cap(c.name)}"`).join(', ')} ${highCPMEarly.length > 1 ? 'show' : 'shows'} high CPM but with limited spend — CPM fluctuates heavily in the first 48–72 hours. Wait until each campaign has at least $150 spend before making CPM-based decisions.`);
  }

  const singleDayRisk = campaigns.filter(c => c.roas > 0 && c.roas < 1.8 && c.roas >= 1.2 && c.conversions > 0 && c.conversions < 5 && c.spend < 300);
  if (singleDayRisk.length && insights.length < 7) {
    insights.push(`[WARN] Don't make structural changes to ${singleDayRisk.map(c => `"${cap(c.name)}"`).join(', ')} based on this data. Under 5 conversions means the ROAS reading is statistically unreliable — wait for at least 10 conversions before pausing, scaling, or changing creative.`);
  }

  return insights.slice(0, 8);
}

export function generateRecommendations(campaigns: CampaignData[], currency: string): string[] {
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
    recs.push(`Refresh creatives on ${fatigued.map(c => `"${c.name}"`).join(', ')} — frequency above 2.5 means your audience has seen these ads too many times.`);

  const noConv = campaigns.filter(c => c.ctr >= 1.0 && c.conversions === 0 && c.clicks > 30);
  if (noConv.length)
    recs.push(`Audit landing pages for ${noConv.map(c => `"${c.name}"`).join(', ')} — strong click-through rates with zero conversions indicate post-click friction.`);

  const highCPC = campaigns.filter(c => c.cpc > 20 && detectCampaignType(c.name) !== 'awareness');
  if (highCPC.length && recs.length < 5)
    recs.push(`CPC on ${highCPC.map(c => `"${c.name}"`).join(', ')} is above ${fmt(highCPC[0].cpc,'currency',currency)} — broaden targeting or test new creatives to improve relevance score.`);

  if (recs.length < 3)
    recs.push(`Maintain current pacing and review performance again in 7–10 days before making structural changes.`);

  return recs.slice(0, 5);
}
