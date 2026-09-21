import type { Metadata } from "next";
import "./globals.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MetriQuill Free",
  url: "https://free.metriquill.com",
  sameAs: ["https://github.com/hidude187/meta-ads-report-generator"],
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  description:
    "Turn your Facebook Ads CSV export into a branded PDF report in 30 seconds. No login. No subscription. Free forever.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "MetriQuill",
    url: "https://metriquill.com",
  },
  featureList: [
    "PDF report generation",
    "Social media PNG export",
    "PowerPoint export",
    "Campaign health badges",
    "Industry benchmark comparisons",
    "Ad fatigue detection",
    "MENA currency support",
    "Arabic client names on the PNG share card",
    "No login required",
    "Client-side only — data stays in browser",
  ],
};

export const metadata: Metadata = {
  title: "MetriQuill Free — Meta Ads CSV to PDF Report Generator",
  description:
    "Turn your Facebook Ads CSV export into a branded PDF report in 30 seconds. No login. No subscription. Free forever.",
  metadataBase: new URL("https://free.metriquill.com"),
  alternates: {
    canonical: "https://free.metriquill.com",
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon.ico", type: "image/x-icon" },
    ],
    apple: { url: "/favicon/apple-touch-icon.png" },
    other: [
      { rel: "android-chrome-192", url: "/favicon/android-chrome-192x192.png" },
      { rel: "android-chrome-512", url: "/favicon/android-chrome-512x512.png" },
    ],
  },
  openGraph: {
    title:       "MetriQuill Free — Meta Ads Report Generator",
    description: "No login. No API. Upload CSV → get branded PDF in 30 seconds. Free forever.",
    url:         "https://free.metriquill.com",
    siteName:    "MetriQuill Free",
    type:        "website",
    images: [
      {
        url:    "https://free.metriquill.com/favicon/android-chrome-512x512.png",
        width:  512,
        height: 512,
        alt:    "MetriQuill Free — Meta Ads Report Generator",
      },
    ],
  },
  twitter: {
    card:        "summary",
    title:       "MetriQuill Free — Meta Ads Report Generator",
    description: "No login. No API. Upload CSV → get branded PDF in 30 seconds. Free forever.",
    images:      ["https://free.metriquill.com/favicon/android-chrome-512x512.png"],
    creator:     "@metriquill",
  },
  keywords: [
    "Meta Ads report",
    "Facebook Ads CSV to PDF",
    "free ads report generator",
    "Meta Ads PDF export",
    "Facebook Ads reporting tool",
    "ads performance report",
    "MENA digital marketing",
    "free marketing report",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
