"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { siteSettingsSchema } from "@/lib/validations/catalog";
import { recordAudit } from "@/lib/audit";
import { SETTINGS_ID } from "@/lib/settings";

export type SettingsFormState = {
  error?: string;
  success?: boolean;
};

export async function saveSettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await requireAdmin();

  const parsed = siteSettingsSchema.safeParse({
    storeName: formData.get("storeName"),
    whatsapp: formData.get("whatsapp"),
    instagram: formData.get("instagram") ?? undefined,
    email: formData.get("email") ?? undefined,
    address: formData.get("address") ?? undefined,
    businessHours: formData.get("businessHours") ?? undefined,
    homeHeroTitle: formData.get("homeHeroTitle"),
    homeHeroDescription: formData.get("homeHeroDescription"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    whatsappDefaultMessage: formData.get("whatsappDefaultMessage"),
  });

  if (!parsed.success) {
    return { error: "Verifique os campos obrigatorios." };
  }

  const data = {
    ...parsed.data,
    instagram: parsed.data.instagram ?? null,
    email: parsed.data.email ?? null,
    address: parsed.data.address ?? null,
    businessHours: parsed.data.businessHours ?? null,
  };

  await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: data,
    create: { id: SETTINGS_ID, ...data },
  });

  await recordAudit({
    userId: session.userId,
    entity: "SiteSettings",
    entityId: SETTINGS_ID,
    action: "UPDATE",
    description: "Configuracoes do site atualizadas",
  });

  revalidatePath("/", "layout");
  return { success: true };
}
