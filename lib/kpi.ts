import { CampaignData, KPISummary } from "./types";

export function calcKPIs(campaigns: CampaignData[]): KPISummary {
  const totalSpend       = campaigns.reduce((s, c) => s + (c.spend ?? 0), 0);
  const totalImpressions = campaigns.reduce((s, c) => s + (c.impressions ?? 0), 0);
  const totalClicks      = campaigns.reduce((s, c) => s + (c.clicks ?? 0), 0);
  const totalConversions = campaigns.reduce((s, c) => s + (c.conversions ?? 0), 0);
  const avgCTR  = totalImpressions ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCPC  = totalClicks ? totalSpend / totalClicks : 0;
  const avgCPM  = totalImpressions ? (totalSpend / totalImpressions) * 1000 : 0;
  const avgCPA  = totalConversions ? totalSpend / totalConversions : 0;
  const rc         = campaigns.filter(c => (c.roas ?? 0) > 0 && (c.spend ?? 0) > 0);
  // Weighted ROAS = total revenue / total spend (spend-weighted, not arithmetic mean)
  const totalRevenue = rc.reduce((s, c) => s + (c.spend ?? 0) * (c.roas ?? 0), 0);
  const roasSpend    = rc.reduce((s, c) => s + (c.spend ?? 0), 0);
  const avgROAS      = roasSpend > 0 ? totalRevenue / roasSpend : 0;
  const totalReach    = campaigns.reduce((s, c) => s + (c.reach ?? 0), 0);
  const avgFrequency  = totalReach ? totalImpressions / totalReach : 0;
  return { totalSpend, totalImpressions, totalClicks, avgCTR, avgCPC, avgCPM, avgCPA, totalConversions, avgROAS, avgFrequency, totalReach };
}
