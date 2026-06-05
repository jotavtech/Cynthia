import type { MetadataRoute } from "next";

const baseUrl = "https://cynthiamakes.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/produtos",
    "/sobre",
    "/contato",
    "/carrinho",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
