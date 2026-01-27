console.log('Script started...');
import dotenv from 'dotenv';
dotenv.config({ override: true });
import prisma from '../config/db.js';
import { hashPassword } from '../utils/auth.js';

async function replaceSuperAdmin() {
    const oldEmail = 'admin@tharqiya.com';
    const newEmail = 'admin@darussalameduvillage.com';
    const newPassword = 'admin123';
    const newName = 'Super Admin';

    try {
        console.log(`Checking for existing Super Admin: ${oldEmail}...`);
        const oldUser = await prisma.user.findUnique({
            where: { email: oldEmail }
        });

        if (oldUser) {
            console.log(`Found old user. Deleting ${oldEmail}...`);
            // Note: If there are linked records (like Student/Interviewer), they might need deletion too.
            // But usually Super Admin doesn't have these.
            await prisma.user.delete({
                where: { email: oldEmail }
            });
            console.log(`Successfully deleted ${oldEmail}.`);
        } else {
            console.log(`Old user ${oldEmail} not found.`);
        }

        console.log(`Creating new Super Admin: ${newEmail}...`);
        const hashedPassword = await hashPassword(newPassword);
        
        const newUser = await prisma.user.upsert({
            where: { email: newEmail },
            update: {
                name: newName,
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                isFirstLogin: false
            },
            create: {
                email: newEmail,
                name: newName,
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                isFirstLogin: false
            }
        });

        console.log(`Successfully set up Super Admin: ${newUser.email}`);
        process.exit(0);
    } catch (error) {
        console.error('Error replacing Super Admin:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

replaceSuperAdmin();
