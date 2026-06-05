import type { AuditAction } from "@/generated/prisma/enums";

export type AuditEventInput = {
  userId?: string;
  entity: string;
  entityId?: string;
  action: AuditAction;
  description?: string;
};
