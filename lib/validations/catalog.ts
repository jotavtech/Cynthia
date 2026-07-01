import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

const money = z
  .string()
  .trim()
  .regex(/^\d+([.,]\d{1,2})?$/, "Valor invalido. Use ex: 59.90")
  .transform((value) => value.replace(",", "."));

export const productSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto."),
  description: z.string().trim().min(5, "Descricao muito curta."),
  price: money,
  compareAtPrice: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value.replace(",", ".") : undefined))
    .refine(
      (value) => value === undefined || /^\d+(\.\d{1,2})?$/.test(value),
      "Valor comparativo invalido.",
    ),
  sku: optionalString,
  stock: z.coerce.number().int().min(0, "Estoque invalido."),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  categoryId: z.string().min(1, "Selecione uma categoria."),
  brandId: optionalString,
  isActive: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
  isNew: z.coerce.boolean().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;

export const taxonomySchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto."),
  description: optionalString,
  isActive: z.coerce.boolean().default(true),
});

export type TaxonomyInput = z.infer<typeof taxonomySchema>;

export const siteSettingsSchema = z.object({
  storeName: z.string().trim().min(2),
  whatsapp: z.string().trim().min(10, "WhatsApp invalido."),
  instagram: optionalString,
  email: optionalString,
  address: optionalString,
  businessHours: optionalString,
  homeHeroTitle: z.string().trim().min(2),
  homeHeroDescription: z.string().trim().min(2),
  seoTitle: z.string().trim().min(2),
  seoDescription: z.string().trim().min(2),
  whatsappDefaultMessage: z.string().trim().min(2),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
