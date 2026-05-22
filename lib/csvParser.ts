import { CampaignData } from './types';
export { calcKPIs } from './kpi';

const KEY_MAP: Record<string, keyof CampaignData> = {
  'campaign name': 'name', 'campaign': 'name', 'ad set name': 'name',
  'amount spent': 'spend', 'spend': 'spend', 'cost': 'spend', 'amount spent (usd)': 'spend',
  'impressions': 'impressions',
  'link clicks': 'clicks', 'clicks': 'clicks', 'outbound clicks': 'clicks',
  'ctr (link click-through rate)': 'ctr', 'ctr (all)': 'ctr', 'ctr': 'ctr',
  'cpc (cost per link click)': 'cpc', 'cpc (all)': 'cpc', 'cpc': 'cpc',
  'cpm (cost per 1,000 impressions)': 'cpm', 'cpm': 'cpm',
  'results': 'conversions', 'conversions': 'conversions', 'purchases': 'conversions',
  'leads': 'conversions', 'actions': 'conversions',
  'purchase roas (return on ad spend)': 'roas', 'website purchase roas': 'roas', 'roas': 'roas',
  'reach': 'reach',
  'frequency': 'frequency',
  'cost per result': 'cpa', 'cost per conversion': 'cpa', 'cost per purchase': 'cpa', 'cpa': 'cpa',
};

function normalizeKey(k: string): string {
  return k.toLowerCase().trim().replace(/\s+/g, ' ');
}

function num(v: string | undefined): number {
  if (!v) return 0;
  const n = parseFloat(v.replace(/[^0-9.-]/g, ''));
  return isNaN(n) ? 0 : Math.max(0, n);
}

function safe(c: Partial<CampaignData>): CampaignData {
  return {
    name: c.name || 'Unknown Campaign',
    spend: c.spend ?? 0,
    impressions: c.impressions ?? 0,
    clicks: c.clicks ?? 0,
    ctr: c.ctr ?? 0,
    cpc: c.cpc ?? 0,
    cpm: c.cpm ?? 0,
    conversions: c.conversions ?? 0,
    roas: c.roas ?? 0,
    cpa: c.cpa ?? 0,
    reach: c.reach ?? 0,
    frequency: c.frequency ?? 0,
  };
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
    const s = safe(c);
    // Derive missing metrics
    if (s.impressions && s.clicks && !s.ctr) s.ctr = (s.clicks / s.impressions) * 100;
    if (s.spend && s.clicks && !s.cpc) s.cpc = s.spend / s.clicks;
    if (s.spend && s.impressions && !s.cpm) s.cpm = (s.spend / s.impressions) * 1000;
    if (s.impressions && s.reach && !s.frequency) s.frequency = s.impressions / s.reach;
    if (s.spend && s.conversions && !s.cpa) s.cpa = s.spend / s.conversions;
    return s;
  }).filter(c => c.spend > 0 || c.impressions > 0);
}

export function generateDemoData(): CampaignData[] {
  return [
    { name: 'Retargeting — Website Visitors', spend: 45200, impressions: 312000, clicks: 4180, ctr: 1.34, cpc: 10.81, cpm: 144.87, conversions: 89, roas: 3.8, cpa: 507.87, reach: 98000, frequency: 3.2 },
    { name: 'Cold Traffic — Lookalike 1%',    spend: 78400, impressions: 891000, clicks: 7120, ctr: 0.80, cpc: 11.01, cpm: 87.99,  conversions: 112, roas: 2.4, cpa: 700.00, reach: 445000, frequency: 2.0 },
    { name: 'Video Views — Brand Awareness',  spend: 23100, impressions: 1240000,clicks: 2480, ctr: 0.20, cpc: 9.31,  cpm: 18.63,  conversions: 18,  roas: 1.1, cpa: 1283.33,reach: 820000, frequency: 1.5 },
    { name: 'Conversion — DPA Catalog',       spend: 61800, impressions: 445000, clicks: 6230, ctr: 1.40, cpc: 9.92,  cpm: 138.88, conversions: 203, roas: 5.2, cpa: 304.43, reach: 187000, frequency: 2.4 },
    { name: 'Lead Gen — Form Fills',          spend: 34500, impressions: 267000, clicks: 3740, ctr: 1.40, cpc: 9.22,  cpm: 129.21, conversions: 147, roas: 0,   cpa: 234.69, reach: 142000, frequency: 1.9 },
  ];
}
