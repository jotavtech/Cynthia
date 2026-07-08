import { describe, expect, it } from "vitest";

import { buildWhatsappCartMessage, buildWhatsappUrl } from "@/lib/whatsapp";

describe("buildWhatsappCartMessage", () => {
  it("lista itens com subtotal", () => {
    const message = buildWhatsappCartMessage([
      { name: "Batom Nude", quantity: 2, unitPrice: 34.9 },
    ]);

    expect(message).toContain("2x Batom Nude");
    expect(message).toContain("Meu nome:");
  });
});

describe("buildWhatsappUrl", () => {
  it("remove caracteres nao numericos do telefone e codifica a mensagem", () => {
    const url = buildWhatsappUrl("+55 (11) 99999-9999", "Ola mundo");
    expect(url).toBe("https://wa.me/5511999999999?text=Ola%20mundo");
  });
});
