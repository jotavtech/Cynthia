"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { taxonomySchema } from "@/lib/validations/catalog";
import { createSlug } from "@/lib/slug";
import { recordAudit } from "@/lib/audit";

export type TaxonomyFormState = {
  error?: string;
  success?: boolean;
};

type TaxonomyKind = "category" | "brand";

async function uniqueSlug(
  kind: TaxonomyKind,
  base: string,
  ignoreId?: string,
): Promise<string> {
  const root = base || kind;
  let slug = root;
  let suffix = 1;

  for (;;) {
    const existing =
      kind === "category"
        ? await prisma.category.findUnique({
            where: { slug },
            select: { id: true },
          })
        : await prisma.brand.findUnique({
            where: { slug },
            select: { id: true },
          });

    if (!existing || existing.id === ignoreId) {
      return slug;
    }

    suffix += 1;
    slug = `${root}-${suffix}`;
  }
}

async function saveTaxonomy(
  kind: TaxonomyKind,
  formData: FormData,
): Promise<TaxonomyFormState> {
  const session = await requireAdmin();
  const id = formData.get("id")?.toString() || undefined;

  const parsed = taxonomySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? undefined,
    isActive: formData.get("isActive") ?? false,
  });

  if (!parsed.success) {
    return { error: "Nome invalido." };
  }

  const slug = await uniqueSlug(kind, createSlug(parsed.data.name), id);
  const data = {
    name: parsed.data.name,
    slug,
    description: parsed.data.description ?? null,
    isActive: parsed.data.isActive,
  };

  const entity = kind === "category" ? "Category" : "Brand";

  if (kind === "category") {
    if (id) {
      await prisma.category.update({ where: { id }, data });
    } else {
      await prisma.category.create({ data });
    }
  } else {
    if (id) {
      await prisma.brand.update({ where: { id }, data });
    } else {
      await prisma.brand.create({ data });
    }
  }

  await recordAudit({
    userId: session.userId,
    entity,
    entityId: id,
    action: id ? "UPDATE" : "CREATE",
    description: `${entity} salvo: ${parsed.data.name}`,
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/marcas");
  revalidatePath("/produtos");
  return { success: true };
}

export async function saveCategoryAction(
  _prev: TaxonomyFormState,
  formData: FormData,
): Promise<TaxonomyFormState> {
  return saveTaxonomy("category", formData);
}

export async function saveBrandAction(
  _prev: TaxonomyFormState,
  formData: FormData,
): Promise<TaxonomyFormState> {
  return saveTaxonomy("brand", formData);
}
