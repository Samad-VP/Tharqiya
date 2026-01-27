import nodemailer from 'nodemailer';
import axios from 'axios';
import prisma from '../config/db.js';
import { NOTIFICATION_TEMPLATES, EMAIL_ROLES, NotificationData, EmailRole } from '../templates/notificationTemplates.js';

const createTransporter = (roleKey: EmailRole) => {
    // For now, all roles share the same SMTP server but different 'from' identities
    // This allows centralized control with dynamic sender info
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const defaultTransporter = createTransporter('ADMISSIONS');

const sendEmail = async (to: string, event: string, data: NotificationData) => {
    const templateConfig = NOTIFICATION_TEMPLATES[event]?.email;
    if (!templateConfig) throw new Error(`Email template for ${event} not found`);

    const roleKey: EmailRole = templateConfig.roleKey || 'ADMISSIONS';
    const fromEmail = EMAIL_ROLES[roleKey];
    const fromName = templateConfig.fromName || 'Darussalam Edu Village';

    const html = templateConfig.template(data);
    const subject = templateConfig.subject;

    try {
        await defaultTransporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to,
            subject,
            html,
        });
        return { success: true };
    } catch (error: any) {
        console.error(`[EMAIL ERROR] [Role: ${roleKey}] ${error.message}`);
        return { success: false, error: error.message };
    }
};

const sendWhatsApp = async (phone: string, event: string, data: NotificationData) => {
    const template = NOTIFICATION_TEMPLATES[event]?.whatsapp;
    if (!template) throw new Error(`WhatsApp template for ${event} not found`);

    const message = typeof template === 'function' ? template(data) : template;
    
    try {
        const url = `${process.env.WHATSAPP_API_URL}/waInstance${process.env.WHATSAPP_ID_INSTANCE}/sendMessage/${process.env.WHATSAPP_API_TOKEN}`;
        const cleanPhone = phone.replace(/\D/g, '');
        const chatId = `${cleanPhone}@c.us`;

        const response = await axios.post(url, { chatId, message });
        return { success: true, response: response.data };
    } catch (error: any) {
        console.error(`[WHATSAPP ERROR] ${error.message}`);
        return { success: false, error: error.message };
    }
};


export const triggerNotification = async (
    userId: string, 
    event: string, 
    data: NotificationData
) => {
    console.log(`[TRIGGER] Event: ${event} for Target: ${userId}`);
    
    // Handle Admin Alerts specifically
    if (event === 'ADMIN_ALERT') {
        const adminEmail = process.env.EMAIL_ADMIN || EMAIL_ROLES.ADMIN;
        const result = await sendEmail(adminEmail, event, data);
        await logNotification('SYSTEM', 'EMAIL', event, JSON.stringify(data), result.success ? 'SENT' : 'FAILED', result.error);
        return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        console.warn(`[TRIGGER] User ${userId} not found`);
        return;
    }

    const eventConfig = NOTIFICATION_TEMPLATES[event];
    if (!eventConfig) {
        console.warn(`[TRIGGER] Event config for ${event} not found`);
        return;
    }

    // 1. Send Email
    if (eventConfig.email && user.email) {
        const result = await sendEmail(user.email, event, data);
        await logNotification(userId, 'EMAIL', event, JSON.stringify(data), result.success ? 'SENT' : 'FAILED', result.error);
    }

    // 2. Send WhatsApp
    if (eventConfig.whatsapp && user.phone) {
        const waResult = await sendWhatsApp(user.phone, event, data);
        
        if (waResult.success) {
            await logNotification(userId, 'WHATSAPP', event, JSON.stringify(data), 'SENT');
        } else {
            await logNotification(userId, 'WHATSAPP', event, JSON.stringify(data), 'FAILED', waResult.error);
        }
    }
};

const logNotification = async (
    userId: string, 
    channel: string, 
    event: string, 
    message: string, 
    status: string,
    error?: string
) => {
    try {
        await prisma.notification.create({
            data: {
                userId,
                type: channel,
                event,
                message: message.substring(0, 5000), // Safety cap
                status,
                // error // 'error' is not in the schema I saw earlier?? Let's check schema again.
            }
        });
    } catch (dbError) {
        console.error(`[DB ERROR] Failed to log notification:`, dbError);
    }
};
