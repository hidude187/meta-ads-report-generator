import type { MetadataRoute } from "next";

// Single-page tool — one canonical URL. Dynamic (vs the old static
// public/sitemap.xml) so lastmod stays current and the domain can't
// drift out of sync with layout.tsx again.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://free.metriquill.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
