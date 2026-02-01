
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Resetting application statuses...');

    const result = await prisma.application.updateMany({
        where: {
            student: {
                applicationNo: {
                    not: 'TQ-2026-0001'
                }
            }
        },
        data: {
            status: 'PENDING'
        }
    });

    console.log(`Reset ${result.count} applications to PENDING status.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
