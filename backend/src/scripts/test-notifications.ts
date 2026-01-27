import 'dotenv/config';
import prisma from '../config/db.js';
import fs from 'fs';

async function testNotifications() {
    const logFile = 'test_output.txt';
    const log = (msg: string) => {
        console.log(msg);
        fs.appendFileSync(logFile, msg + '\n');
    };

    if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

    try {
        log('Attempting to query notifications...');
        const logs = await prisma.notification.findMany({
            orderBy: {
                sentAt: 'desc'
            },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            take: 10
        });
        log('Query successful!');
        log('Logs count: ' + logs.length);
        log('Sample logs: ' + JSON.stringify(logs, null, 2));
    } catch (error: any) {
        log('Query failed!');
        log(error.message || 'Unknown error');
        log(error.stack || '');
    } finally {
        await prisma.$disconnect();
    }
}

testNotifications();
