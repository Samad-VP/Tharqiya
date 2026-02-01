import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyStats() {
    console.log('--- Verifying Dashboard Statistics ---');

    // 1. Total Applications
    const totalApplications = await prisma.application.count();
    console.log(`Total Applications: ${totalApplications}`);

    // 2. Pending Allotment (EVALUATED or ALLOTMENT_READY)
    const pendingAllotment = await prisma.application.count({
        where: {
            status: { in: ['EVALUATED', 'ALLOTMENT_READY'] }
        }
    });
    console.log(`Pending Allotment: ${pendingAllotment}`);

    // 3. Finalized Seats
    const finalizedSeats = await prisma.allotment.count({
        where: { isFinalized: true }
    });
    console.log(`Finalized Seats: ${finalizedSeats}`);

    // 4. Average Interview Score
    const resultAgg = await prisma.result.aggregate({ _avg: { averageMarks: true } });
    const averageScore = resultAgg._avg.averageMarks?.toFixed(1) || '0.0';
    console.log(`Average Interview Score (from Results): ${averageScore}`);

    // 5. Admin Dashboard - Pending Review (PENDING)
    const pendingReviewAdmin = await prisma.application.count({
        where: { status: 'PENDING' }
    });
    console.log(`Admin Pending Review (PENDING): ${pendingReviewAdmin}`);

    console.log('--- Verification Complete ---');
}

verifyStats()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
