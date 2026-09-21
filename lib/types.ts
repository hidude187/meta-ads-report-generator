export type AdPlatform = 'meta' | 'google';

export interface ClientInfo {
  clientName: string;
  agencyName: string;
  dateFrom: string;
  dateTo: string;
  currency: string;
  brandColor: string;
  logoDataUrl: string;
}

export interface CampaignData {
  name: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversions: number;
  roas: number;
  cpa: number;        // derived: spend / conversions
  reach?: number;
  frequency?: number;
  status?: string;
}

export interface KPISummary {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  avgCTR: number;
  avgCPC: number;
  avgCPM: number;
  totalConversions: number;
  avgROAS: number;
  avgCPA: number;     // total spend / total conversions
  avgFrequency: number;
  totalReach: number;
}
