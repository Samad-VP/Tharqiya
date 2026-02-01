
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding campuses...');

    // Clear existing campuses to avoid mismatch
    await prisma.campus.deleteMany();

    const campuses = [
        { name: 'Darussalam Tharqiyathul Huffaz, Darussalam Edu Village, Muchukunnu', maxSeats: 50 },
        { name: 'Shamsul Ulama Tharqiyathul Huffaz, Mannarkkad, Palakkad', maxSeats: 30 },
        { name: 'Umariyya Tharqiyathul Huffaz, Athinjal, Kanjangad', maxSeats: 30 }
    ];

    for (const c of campuses) {
        await prisma.campus.create({
            data: c
        });
    }

    console.log('Campuses seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
