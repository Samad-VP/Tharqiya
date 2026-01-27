import prisma from '../config/db.js';

async function cleanupStudents() {
    console.log('--- Starting Student Data Cleanup ---');
    try {
        // 1. Get all user IDs that are STUDENTS
        const studentsToDelete = await prisma.user.findMany({
            where: {
                role: 'STUDENT'
            },
            select: { id: true, name: true }
        });

        const studentUserIds = studentsToDelete.map(u => u.id);
        console.log(`Found ${studentUserIds.length} students to delete.`);

        if (studentUserIds.length === 0) {
            console.log('No student data found to delete.');
            return;
        }

        // 2. Delete related records in order
        console.log('Deleting related records...');

        // Evaluations depend on Interviews
        await prisma.evaluation.deleteMany({});
        
        // Interviews depend on Applications
        await prisma.interview.deleteMany({});
        
        // Results depend on Students (studentId is unique)
        await prisma.result.deleteMany({});
        
        // Applications depend on Students
        await prisma.application.deleteMany({});
        
        // Students depend on Users
        const deletedStudents = await prisma.student.deleteMany({
            where: { userId: { in: studentUserIds } }
        });
        console.log(`Deleted ${deletedStudents.count} student profiles.`);

        // Notifications depend on Users
        await prisma.notification.deleteMany({
            where: { userId: { in: studentUserIds } }
        });

        // 3. Finally delete the users with role STUDENT
        const deletedUsers = await prisma.user.deleteMany({
            where: {
                id: { in: studentUserIds },
                role: 'STUDENT'
            }
        });

        console.log(`Successfully deleted ${deletedUsers.count} student users and all their associated data.`);
    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupStudents();
