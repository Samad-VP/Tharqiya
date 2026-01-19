import prisma from '../config/db';

/**
 * Send a notification to a user
 * @param {string} userId 
 * @param {string} type - 'WHATSAPP' or 'EMAIL'
 * @param {string} event - 'REGISTRATION', 'INTERVIEW_SCHEDULED', etc.
 * @param {string} message 
 */
export const sendNotification = async (userId: string, type: string, event: string, message: string): Promise<void> => {
    try {
        // In a real app, integrate with Twilio (WhatsApp) or SendGrid/Nodemailer (Email)
        console.log(`Sending ${type} to User ${userId} for ${event}: ${message}`);

        await prisma.notification.create({
            data: {
                userId,
                type,
                event,
                message,
                status: 'SENT',
            }
        });
    } catch (error) {
        console.error('Notification error:', error);
    }
};
