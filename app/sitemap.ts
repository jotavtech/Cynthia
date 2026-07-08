import type { MetadataRoute } from "next";

import { getSitemapProducts } from "@/lib/catalog";
import { siteUrl } from "@/lib/site-url";

// Reads products from the database, so it must not be evaluated at build time
// (the build runs without a live DB on purpose).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/produtos",
    "/sobre",
    "/contato",
    "/carrinho",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getSitemapProducts();
    productRoutes = products.map((product) => ({
      url: `${siteUrl}/produtos/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    // Never let a transient DB issue break the sitemap; fall back to static.
    console.error("sitemap: failed to load products", error);
  }

  return [...staticRoutes, ...productRoutes];
}
