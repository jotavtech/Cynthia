/** Public base URL of the site, from APP_URL with a safe fallback. */
export const siteUrl = (
  process.env.APP_URL ?? "https://cynthiamakes1.com.br"
).replace(/\/$/, "");
