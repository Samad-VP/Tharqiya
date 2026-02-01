import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import axios from 'axios';

// Simple sanity test for CI
async function testHealth() {
    console.log('[TEST] Starting Health Check...');
    const prisma = new PrismaClient();
    
    try {
        // 1. DB Connectivity
        await prisma.$queryRaw`SELECT 1`;
        console.log('[PASS] Database connectivity verified');

        // 2. Schema Integrity (Check if Notification table exists)
        const count = await prisma.notification.count();
        console.log(`[PASS] Notification table reachable (Count: ${count})`);

        process.exit(0);
    } catch (error: any) {
        console.error('[FAIL] Health check failed:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testHealth();
