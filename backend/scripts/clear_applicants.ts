import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting clear_applicants script...');

    try {
        // 1. Find all Students
        console.log('Fetching students...');
        const students = await prisma.student.findMany({
            include: { user: true }
        });

        const studentIds = students.map(s => s.id);
        const userIds = students.map(s => s.userId).filter(id => id !== null) as string[];

        console.log(`Found ${students.length} students and ${userIds.length} linked users.`);

        // 2. Clear related data (Bottom-up approach)
        
        // Delete Evaluations
        // We need to find interviews related to these students first, or just delete all evaluations if strictly linked to admission interviews.
        // Safer: Find applications -> interviews -> evaluations.
        const applications = await prisma.application.findMany({
            where: { studentId: { in: studentIds } },
            select: { id: true }
        });
        const appIds = applications.map(a => a.id);

        const interviews = await prisma.interview.findMany({
            where: { applicationId: { in: appIds } },
            select: { id: true }
        });
        const interviewIds = interviews.map(i => i.id);

        console.log(`Deleting Evaluations for ${interviewIds.length} interviews...`);
        await prisma.evaluation.deleteMany({
            where: { interviewId: { in: interviewIds } }
        });

        // Delete Interviews
        console.log(`Deleting ${interviewIds.length} Interviews...`);
        await prisma.interview.deleteMany({
            where: { id: { in: interviewIds } }
        });

        // Delete Allotments
        console.log('Deleting Allotments...');
        await prisma.allotment.deleteMany({
            where: { applicationId: { in: appIds } }
        });

        // Delete Applications
        console.log(`Deleting ${appIds.length} Applications...`);
        await prisma.application.deleteMany({
            where: { id: { in: appIds } }
        });

        // Delete Results
        console.log('Deleting Results...');
        await prisma.result.deleteMany({
            where: { studentId: { in: studentIds } }
        });

        // Delete Notifications for these Users
        console.log('Deleting Member Notifications...');
        await prisma.notification.deleteMany({
            where: { userId: { in: userIds } }
        });
        
        // Delete AuditLogs by these Users
        console.log('Deleting Member AuditLogs...');
        await prisma.auditLog.deleteMany({
            where: { actorId: { in: userIds } }
        });

        // Delete Students
        console.log(`Deleting ${students.length} Students...`);
        await prisma.student.deleteMany({
            where: { id: { in: studentIds } }
        });

        // Delete Users (Only if role is STUDENT to be extra safe, though we gathered IDs from Student records)
        console.log(`Deleting ${userIds.length} Users...`);
        await prisma.user.deleteMany({
            where: { 
                id: { in: userIds },
                role: 'STUDENT' 
            }
        });

        // Also clean up any orphan users with role STUDENT that might not have Student records (if any)
        console.log('Cleaning up any orphan STUDENT users...');
        const orphans = await prisma.user.deleteMany({
            where: { role: 'STUDENT' }
        });
        console.log(`Deleted ${orphans.count} orphan student users.`);

        console.log('✅ Successfully cleared all applicant data.');

    } catch (error) {
        console.error('Error clearing data:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
