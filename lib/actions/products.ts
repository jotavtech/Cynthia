"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/catalog";
import { createSlug } from "@/lib/slug";
import { uploadImage } from "@/lib/cloudinary";
import { recordAudit } from "@/lib/audit";

export type ProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = base || "produto";
  let slug = root;
  let suffix = 1;

  for (;;) {
    const existing = await prisma.product.findUnique({
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

export async function saveProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await requireAdmin();
  const id = formData.get("id")?.toString() || undefined;

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") ?? undefined,
    sku: formData.get("sku") ?? undefined,
    stock: formData.get("stock"),
    lowStockThreshold: formData.get("lowStockThreshold") ?? 5,
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId") ?? undefined,
    isActive: formData.get("isActive") ?? false,
    isFeatured: formData.get("isFeatured") ?? false,
    isNew: formData.get("isNew") ?? false,
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    const fieldErrors: Record<string, string> = {};
    for (const [key, messages] of Object.entries(flat)) {
      if (messages && messages.length > 0) {
        fieldErrors[key] = messages[0];
      }
    }
    return { error: "Verifique os campos destacados.", fieldErrors };
  }

  const data = parsed.data;
  const slug = await uniqueSlug(createSlug(data.name), id);

  const image = formData.get("image");
  let uploadedUrl: string | undefined;
  let uploadedPublicId: string | undefined;

  if (image instanceof File && image.size > 0) {
    try {
      const uploaded = await uploadImage(image, "cynthia-makes/products");
      uploadedUrl = uploaded.secureUrl;
      uploadedPublicId = uploaded.publicId;
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  const commonData = {
    name: data.name,
    slug,
    description: data.description,
    price: data.price,
    compareAtPrice: data.compareAtPrice ?? null,
    sku: data.sku ?? null,
    stock: data.stock,
    lowStockThreshold: data.lowStockThreshold,
    categoryId: data.categoryId,
    brandId: data.brandId ?? null,
    isActive: data.isActive,
    isFeatured: data.isFeatured,
    isNew: data.isNew,
  };

  let productId = id;

  if (id) {
    await prisma.product.update({ where: { id }, data: commonData });
    await recordAudit({
      userId: session.userId,
      entity: "Product",
      entityId: id,
      action: "UPDATE",
      description: `Produto atualizado: ${data.name}`,
    });
  } else {
    const created = await prisma.product.create({ data: commonData });
    productId = created.id;
    await recordAudit({
      userId: session.userId,
      entity: "Product",
      entityId: created.id,
      action: "CREATE",
      description: `Produto criado: ${data.name}`,
    });
  }

  if (uploadedUrl && uploadedPublicId && productId) {
    await prisma.productImage.create({
      data: {
        productId,
        url: uploadedUrl,
        publicId: uploadedPublicId,
        position: 0,
      },
    });
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  redirect("/admin/produtos");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = formData.get("id")?.toString();

  if (!id) {
    return;
  }

  // Soft delete: preserva historico de pedidos e estoque.
  await prisma.product.update({
    where: { id },
    data: { isActive: false, deletedAt: new Date() },
  });

  await recordAudit({
    userId: session.userId,
    entity: "Product",
    entityId: id,
    action: "DELETE",
    description: "Produto desativado (soft delete)",
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
}
