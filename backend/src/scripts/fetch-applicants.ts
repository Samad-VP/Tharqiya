import prisma from '../config/db.js';

async function fetchApplicants() {
    console.log('--- Fetching Applicant Data ---');
    try {
        const students = await prisma.student.findMany({
            include: {
                application: true,
                user: {
                    select: {
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        if (students.length === 0) {
            console.log('No applicants found in the database.');
            return;
        }

        console.log(`\nFound ${students.length} applicants:\n`);
        
        // Print header
        const header = "Name | App No | Status | Email | Place | District";
        console.log(header);
        console.log("-".repeat(header.length));

        students.forEach(student => {
            const row = `${student.name.padEnd(20)} | ${student.applicationNo.padEnd(8)} | ${student.status.padEnd(15)} | ${student.user?.email || 'N/A'} | ${student.place || 'N/A'} | ${student.district || 'N/A'}`;
            console.log(row);
        });

    } catch (error) {
        console.error('Failed to fetch applicants:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fetchApplicants();
