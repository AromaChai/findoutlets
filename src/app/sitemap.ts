import type { MetadataRoute } from "next";
import { getAllOutlets } from "@/lib/outlets";
import { getCitySlug } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://findus.aromachai.in";
  const outlets = await getAllOutlets();
  const cities = [...new Set(outlets.map((o) => getCitySlug(o)))];

  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...cities.map((city) => ({
      url: `${base}/${city}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...outlets.map((outlet) => ({
      url: `${base}/${getCitySlug(outlet)}/${outlet.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
