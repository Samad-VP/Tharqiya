import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import axios from 'axios';

// Simple sanity test for CI
async function testHealth() {
    console.log('[TEST] Starting Health Check...');
    
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
        console.warn('[SKIP] DATABASE_URL is not set. Skipping health check for CI.');
        process.exit(0);
    }

    const prisma = new PrismaClient();
    
    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
        console.error('[FAIL] Health check timed out after 10s');
        process.exit(1);
    }, 10000);

    try {
        // 1. DB Connectivity
        await prisma.$queryRaw`SELECT 1`;
        console.log('[PASS] Database connectivity verified');

        // 2. Schema Integrity (Check if Notification table exists)
        const count = await prisma.notification.count();
        console.log(`[PASS] Notification table reachable (Count: ${count})`);

        clearTimeout(timeout);
        process.exit(0);
    } catch (error: any) {
        console.error('[FAIL] Health check failed:', error.message);
        clearTimeout(timeout);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testHealth();
