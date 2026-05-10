import { CampaignData } from './types';

const KEY_MAP: Record<string, keyof CampaignData> = {
  'campaign name': 'name', 'campaign': 'name',
  'amount spent': 'spend', 'spend': 'spend', 'cost': 'spend',
  'impressions': 'impressions',
  'link clicks': 'clicks', 'clicks': 'clicks',
  'ctr (link click-through rate)': 'ctr', 'ctr': 'ctr',
  'cpc (cost per link click)': 'cpc', 'cpc': 'cpc',
  'cpm (cost per 1,000 impressions)': 'cpm', 'cpm': 'cpm',
  'results': 'conversions', 'conversions': 'conversions', 'purchases': 'conversions',
  'purchase roas (return on ad spend)': 'roas', 'roas': 'roas',
  'reach': 'reach',
  'frequency': 'frequency',
};

function normalizeKey(k: string): string {
  return k.toLowerCase().trim().replace(/\s+/g, ' ');
}

function num(v: string | undefined): number {
  if (!v) return 0;
  const n = parseFloat(v.replace(/[^0-9.-]/g, ''));
  return isNaN(n) ? 0 : n;
}

export function parseCSV(rows: Record<string, string>[]): CampaignData[] {
  if (!rows.length) return [];
  const headers = Object.keys(rows[0]);
  const mapping: Record<string, keyof CampaignData> = {};
  headers.forEach(h => {
    const norm = normalizeKey(h);
    if (KEY_MAP[norm]) mapping[h] = KEY_MAP[norm];
  });
  return rows.map(row => {
    const c: Partial<CampaignData> = {};
    Object.entries(mapping).forEach(([col, field]) => {
      const val = row[col];
      if (field === 'name') c.name = val || 'Unknown';
      else (c as Record<string, number>)[field] = num(val);
    });
    if (!c.name) c.name = 'Unknown Campaign';
    if (c.impressions && c.clicks && !c.ctr) c.ctr = (c.clicks / c.impressions) * 100;
    if (c.spend && c.clicks && !c.cpc) c.cpc = c.spend / c.clicks;
    if (c.spend && c.impressions && !c.cpm) c.cpm = (c.spend / c.impressions) * 1000;
    // Derive frequency if reach available but frequency not in CSV
    if (c.impressions && c.reach && !c.frequency) c.frequency = c.impressions / c.reach;
    return c as CampaignData;
  }).filter(c => c.spend > 0 || c.impressions > 0);
}

export function generateDemoData(): CampaignData[] {
  return [
    { name: 'Retargeting — Website Visitors', spend: 45200, impressions: 312000, clicks: 4180, ctr: 1.34, cpc: 10.81, cpm: 144.87, conversions: 89, roas: 3.8, reach: 98000, frequency: 3.2 },
    { name: 'Cold Traffic — Lookalike 1%', spend: 78400, impressions: 891000, clicks: 7120, ctr: 0.80, cpc: 11.01, cpm: 87.99, conversions: 112, roas: 2.4, reach: 445000, frequency: 2.0 },
    { name: 'Video Views — Brand Awareness', spend: 23100, impressions: 1240000, clicks: 2480, ctr: 0.20, cpc: 9.31, cpm: 18.63, conversions: 18, roas: 1.1, reach: 820000, frequency: 1.5 },
    { name: 'Conversion — DPA Catalog', spend: 61800, impressions: 445000, clicks: 6230, ctr: 1.40, cpc: 9.92, cpm: 138.88, conversions: 203, roas: 5.2, reach: 187000, frequency: 2.4 },
    { name: 'Lead Gen — Form Fills', spend: 34500, impressions: 267000, clicks: 3740, ctr: 1.40, cpc: 9.22, cpm: 129.21, conversions: 147, roas: 0, reach: 142000, frequency: 1.9 },
  ];
}

export function calcKPIs(campaigns: CampaignData[]) {
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const avgCTR = totalImpressions ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCPC = totalClicks ? totalSpend / totalClicks : 0;
  const avgCPM = totalImpressions ? (totalSpend / totalImpressions) * 1000 : 0;
  const rc = campaigns.filter(c => c.roas > 0);
  const avgROAS = rc.length ? rc.reduce((s, c) => s + c.roas, 0) / rc.length : 0;
  // Frequency: total impressions / total reach
  const totalReach = campaigns.reduce((s, c) => s + (c.reach || 0), 0);
  const avgFrequency = totalReach ? totalImpressions / totalReach : 0;
  return { totalSpend, totalImpressions, totalClicks, avgCTR, avgCPC, avgCPM, totalConversions, avgROAS, avgFrequency, totalReach };
}
