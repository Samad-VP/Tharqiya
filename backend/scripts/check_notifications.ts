import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function checkNotifications() {
  let output = '';
  try {
    const totalCount = await prisma.notification.count();
    output += `Total Notifications: ${totalCount}\n\n`;

    const emailCount = await prisma.notification.count({ where: { type: 'EMAIL' } });
    output += `Email Notifications: ${emailCount}\n\n`;

    const failedEmailCount = await prisma.notification.count({ where: { type: 'EMAIL', status: 'FAILED' } });
    output += `Failed Email Notifications: ${failedEmailCount}\n\n`;

    const notifications = await prisma.notification.findMany({
      where: {
        type: 'EMAIL',
      },
      orderBy: {
        sentAt: 'desc',
      },
      take: 5,
    });

    output += '--- Recent Email Notifications ---\n';
    output += JSON.stringify(notifications, null, 2) + '\n';

    fs.writeFileSync('scripts/notification_check_output.txt', output);
    console.log('Output written to scripts/notification_check_output.txt');

  } catch (error) {
    const errorMsg = `Error fetching notifications: ${error.message}\n${error.stack}`;
    fs.writeFileSync('scripts/notification_check_output.txt', errorMsg);
    console.error(errorMsg);
  } finally {
    await prisma.$disconnect();
  }
}

checkNotifications();
