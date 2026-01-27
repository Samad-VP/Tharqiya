import prisma from '../config/db.js';

async function cleanupUsers() {
    console.log('--- Starting User Cleanup ---');
    try {
        // 1. Get all user IDs that are NOT SUPER_ADMIN
        const usersToDelete = await prisma.user.findMany({
            where: {
                role: {
                    not: 'SUPER_ADMIN'
                }
            },
            select: { id: true }
        });

        const userIds = usersToDelete.map(u => u.id);
        console.log(`Found ${userIds.length} users to delete.`);

        if (userIds.length === 0) {
            console.log('No users to delete.');
            return;
        }

        // 2. Delete related records in order
        console.log('Deleting related records...');

        // Evaluations depend on Interviews
        await prisma.evaluation.deleteMany({});
        
        // Interviews depend on Applications and Interviewers
        await prisma.interview.deleteMany({});
        
        // Results depend on Students
        await prisma.result.deleteMany({});
        
        // Applications depend on Students
        await prisma.application.deleteMany({});
        
        // Students and Interviewers depend on Users
        await prisma.student.deleteMany({
            where: { userId: { in: userIds } }
        });
        
        await prisma.interviewer.deleteMany({
            where: { userId: { in: userIds } }
        });

        // Notifications depend on Users
        await prisma.notification.deleteMany({
            where: { userId: { in: userIds } }
        });

        // 3. Finally delete the users
        const deleted = await prisma.user.deleteMany({
            where: {
                id: { in: userIds }
            }
        });

        console.log(`Successfully deleted ${deleted.count} users and all their related data.`);
    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupUsers();
