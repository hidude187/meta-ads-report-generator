export function fmt(val: number, type: 'currency' | 'number' | 'percent' | 'decimal', currency = 'USD'): string {
  if (type === 'currency') return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);
  if (type === 'percent') return val.toFixed(2) + '%';
  if (type === 'decimal') return val.toFixed(2);
  return new Intl.NumberFormat('en-US').format(Math.round(val));
}

export function generateInsights(campaigns: import('./types').CampaignData[], currency: string): string[] {
  const insights: string[] = [];
  if (!campaigns.length) return insights;
  const sorted = [...campaigns].sort((a, b) => b.roas - a.roas);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  if (best && best.roas > 3) insights.push('Scale "' + best.name + '" — ROAS of ' + best.roas.toFixed(1) + 'x is your strongest performer. Increase budget 20-30%.');
  if (worst && worst.roas > 0 && worst.roas < 1.5) insights.push('Review "' + worst.name + '" — ROAS ' + worst.roas.toFixed(1) + 'x is below break-even. Pause or restructure creative.');
  const highCPC = campaigns.filter(c => c.cpc > 15);
  if (highCPC.length) insights.push(highCPC.length + ' campaign(s) have CPC above 15 — consider refreshing creatives to improve CTR.');
  const topSpend = [...campaigns].sort((a, b) => b.spend - a.spend)[0];
  if (topSpend) {
    const pct = (topSpend.spend / campaigns.reduce((s, c) => s + c.spend, 0) * 100).toFixed(0);
    insights.push('"' + topSpend.name + '" accounts for ' + pct + '% of total spend — ensure performance justifies allocation.');
  }
  const highFreq = campaigns.filter(c => (c.frequency ?? 0) > 3);
  if (highFreq.length) insights.push('Ad fatigue risk: ' + highFreq.map(c => '"' + c.name + '"').join(', ') + ' showing frequency above 3. Rotate creatives.');
  return insights.slice(0, 5);
}