// lib/formatters.ts
// Thin module — re-exports everything so existing import sites need zero changes.
// Actual logic lives in: lib/benchmarks.ts · lib/insights.ts

export function fmt(val: number | undefined | null, type: 'currency' | 'number' | 'percent' | 'decimal', currency = 'USD'): string {
  const n = (val === undefined || val === null || isNaN(val as number)) ? 0 : val;
  if (type === 'currency') { const digits = n < 1 ? 3 : n < 10 ? 2 : 0; return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n); }
  if (type === 'percent')  return n.toFixed(2) + '%';
  if (type === 'decimal')  return n.toFixed(2);
  return new Intl.NumberFormat('en-US').format(Math.round(n));
}

export type { HealthSignal } from './benchmarks';
export { BENCHMARKS, metricHealth, metricTooltip, detectCampaignType, getCampaignBadge } from './benchmarks';
export { generateInsights, generateRecommendations } from './insights';
