import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MetriQuill Free — Meta Ads CSV to PDF Report Generator",
  description: "Turn your Facebook Ads CSV export into a beautiful branded PDF report in 30 seconds. No login. No subscription. Free forever.",
  openGraph: {
    title: "MetriQuill Free — Meta Ads Report Generator",
    description: "No login. No API. Upload CSV → get PDF in 30 seconds.",
    url: "https://metriquill.com/free",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
