import prisma from '../config/db.js';

async function checkNotifications() {
    console.log('--- Checking Recent Notifications ---');
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                type: 'WHATSAPP'
            },
            orderBy: {
                sentAt: 'desc'
            },
            take: 20
        });

        if (notifications.length === 0) {
            console.log('No WhatsApp notifications found in the database.');
            return;
        }

        console.log(`\nFound ${notifications.length} WhatsApp notifications:\n`);
        
        notifications.forEach(notif => {
            console.log(`ID: ${notif.id}`);
            console.log(`Event: ${notif.event}`);
            console.log(`Status: ${notif.status}`);
            console.log(`Error: ${notif.error || 'None'}`);
            console.log(`Target User ID: ${notif.userId}`);
            console.log(`Sent At: ${notif.sentAt}`);
            console.log(`Message: ${notif.message.substring(0, 100)}...`);
            console.log('-'.repeat(40));
        });

    } catch (error) {
        console.error('Failed to check notifications:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkNotifications();
