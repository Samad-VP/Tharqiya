import axios from 'axios';

/**
 * Brevo API Configuration
 * API URL: https://api.brevo.com/v3/smtp/email
 * Using REST API instead of SMTP to bypass cloud provider (Render) firewall blocks on Port 587/465.
 */

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
 * Core function to send emails via Brevo REST API
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
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
        console.error('[BREVO ERROR] API Key missing');
        return { success: false, error: 'Brevo API Key is missing in environment variables' };
    }

    try {
        console.log(`[BREVO API] Attempting to send ${subject} to ${to} from ${fromName} <${fromEmail}>...`);
        
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { name: fromName, email: fromEmail },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html,
                textContent: text,
                replyTo: { email: replyTo || fromEmail }
            },
            {
                headers: {
                    'api-key': apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        console.log(`[BREVO SUCCESS] Message ID: ${response.data.messageId}`);
        return { success: true, messageId: response.data.messageId };
    } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message;
        console.error(`[BREVO ERROR] Failed to send email to ${to}:`, errorMsg);
        return { success: false, error: errorMsg };
    }
};

export default { sendBrevoEmail };
