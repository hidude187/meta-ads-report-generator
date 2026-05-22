import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MetriQuill Free — Meta Ads CSV to PDF Report Generator",
  description: "Turn your Facebook Ads CSV export into a beautiful branded PDF report in 30 seconds. No login. No subscription. Free forever.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico",       sizes: "any" },
    ],
    apple:   { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  openGraph: {
    title:       "MetriQuill Free — Meta Ads Report Generator",
    description: "No login. No API. Upload CSV → get PDF in 30 seconds.",
    url:         "https://metriquill.com/free",
    images:      [{ url: "/android-chrome-512x512.png", width: 512, height: 512 }],
  },
  twitter: {
    card:        "summary",
    title:       "MetriQuill Free — Meta Ads Report Generator",
    description: "No login. No API. Upload CSV → get PDF in 30 seconds.",
    images:      ["/android-chrome-512x512.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
