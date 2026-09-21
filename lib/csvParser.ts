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
  'cost per result': 'cpa', 'cost per results': 'cpa', 'cost per conversion': 'cpa', 'cost per purchase': 'cpa', 'cpa': 'cpa',
};

// Google Ads UI export (Campaigns > Download > .csv). Reach and frequency are not
// part of a Google Ads campaign export, so they stay undefined instead of 0.
// "Avg. impr. freq. / user (7 days)" is intentionally not mapped: it is a 7-day
// window, not the frequency for the report period.
const GOOGLE_ADS_KEY_MAP: Record<string, keyof CampaignData> = {
  'campaign': 'name', 'campaign name': 'name',
  'cost': 'spend',
  'impr.': 'impressions', 'impressions': 'impressions',
  'clicks': 'clicks',
  'ctr': 'ctr',
  'avg. cpc': 'cpc',
  'avg. cpm': 'cpm',
  'conversions': 'conversions',
  'conv. value / cost': 'roas',
  'cost / conv.': 'cpa',
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

export function extractCSVDates(rows: Record<string, string>[]): { dateFrom: string; dateTo: string } {
  if (!rows.length) return { dateFrom: '', dateTo: '' };
  const first = rows[0];
  const dateFrom = first['Reporting starts'] || first['reporting starts'] || '';
  const dateTo   = first['Reporting ends']   || first['reporting ends']   || '';
  return { dateFrom, dateTo };
}

export function parseCSV(rows: Record<string, string>[]): CampaignData[] {
  return mapRows(rows, KEY_MAP);
}

function mapRows(rows: Record<string, string>[], keyMap: Record<string, keyof CampaignData>): CampaignData[] {
  if (!rows.length) return [];
  const headers = Object.keys(rows[0]);
  const mapping: Record<string, keyof CampaignData> = {};
  headers.forEach(h => {
    const norm = normalizeKey(h);
    if (keyMap[norm]) mapping[h] = keyMap[norm];
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

function isGoogleAdsHeader(row: string[]): boolean {
  const cells = row.map(normalizeKey);
  return cells.includes('campaign') && (cells.includes('cost') || cells.includes('impr.'));
}

function isTotalRow(row: string[]): boolean {
  return row.some(cell => normalizeKey(cell ?? '').startsWith('total:'));
}

/**
 * Parses a Google Ads campaign export read without headers (Papa.parse with header: false).
 * The export may start with a title line and a date range line before the header row, and
 * may end with "Total: ..." rows; both are skipped so totals are not counted twice.
 */
export function parseGoogleAdsCSV(table: string[][]): CampaignData[] {
  const headerIdx = table.findIndex(isGoogleAdsHeader);
  if (headerIdx === -1) return [];
  const headers = table[headerIdx].map(h => (h ?? '').trim());
  const rows = table
    .slice(headerIdx + 1)
    .filter(r => !isTotalRow(r))
    .map(r => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? '').trim()])));
  return mapRows(rows, GOOGLE_ADS_KEY_MAP).map(c => ({ ...c, reach: undefined, frequency: undefined }));
}

function toISODate(text: string): string {
  const t = Date.parse(text.trim());
  if (isNaN(t)) return '';
  const d = new Date(t);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Reads the optional date range line ("September 1, 2026 - September 30, 2026") above the header. */
export function extractGoogleAdsDates(table: string[][]): { dateFrom: string; dateTo: string } {
  const headerIdx = table.findIndex(isGoogleAdsHeader);
  for (const row of table.slice(0, Math.max(headerIdx, 0))) {
    for (const cell of row) {
      const m = (cell ?? '').match(/^(.+?)\s+[-\u2013]\s+(.+)$/);
      if (!m) continue;
      const dateFrom = toISODate(m[1]);
      const dateTo = toISODate(m[2]);
      if (dateFrom && dateTo) return { dateFrom, dateTo };
    }
  }
  return { dateFrom: '', dateTo: '' };
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
