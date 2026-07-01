import { describe, expect, it } from "vitest";

import { formatMoney } from "@/lib/money";

describe("formatMoney", () => {
  it("formata numeros em BRL", () => {
    expect(formatMoney(59.9).replace(/ /g, " ")).toBe("R$ 59,90");
  });

  it("aceita strings numericas", () => {
    expect(formatMoney("34.9").replace(/ /g, " ")).toBe("R$ 34,90");
  });

  it("formata zero", () => {
    expect(formatMoney(0).replace(/ /g, " ")).toBe("R$ 0,00");
  });
});
