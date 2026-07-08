import { describe, expect, it } from "vitest";

import {
  orderCode,
  orderStatusClasses,
  orderStatusLabels,
} from "@/lib/order-status";
import { canAccessAdmin } from "@/lib/permissions";

describe("orderCode", () => {
  it("usa os ultimos 6 caracteres em maiusculo", () => {
    expect(orderCode("clabc123xyz789")).toBe("XYZ789");
  });
});

describe("orderStatusLabels", () => {
  it("tem rotulo para todos os status", () => {
    expect(orderStatusLabels.PENDING).toBe("Pendente");
    expect(orderStatusLabels.DELIVERED).toBe("Entregue");
  });
});

describe("orderStatusClasses", () => {
  it("destaca pendente e cancelado", () => {
    expect(orderStatusClasses("PENDING")).toContain("amber");
    expect(orderStatusClasses("CANCELLED")).toContain("red");
  });
});

describe("canAccessAdmin", () => {
  it("permite apenas ADMIN", () => {
    expect(canAccessAdmin("ADMIN")).toBe(true);
    expect(canAccessAdmin(undefined)).toBe(false);
  });
});
