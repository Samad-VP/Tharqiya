
import { PrismaClient } from '@prisma/client';
import prisma from '../config/db.js';

/**
 * Generates the next application number in the format TQ-2026-XXXX.
 * It finds the current maximum application number and increments it.
 */
export const generateNextApplicationNo = async (tx?: any) => {
    const db = tx || prisma;
    
    const latestStudent = await db.student.findFirst({
        where: {
            applicationNo: {
                startsWith: 'TQ-2026-'
            }
        },
        orderBy: {
            applicationNo: 'desc'
        },
        select: {
            applicationNo: true
        }
    });

    let nextNumber = 1;
    if (latestStudent && latestStudent.applicationNo) {
        const parts = latestStudent.applicationNo.split('-');
        const lastPart = parts[parts.length - 1];
        nextNumber = parseInt(lastPart, 10) + 1;
    }

    return `TQ-2026-${nextNumber.toString().padStart(4, '0')}`;
};

/**
 * Executes a function with retries on Prisma unique constraint violations.
 */
export const executeWithRetry = async <T>(
    fn: (tx: any) => Promise<T>,
    retries = 10,
    delay = 200
): Promise<T> => {
    let lastError: any;
    
    for (let i = 0; i < retries; i++) {
        try {
            return await prisma.$transaction(async (tx) => {
                return await fn(tx);
            });
        } catch (error: any) {
            lastError = error;
            // P2002 is Prisma's code for unique constraint violation
            if (error.code === 'P2002') {
                const target = error.meta?.target || 'unknown';
                console.warn(`[RETRY] Unique constraint violation on ${target} (attempt ${i + 1}/${retries}). Retrying...`);
                if (i < retries - 1) {
                    // Exponential backoff with jitter
                    const jitter = Math.random() * 100;
                    const backoff = delay * Math.pow(1.5, i) + jitter;
                    await new Promise(resolve => setTimeout(resolve, backoff));
                    continue;
                }
            }
            throw error;
        }
    }
    
    throw lastError;
};
