import "server-only";

import type { AuditAction } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export type AuditEventInput = {
  userId?: string;
  entity: string;
  entityId?: string;
  action: AuditAction;
  description?: string;
};

/**
 * Registra um evento de auditoria. Nunca lanca: uma falha de auditoria nao deve
 * derrubar a operacao principal (apenas loga no servidor).
 */
export async function recordAudit(event: AuditEventInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: event.userId,
        entity: event.entity,
        entityId: event.entityId,
        action: event.action,
        description: event.description,
      },
    });
  } catch (error) {
    console.error("Falha ao registrar auditoria:", error);
  }
}
