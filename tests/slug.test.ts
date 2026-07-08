import { describe, expect, it } from "vitest";

import { createSlug } from "@/lib/slug";

describe("createSlug", () => {
  it("normaliza acentos e espacos", () => {
    expect(createSlug("Base Líquida Soft Matte")).toBe(
      "base-liquida-soft-matte",
    );
  });

  it("remove caracteres especiais e hifens nas pontas", () => {
    expect(createSlug("  Batom! Nude & Conforto  ")).toBe(
      "batom-nude-conforto",
    );
  });

  it("colapsa multiplos separadores", () => {
    expect(createSlug("Olhos / Sombras --- 2025")).toBe("olhos-sombras-2025");
  });
});
