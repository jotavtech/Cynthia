import { prisma } from "@/lib/prisma";

export const SETTINGS_ID = "default";

export async function getSiteSettings() {
  return prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });
}
