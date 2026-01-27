import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logAction = async (
  actorId: string,
  action: string,
  targetId?: string,
  metadata?: any
) => {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        targetId,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Non-blocking error, but should be noted
  }
};
