// Shared constants — import from here instead of hardcoding magic numbers

export const MAX_CSV_SIZE_BYTES  = 20 * 1024 * 1024; // 20 MB
export const MAX_LOGO_SIZE_BYTES = 2  * 1024 * 1024; // 2 MB
export const MAX_CSV_ROWS        = 2000;

export const CURRENCIES = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "DZD", label: "DZD — Algerian Dinar" },
  { code: "SAR", label: "SAR — Saudi Riyal" },
  { code: "AED", label: "AED — UAE Dirham" },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]["code"];
