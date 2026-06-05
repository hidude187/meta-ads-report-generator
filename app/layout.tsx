import type { Metadata } from "next";
import "./globals.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MetriQuill Free",
  url: "https://metriquill.com/free",
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
    "Arabic RTL PDF support",
    "No login required",
    "Client-side only — data stays in browser",
  ],
};

export const metadata: Metadata = {
  title: "MetriQuill Free — Meta Ads CSV to PDF Report Generator",
  description:
    "Turn your Facebook Ads CSV export into a branded PDF report in 30 seconds. No login. No subscription. Free forever.",
  metadataBase: new URL("https://metriquill.com"),
  alternates: {
    canonical: "https://metriquill.com/free",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  openGraph: {
    title:       "MetriQuill Free — Meta Ads Report Generator",
    description: "No login. No API. Upload CSV → get branded PDF in 30 seconds. Free forever.",
    url:         "https://metriquill.com/free",
    siteName:    "MetriQuill Free",
    type:        "website",
    images: [
      {
        url:    "https://metriquill-free.vercel.app/android-chrome-512x512.png",
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
    images:      ["https://metriquill-free.vercel.app/android-chrome-512x512.png"],
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
