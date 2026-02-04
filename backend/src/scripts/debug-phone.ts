import prisma from '../config/db.js';

async function main() {
    try {
        const students = await prisma.student.findMany({
            select: {
                name: true,
                whatsapp: true,
                applicationNo: true,
                user: {
                    select: {
                        phone: true,
                        whatsapp: true
                    }
                }
            }
        });

        console.log('--- Student/User Contact Details ---');
        students.forEach(s => {
            console.log(`Name: ${s.name}`);
            console.log(`App No: ${s.applicationNo}`);
            console.log(`Student WhatsApp: ${s.whatsapp}`);
            console.log(`User Phone: ${s.user?.phone}`);
            console.log(`User WhatsApp: ${s.user?.whatsapp}`);
            console.log('-'.repeat(30));
        });
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
