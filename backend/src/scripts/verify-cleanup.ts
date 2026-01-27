import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
    try {
        const studentCount = await prisma.student.count();
        const studentUserCount = await prisma.user.count({ where: { role: 'STUDENT' } });
        const appCount = await prisma.application.count();
        const interviewCount = await prisma.interview.count();
        const evalCount = await prisma.evaluation.count();
        const resultCount = await prisma.result.count();
        const notificationCount = await prisma.notification.count({
            where: { user: { role: 'STUDENT' } }
        });

        console.log('--- VERIFICATION RESULTS ---');
        console.log('Students:', studentCount);
        console.log('Student Users:', studentUserCount);
        console.log('Applications:', appCount);
        console.log('Interviews:', interviewCount);
        console.log('Evaluations:', evalCount);
        console.log('Results:', resultCount);
        console.log('Student Notifications:', notificationCount);
        console.log('---------------------------');
    } catch (e) {
        console.error('Verification failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}
check();
