import type { MetadataRoute } from "next";
import { PROJECTS } from "./data/projects";

const BASE = "https://sulemanaliasif.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-06");
  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    ...PROJECTS.map((p) => ({
      url: `${BASE}/?project=${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
