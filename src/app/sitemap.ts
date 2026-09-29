import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://example.com";
  const routes = ["", "/book", "/menu", "/story", "/gallery", "/visit", "/contact"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/menu" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/menu" ? 0.9 : 0.8,
  }));
}
