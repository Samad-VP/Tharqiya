import dotenv from 'dotenv';
dotenv.config({ override: true });
import prisma from '../config/db.js';

async function verifySuperAdmin() {
    const oldEmail = 'admin@tharqiya.com';
    const newEmail = 'admin@darussalameduvillage.com';

    try {
        const oldUser = await prisma.user.findUnique({
            where: { email: oldEmail }
        });

        const newUser = await prisma.user.findUnique({
            where: { email: newEmail }
        });

        console.log('--- Verification Result ---');
        console.log(`Old User (${oldEmail}): ${oldUser ? 'STILL EXISTS' : 'DELETED'}`);
        console.log(`New User (${newEmail}): ${newUser ? 'FOUND' : 'NOT FOUND'}`);
        if (newUser) {
            console.log(`New User Role: ${newUser.role}`);
        }
        
    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifySuperAdmin();
