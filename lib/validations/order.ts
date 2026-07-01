import { z } from "zod";

export const checkoutItemSchema = z.object({
  id: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(999),
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Informe seu nome."),
  customerPhone: z
    .string()
    .trim()
    .min(8, "Informe um telefone valido.")
    .max(20),
  customerEmail: z
    .string()
    .trim()
    .email("Email invalido.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  customerAddress: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  notes: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  items: z.array(checkoutItemSchema).min(1, "Carrinho vazio."),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const orderStatusValues = [
  "PENDING",
  "CONFIRMED",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export const orderStatusSchema = z.enum(orderStatusValues);

export const stockAdjustmentTypes = [
  "PURCHASE",
  "ADJUSTMENT",
  "RETURN",
  "LOSS",
] as const;

export const stockAdjustmentSchema = z.object({
  productId: z.string().min(1),
  type: z.enum(stockAdjustmentTypes),
  quantity: z.coerce
    .number()
    .int()
    .refine((value) => value !== 0, "Quantidade nao pode ser zero."),
  reason: z.string().trim().min(2, "Informe um motivo."),
  notes: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
