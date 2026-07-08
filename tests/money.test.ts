import { describe, expect, it } from "vitest";

import {
  centsToDecimalString,
  formatMoney,
  fromCents,
  toCents,
} from "@/lib/money";

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

describe("toCents", () => {
  it("converte reais para centavos inteiros", () => {
    expect(toCents(19.99)).toBe(1999);
    expect(toCents("59.90")).toBe(5990);
    expect(toCents(0)).toBe(0);
  });

  it("arredonda o ruido de ponto flutuante", () => {
    expect(toCents(19.99)).toBe(1999);
    expect(toCents(0.1 + 0.2)).toBe(30);
  });
});

describe("centsToDecimalString / fromCents", () => {
  it("centsToDecimalString devolve string com 2 casas", () => {
    expect(centsToDecimalString(1999)).toBe("19.99");
    expect(centsToDecimalString(5)).toBe("0.05");
    expect(centsToDecimalString(0)).toBe("0.00");
  });

  it("fromCents devolve numero em reais", () => {
    expect(fromCents(1999)).toBe(19.99);
    expect(fromCents(0)).toBe(0);
  });

  it("soma de itens em centavos nao acumula erro de float", () => {
    const cents = toCents(0.1) * 3;
    expect(centsToDecimalString(cents)).toBe("0.30");
  });
});
