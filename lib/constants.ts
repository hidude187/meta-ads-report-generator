// Shared constants — import from here instead of hardcoding magic numbers

export const MAX_CSV_SIZE_BYTES  = 20 * 1024 * 1024; // 20 MB
export const MAX_LOGO_SIZE_BYTES = 2  * 1024 * 1024; // 2 MB
export const MAX_CSV_ROWS        = 2000;

export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "AED",
  "SAR",
  "MAD",
  "DZD",
  "TND",
  "EGP",
  "TRY",
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number];
