import { CampaignData } from "./types";

export type HealthSignal = 'good' | 'warn' | 'poor' | 'neutral';

// ── Industry benchmarks (2025–2026 cross-industry averages) ──────────────────
export const BENCHMARKS = {
  ctr:  { avg: 0.90, good: 1.49, poor: 0.72 },
  cpc:  { avg: 1.72, good: 1.00, poor: 3.00 },
  cpm:  { avg: 14.0, good: 8.00, poor: 25.0 },
  roas: { avg: 2.19, good: 3.00, poor: 1.50 },
  cpa:  { avg: 23.1, good: 15.0, poor: 45.0 },
  frequency: { warn: 2.5, danger: 4.0 },
};

export function metricHealth(key: 'ctr' | 'cpc' | 'cpm' | 'cpa' | 'roas' | 'frequency', val: number): HealthSignal {
  if (val <= 0) return 'neutral';
  switch (key) {
    case 'ctr':       return val >= BENCHMARKS.ctr.good  ? 'good' : val < BENCHMARKS.ctr.poor  ? 'poor' : 'warn';
    case 'roas':      return val >= BENCHMARKS.roas.good ? 'good' : val < BENCHMARKS.roas.poor ? 'poor' : 'warn';
    case 'cpc':       return val <= BENCHMARKS.cpc.good  ? 'good' : val > BENCHMARKS.cpc.poor  ? 'poor' : 'warn';
    case 'cpm':       return val <= BENCHMARKS.cpm.good  ? 'good' : val > BENCHMARKS.cpm.poor  ? 'poor' : 'warn';
    case 'cpa':       return val <= BENCHMARKS.cpa.good  ? 'good' : val > BENCHMARKS.cpa.poor  ? 'poor' : 'warn';
    case 'frequency': return val >= BENCHMARKS.frequency.danger ? 'poor' : val >= BENCHMARKS.frequency.warn ? 'warn' : 'neutral';
    default:          return 'neutral';
  }
}

export function metricTooltip(key: 'ctr' | 'cpc' | 'cpm' | 'cpa' | 'roas' | 'frequency', val: number, signal: HealthSignal): string {
  const benchmarks: Record<string, string> = {
    ctr:       `Benchmark: good ≥1.49% · poor <0.72% · avg 0.90%`,
    cpc:       `Benchmark: good ≤$1.00 · poor >$3.00 · avg $1.72`,
    cpm:       `Benchmark: good ≤$8.00 · poor >$25.00 · avg $14.00`,
    cpa:       `Benchmark: good ≤$15 · poor >$45 · avg $23`,
    roas:      `Benchmark: good ≥3.00x · poor <1.50x · avg 2.19x`,
    frequency: `Benchmark: warn ≥2.5x · danger ≥4.0x`,
  };
  const advice: Partial<Record<typeof key, Partial<Record<HealthSignal, string>>>> = {
    ctr:       { good: 'Strong click-through — ad is resonating.', warn: 'Average — try a new hook or creative angle.', poor: 'Low CTR — audience-ad mismatch, test new creatives.' },
    cpc:       { good: 'Efficient cost per click.', warn: 'CPC is moderate — monitor.', poor: 'High CPC — broaden audience or refresh creative.' },
    cpm:       { good: 'Low cost per 1000 impressions.', warn: 'CPM is elevated — check audience size.', poor: 'High CPM — audience too narrow or heavy competition.' },
    cpa:       { good: 'Efficient cost per acquisition.', warn: 'CPA is moderate — room to improve.', poor: 'High CPA — review landing page and offer.' },
    frequency: { warn: 'Early fatigue — prepare fresh creatives.', poor: "Don't pause — refresh creative instead to avoid algorithm reset." },
  };
  const tip = advice[key]?.[signal];
  return `${benchmarks[key]}${tip ? '\n→ ' + tip : ''}`;
}

// Detect campaign type from name keywords (shared between badges.ts and insights.ts)
export function detectCampaignType(name: string): 'retargeting' | 'awareness' | 'lead' | 'traffic' | 'conversion' | 'unknown' {
  const n = name.toLowerCase();
  if (n.includes('retarget') || n.includes('remarketing') || n.includes('warm') || n.includes('dpa') || n.includes('catalog')) return 'retargeting';
  if (n.includes('awareness') || n.includes('brand') || n.includes('video view') || n.includes('reach')) return 'awareness';
  if (n.includes('lead') || n.includes('form')) return 'lead';
  if (n.includes('traffic') || n.includes('click')) return 'traffic';
  if (n.includes('conversion') || n.includes('purchase') || n.includes('sale') || n.includes('lookalike') || n.includes('cold')) return 'conversion';
  return 'unknown';
}

export function getCampaignBadge(c: CampaignData): 'TOP' | 'REVIEW' | 'WATCH' | null {
  const type = detectCampaignType(c.name);
  if (type === 'awareness') return null;
  if (c.roas >= 4 || (c.roas >= 3 && c.ctr >= 1.2)) return 'TOP';
  if ((c.roas > 0 && c.roas < 1.5) || (c.ctr < 0.5 && c.spend > 500)) return 'REVIEW';
  if ((c.frequency ?? 0) >= BENCHMARKS.frequency.warn) return 'WATCH';
  return null;
}
