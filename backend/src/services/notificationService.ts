import nodemailer from 'nodemailer';
import axios from 'axios';
import prisma from '../config/db.js';
import { NOTIFICATION_TEMPLATES, EMAIL_ROLES, NotificationData, EmailRole } from '../templates/notificationTemplates.js';
import { sendBrevoEmail, Department } from './mailer.js';

// Map existing EmailRole from templates to Mailer Department
const mapRoleToDepartment = (role: EmailRole): Department => {
    const map: Record<EmailRole, Department> = {
        ADMISSIONS: 'ADMISSIONS',
        SUPPORT: 'SUPPORT',
        INFO: 'INFO',
        PRINCIPAL: 'PRINCIPAL',
        ADMIN: 'ADMIN'
    };
    return map[role] || 'INFO';
};

export const sendEmail = async (to: string, event: string, data: NotificationData) => {
    const templateConfig = NOTIFICATION_TEMPLATES[event]?.email;
    if (!templateConfig) throw new Error(`Email template for ${event} not found`);

    const roleKey: EmailRole = templateConfig.roleKey || 'ADMISSIONS';
    const department = mapRoleToDepartment(roleKey);
    
    const fromName = templateConfig.fromName;
    const fromEmail = templateConfig.fromEmail;
    const html = templateConfig.template(data);
    const text = templateConfig.textTemplate ? templateConfig.textTemplate(data) : undefined;
    const subject = templateConfig.subject;

    try {
        const result = await sendBrevoEmail({
            to,
            subject,
            html,
            text,
            department,
            fromName,
            fromEmail,
        });

        if (result.success) {
            return { success: true, message: html, sender: EMAIL_ROLES[roleKey] };
        } else {
            throw new Error(result.error);
        }
    } catch (error: any) {
        console.error(`[EMAIL ERROR] [Event: ${event}] ${error.message}`);
        return { success: false, error: error.message, message: html, sender: EMAIL_ROLES[roleKey] };
    }
};

export const sendWhatsApp = async (phone: string, event: string, data: NotificationData) => {
    const template = NOTIFICATION_TEMPLATES[event]?.whatsapp;
    if (!template) throw new Error(`WhatsApp template for ${event} not found`);

    const message = typeof template === 'function' ? template(data) : template;
    
    try {
        // Correct Green-API endpoint construction
        // Standard: https://api.green-api.com/waInstance{{idInstance}}/sendMessage/{{apiTokenInstance}}
        const baseUrl = process.env.WHATSAPP_API_URL?.replace(/\/$/, '') || 'https://api.green-api.com';
        const idInstance = process.env.WHATSAPP_ID_INSTANCE;
        const apiToken = process.env.WHATSAPP_API_TOKEN;

        const url = `${baseUrl}/waInstance${idInstance}/sendMessage/${apiToken}`;
        let cleanPhone = phone.replace(/\D/g, '');
        
        // Ensure country code (Default to 91 for India if 10 digits)
        if (cleanPhone.length === 10) {
            cleanPhone = `91${cleanPhone}`;
        }
        
        const chatId = `${cleanPhone}@c.us`;

        console.log(`[WHATSAPP] Sending to ${chatId}...`);
        const response = await axios.post(url, { chatId, message });
        
        console.log(`[WHATSAPP SUCCESS] Response:`, response.data);
        return { success: true, response: response.data, message };
    } catch (error: any) {
        console.error(`[WHATSAPP ERROR] [Event: ${event}] ${error.message}`);
        if (error.response) {
            console.error(`[WHATSAPP ERROR DATA]`, error.response.data);
        }
        return { success: false, error: error.message, message };
    }
};


export const triggerNotification = async (
    userId: string, 
    event: string, 
    data: NotificationData,
    background: boolean = false
) => {
    if (background) {
        // Run in the background without blocking the caller
        setImmediate(async () => {
            try {
                await processNotification(userId, event, data);
            } catch (err: any) {
                console.error(`[BACKGROUND NOTIFICATION ERROR] ${err.message}`);
            }
        });
        return;
    }

    return await processNotification(userId, event, data);
};

// Internal logic moved to processNotification to allow both sync and async calls
const processNotification = async (
    userId: string, 
    event: string, 
    data: NotificationData
) => {
    console.log(`[TRIGGER] Event: ${event} for Target: ${userId}`);
    
    // Handle Admin Alerts specifically
    if (event === 'ADMIN_ALERT') {
        const adminEmail = process.env.EMAIL_ADMIN || EMAIL_ROLES.ADMIN;
        const result = await sendEmail(adminEmail, event, data);
        await logNotification(null, 'EMAIL', event, result.message || JSON.stringify(data), result.success ? 'SENT' : 'FAILED', result.error, data, result.sender);
        return;
    }

    const user = (userId && typeof userId === 'string' && userId !== 'SYSTEM_ADMIN_PLACEHOLDER') 
        ? await prisma.user.findUnique({ where: { id: userId } })
        : null;

    if (!user) {
        console.warn(`[TRIGGER] Valid User ID not provided or user not found: ${userId}`);
        return;
    }

    const eventConfig = NOTIFICATION_TEMPLATES[event];
    if (!eventConfig) {
        console.warn(`[TRIGGER] Event config for ${event} not found`);
        return;
    }

    // 1. Send Email
    if (eventConfig.email && user.email) {
        if (user.emailNotificationsEnabled) {
            const result = await sendEmail(user.email, event, data);
            const logMessage = result.success ? (result.message || JSON.stringify(data)) : JSON.stringify(data);
            await logNotification(userId, 'EMAIL', event, logMessage, result.success ? 'SENT' : 'FAILED', result.error, data, result.sender);
        } else {
            console.log(`[TRIGGER] Email skipped for user ${userId} (User Preference)`);
        }
    }

    // 2. Send WhatsApp
    if (eventConfig.whatsapp && user.phone) {
        if (user.whatsappNotificationsEnabled) {
            const waResult = await sendWhatsApp(user.phone, event, data);
            const logMessage = waResult.success ? (waResult.message || JSON.stringify(data)) : JSON.stringify(data);
            await logNotification(userId, 'WHATSAPP', event, logMessage, waResult.success ? 'SENT' : 'FAILED', waResult.error, data);
        } else {
            console.log(`[TRIGGER] WhatsApp skipped for user ${userId} (User Preference)`);
        }
    }
};

export const logNotification = async (
    userId: string | null, 
    channel: string, 
    event: string, 
    message: string, 
    status: string,
    error?: string,
    data?: any,
    senderEmail?: string,
    triggeredBy: 'SYSTEM' | 'ADMIN' = 'SYSTEM',
    adminId?: string
) => {
    try {
        console.log(`[AUDIT] Logging ${event} (${channel}). Structured Data: ${!!data}`);
        
        await prisma.notification.create({
            data: {
                userId: userId || undefined,
                type: channel,
                event,
                message: message.substring(0, 5000), 
                data: data || {}, // Ensure we never store null if possible
                status,
                error: error || undefined,
                senderEmail: senderEmail || undefined,
                triggeredBy,
                adminId: adminId || undefined
            }
        });
    } catch (dbError) {
        console.error(`[DB ERROR] Failed to log notification:`, dbError);
    }
};
