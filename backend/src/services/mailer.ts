import nodemailer from 'nodemailer';

/**
 * Brevo SMTP Configuration
 * SMTP_HOST: smtp-relay.brevo.com
 * SMTP_PORT: 587
 * SMTP_USER: apikey
 * SMTP_PASS: <BREVO_SMTP_KEY>
 */

const port = parseInt(process.env.SMTP_PORT || '587');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: port,
    secure: port === 465, // 465 is SSL, 587 is STARTTLS (secure: false)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
    }
});

export type Department = 'ADMIN' | 'ADMISSIONS' | 'SUPPORT' | 'INFO' | 'PRINCIPAL';

const DEPARTMENT_EMAILS: Record<Department, string> = {
    ADMIN: process.env.EMAIL_ADMIN || 'admin@darussalameduvillage.com',
    ADMISSIONS: process.env.EMAIL_ADMISSIONS || 'admissions@darussalameduvillage.com',
    SUPPORT: process.env.EMAIL_SUPPORT || 'support@darussalameduvillage.com',
    INFO: process.env.EMAIL_INFO || 'info@darussalameduvillage.com',
    PRINCIPAL: process.env.EMAIL_PRINCIPAL || 'principal@darussalameduvillage.com',
};

const DEPARTMENT_NAMES: Record<Department, string> = {
    ADMIN: 'Darussalam Edu Village Admin',
    ADMISSIONS: 'Darussalam Edu Village Admissions',
    SUPPORT: 'Darussalam Edu Village Support',
    INFO: 'Darussalam Edu Village Info',
    PRINCIPAL: 'Office of the Principal – Darussalam Edu Village',
};

interface SendEmailOptions {
    to: string;
    subject: string;
    html?: string;
    text?: string;
    department?: Department;
    fromName?: string;
    fromEmail?: string;
    replyTo?: string;
}

/**
 * Core function to send emails via Brevo SMTP
 */
export const sendBrevoEmail = async ({
    to,
    subject,
    html,
    text,
    department = 'INFO',
    fromName: fromNameOverride,
    fromEmail: fromEmailOverride,
    replyTo
}: SendEmailOptions) => {
    const fromEmail = fromEmailOverride || DEPARTMENT_EMAILS[department];
    const fromName = fromNameOverride || DEPARTMENT_NAMES[department];

    try {
        console.log(`[BREVO SMTP] Attempting to send ${subject} to ${to} from ${fromName} <${fromEmail}>...`);
        
        const info = await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to,
            subject,
            html,
            text,
            replyTo: replyTo || fromEmail,
        });

        console.log(`[BREVO SUCCESS] Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`[BREVO ERROR] Failed to send email to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

export default transporter;
