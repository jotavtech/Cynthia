import type { UserRole } from "@/generated/prisma/enums";

export function canAccessAdmin(role: UserRole | undefined) {
  return role === "ADMIN";
}
