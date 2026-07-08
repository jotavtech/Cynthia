import { describe, expect, it } from "vitest";

import { productSchema } from "@/lib/validations/catalog";
import { checkoutSchema, stockAdjustmentSchema } from "@/lib/validations/order";

describe("productSchema", () => {
  const base = {
    name: "Base Matte",
    description: "Base de acabamento matte",
    price: "59,90",
    stock: "12",
    categoryId: "cat_1",
  };

  it("normaliza preco com virgula e aplica defaults", () => {
    const result = productSchema.parse(base);
    expect(result.price).toBe("59.90");
    expect(result.stock).toBe(12);
    expect(result.lowStockThreshold).toBe(5);
    expect(result.isActive).toBe(true);
    expect(result.isFeatured).toBe(false);
  });

  it("respeita isActive falso explicito (checkbox desmarcado)", () => {
    const result = productSchema.parse({ ...base, isActive: false });
    expect(result.isActive).toBe(false);
  });

  it("rejeita preco invalido", () => {
    const result = productSchema.safeParse({ ...base, price: "abc" });
    expect(result.success).toBe(false);
  });

  it("exige categoria", () => {
    const result = productSchema.safeParse({ ...base, categoryId: "" });
    expect(result.success).toBe(false);
  });
});

describe("checkoutSchema", () => {
  it("aceita um pedido valido", () => {
    const result = checkoutSchema.safeParse({
      customerName: "Maria",
      customerPhone: "11999998888",
      items: [{ id: "prod_1", quantity: 2 }],
    });
    expect(result.success).toBe(true);
  });

  it("rejeita carrinho vazio", () => {
    const result = checkoutSchema.safeParse({
      customerName: "Maria",
      customerPhone: "11999998888",
      items: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("stockAdjustmentSchema", () => {
  it("aceita quantidade negativa (saida)", () => {
    const result = stockAdjustmentSchema.parse({
      productId: "prod_1",
      type: "LOSS",
      quantity: "-3",
      reason: "Quebra",
    });
    expect(result.quantity).toBe(-3);
  });

  it("rejeita quantidade zero", () => {
    const result = stockAdjustmentSchema.safeParse({
      productId: "prod_1",
      type: "ADJUSTMENT",
      quantity: "0",
      reason: "Teste",
    });
    expect(result.success).toBe(false);
  });
});
