export interface NotificationData {
  StudentName?: string;
  ApplicationID?: string;
  InterviewDate?: string;
  InterviewTime?: string;
  CampusName?: string;
  RescheduleReason?: string;
  TotalMarks?: string;
  Decision?: string;
  Location?: string;
  SupportEmail?: string;
  Username?: string;
  TempPassword?: string;
  LoginUrl?: string;
  Mode?: string; // Online / On-Campus
}

export type EmailRole = 'ADMISSIONS' | 'SUPPORT' | 'INFO' | 'PRINCIPAL' | 'ADMIN';

export const EMAIL_ROLES: Record<EmailRole, string> = {
  ADMISSIONS: process.env.EMAIL_ADMISSIONS || 'admissions@darussalameduvillage.com',
  SUPPORT: process.env.EMAIL_SUPPORT || 'support@darussalameduvillage.com',
  INFO: process.env.EMAIL_INFO || 'info@darussalameduvillage.com',
  PRINCIPAL: process.env.EMAIL_PRINCIPAL || 'principal@darussalameduvillage.com',
  ADMIN: process.env.EMAIL_ADMIN || 'admin@darussalameduvillage.com',
};

const ISLAMIC_GREETING_AR = "السلام عليكم ورحمة الله وبركاته";
const ISLAMIC_CLOSING_AR = "جزاكم الله خيرًا";

const LOGIN_URL = "https://darussalameduvillage.com/login";

// Brand Colors from Website Theme
const BRAND_TEAL = '#5FB2C0';
const BRAND_CORAL = '#EE6D52';
const BRAND_CREAM = '#FDF5E6';
const BRAND_DEEP = '#4A4A4A';
const BRAND_TEXT = '#1e293b';
const BRAND_SLATE = '#64748b';

export const NOTIFICATION_TEMPLATES: Record<string, any> = {
  APPLICATION_RECEIVED: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
      fromEmail: process.env.EMAIL_ADMISSIONS || 'admissions@darussalameduvillage.com',
      subject: "Application Received – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${BRAND_TEAL}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Welcome to Darussalam Edu Village</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; font-weight: bold; color: ${BRAND_TEAL}; margin-bottom: 24px;">${ISLAMIC_GREETING_AR}</p>
            <p>Dear <strong>${data.StudentName}</strong>,</p>
            <p>We are pleased to confirm that your application for the <strong>Tharqiya Course</strong> has been received successfully.</p>
            <p>Your applicant profile has been created. You may log in using the details below:</p>
            
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #f1f5f9; margin: 24px 0;">
              <p style="margin-top: 0;"><strong>Applicant Portal:</strong><br>
              <a href="${LOGIN_URL}" style="color: ${BRAND_TEAL}; text-decoration: none; font-weight: bold;">${LOGIN_URL}</a></p>
              <p><strong>Username:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${data.Username}</code></p>
              <p style="margin-bottom: 0;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${data.TempPassword}</code></p>
            </div>

            <div style="background-color: #fff7ed; padding: 16px; border-radius: 8px; border-left: 4px solid #f97316; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 14px; color: #9a3412;"><strong>⚠️ Security Notice:</strong> For your protection, never share your login credentials with anyone. Please log in immediately and change your temporary password.</p>
            </div>

            <p>You will receive further updates regarding review, interviews, and results through this portal and via email.</p>
            
            <p>For any assistance, contact us at:<br>
            📧 <a href="mailto:admissions@darussalameduvillage.com" style="color: ${BRAND_TEAL}; text-decoration: none;">admissions@darussalameduvillage.com</a></p>

            <p style="margin-top: 32px; font-weight: bold; color: ${BRAND_TEAL};">${ISLAMIC_CLOSING_AR}</p>
            <p style="margin: 0; font-weight: 800; color: #1e293b;">Admissions Office</p>
            <p style="margin: 0; font-size: 14px; color: ${BRAND_SLATE};">Darussalam Edu Village</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
          </div>
        </div>
      `
    },
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Darussalam Edu Village: Your application for the Tharqiya Course is successfully received. 
*Application ID:* ${data.ApplicationID}

${ISLAMIC_CLOSING_AR}`.trim(),
  },

  APPLICATION_SUBMITTED_SUCCESSFULLY: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
      subject: "Application Submitted Successfully – Tharqiya Course",
      template: (data: NotificationData) => NOTIFICATION_TEMPLATES.APPLICATION_RECEIVED.email.template(data)
    }
  },

  APPLICATION_CREDENTIALS_CREATED: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Account Services',
      fromEmail: process.env.EMAIL_ADMIN || 'admin@darussalameduvillage.com',
      subject: "Portal Access Credentials – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${BRAND_TEAL}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Portal Access</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; font-weight: bold; color: ${BRAND_TEAL}; margin-bottom: 24px;">${ISLAMIC_GREETING_AR}</p>
            <p>Dear <strong>${data.StudentName}</strong>,</p>
            <p>An applicant profile has been created for you on the <strong>Darussalam Tharqiya Portal</strong>. You can use the credentials below to log in and track your application status.</p>
            
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #f1f5f9; margin: 24px 0;">
              <p style="margin-top: 0;"><strong>Login Portal:</strong><br>
              <a href="${LOGIN_URL}" style="color: ${BRAND_TEAL}; text-decoration: none; font-weight: bold;">${LOGIN_URL}</a></p>
              <p><strong>Username:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${data.Username}</code></p>
              <p style="margin-bottom: 0;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${data.TempPassword}</code></p>
            </div>

            <div style="background-color: #fff7ed; padding: 16px; border-radius: 8px; border-left: 4px solid #f97316; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 14px; color: #9a3412;"><strong>⚠️ Security Notice:</strong> Please log in and change your password immediately upon access.</p>
            </div>

            <p>For any assistance, contact the support team at:<br>
            📧 <a href="mailto:support@darussalameduvillage.com" style="color: ${BRAND_TEAL}; text-decoration: none;">support@darussalameduvillage.com</a></p>

            <p style="margin-top: 32px; font-weight: bold; color: ${BRAND_TEAL};">${ISLAMIC_CLOSING_AR}</p>
            <p style="margin: 0; font-weight: 800; color: #1e293b;">Account Services</p>
            <p style="margin: 0; font-size: 14px; color: ${BRAND_SLATE};">Darussalam Edu Village</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
          </div>
        </div>
      `
    }
  },

  APPLICATION_UNDER_REVIEW: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
      fromEmail: process.env.EMAIL_ADMISSIONS || 'admissions@darussalameduvillage.com',
      subject: "Application Under Review – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Your application is currently under review by the admissions committee.</p>
          <p>No action is required from your side at this moment.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Admissions Office</strong><br>Darussalam Edu Village</p>
        </div>
      `
    }
  },

  APPLICATION_APPROVED_FOR_INTERVIEW: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
      fromEmail: process.env.EMAIL_ADMISSIONS || 'admissions@darussalameduvillage.com',
      subject: "Application Selected for Interview – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${BRAND_TEAL}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Selection Update</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; font-weight: bold; color: ${BRAND_TEAL}; margin-bottom: 24px;">${ISLAMIC_GREETING_AR}</p>
            <p>Dear <strong>${data.StudentName}</strong>,</p>
            <p>We are pleased to inform you that your application for the <strong>Tharqiya Course</strong> has been approved for the next stage: <strong>The Interview</strong>.</p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #dcfce7; margin: 24px 0;">
              <p style="margin: 0; color: #166534;"><strong>Congratulations!</strong> You have been selected from a large pool of applicants based on your profile and qualifications.</p>
            </div>

            <p><strong>Next Steps:</strong><br>
            You will receive your specific interview schedule (Date, Time, and Mode) via email and WhatsApp shortly. Please ensure your portal access is active.</p>

            ${data.Username ? `<p style="font-size: 14px; color: ${BRAND_SLATE}; margin-bottom: 24px;"><strong>Portal Username:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${data.Username}</code></p>` : ''}

            <div style="text-align: center; margin: 32px 0;">
              <a href="${LOGIN_URL}" style="background-color: ${BRAND_TEAL}; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">View Status on Portal</a>
            </div>

            <p style="margin-top: 32px; font-weight: bold; color: ${BRAND_TEAL};">${ISLAMIC_CLOSING_AR}</p>
            <p style="margin: 0; font-weight: 800; color: #1e293b;">Admissions Office</p>
            <p style="margin: 0; font-size: 14px; color: ${BRAND_SLATE};">Darussalam Edu Village</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
          </div>
        </div>
      `
    },
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Darussalam Edu Village: Your application has been selected for an interview. Stay tuned for your schedule.

${ISLAMIC_CLOSING_AR}`.trim(),
  },

  APPLICATION_REJECTED: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
      fromEmail: process.env.EMAIL_ADMISSIONS || 'admissions@darussalameduvillage.com',
      subject: "Application Status Update – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${BRAND_SLATE}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Application Update</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; font-weight: bold; color: ${BRAND_SLATE}; margin-bottom: 24px;">${ISLAMIC_GREETING_AR}</p>
            <p>Dear <strong>${data.StudentName}</strong>,</p>
            <p>Thank you for your interest in the <strong>Tharqiya Course</strong> at Darussalam Edu Village.</p>
            
            <p>After careful consideration and review of a high volume of applications, we regret to inform you that we are unable to offer you a position in the current batch.</p>

            <p>We appreciate the time and effort you put into your application and wish you the very best in your future academic and spiritual endeavors.</p>

            <p style="margin-top: 32px; font-weight: bold; color: ${BRAND_SLATE};">${ISLAMIC_CLOSING_AR}</p>
            <p style="margin: 0; font-weight: 800; color: #1e293b;">Admissions Office</p>
            <p style="margin: 0; font-size: 14px; color: ${BRAND_SLATE};">Darussalam Edu Village</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
          </div>
        </div>
      `
    }
  },

  INTERVIEW_SCHEDULED: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
      fromEmail: process.env.EMAIL_ADMISSIONS || 'admissions@darussalameduvillage.com',
      subject: "Interview Scheduled – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${BRAND_CORAL}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Interview Schedule</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; font-weight: bold; color: ${BRAND_CORAL}; margin-bottom: 24px;">${ISLAMIC_GREETING_AR}</p>
            <p>Dear <strong>${data.StudentName}</strong>,</p>
            <p>Your interview for the <strong>Tharqiya Course</strong> has been scheduled. Please find the details below:</p>
            
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #f1f5f9; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND_SLATE}; width: 100px;"><strong>Date:</strong></td>
                  <td style="padding: 8px 0; color: #1e293b;">${data.InterviewDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND_SLATE};"><strong>Time:</strong></td>
                  <td style="padding: 8px 0; color: #1e293b;">${data.InterviewTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND_SLATE};"><strong>Mode:</strong></td>
                  <td style="padding: 8px 0; color: #1e293b;">${data.Mode || 'On-Campus'}</td>
                </tr>
              </table>
            </div>

            <p><strong>Important Instructions:</strong><br>
            Please log in to your profile for full guidelines and to confirm your attendance. If it is an online interview, the link will be provided in your portal.</p>

            ${data.Username ? `<p style="font-size: 14px; color: ${BRAND_SLATE}; margin-bottom: 24px;"><strong>Portal Username:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${data.Username}</code></p>` : ''}

            <div style="text-align: center; margin: 32px 0;">
              <a href="${LOGIN_URL}" style="background-color: ${BRAND_TEAL}; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Prepare & Confirm on Portal</a>
            </div>

            <p style="margin-top: 32px; font-weight: bold; color: ${BRAND_TEAL};">${ISLAMIC_CLOSING_AR}</p>
            <p style="margin: 0; font-weight: 800; color: #1e293b;">Admissions Office</p>
            <p style="margin: 0; font-size: 14px; color: ${BRAND_SLATE};">Darussalam Edu Village</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
          </div>
        </div>
      `
    },
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Darussalam Edu Village: Your Tharqiya interview is scheduled on *${data.InterviewDate}* at *${data.InterviewTime}*.
Mode: ${data.Mode || 'On-Campus'}

${ISLAMIC_CLOSING_AR}`.trim(),
  },

  INTERVIEW_REMINDER: {
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Reminder: Your Tharqiya interview is scheduled for *Tomorrow* at *${data.InterviewTime}*. 

${ISLAMIC_CLOSING_AR}`.trim(),
  },

  INTERVIEW_ATTENDED: {
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Darussalam Edu Village: Thank you for attending the Tharqiya Course interview. Results will be published on the portal soon.

${ISLAMIC_CLOSING_AR}`.trim()
  },

  INTERVIEW_RESULT_PUBLISHED: {
    email: {
      roleKey: 'PRINCIPAL',
      fromName: 'Office of the Principal – Darussalam Edu Village',
      fromEmail: process.env.EMAIL_PRINCIPAL || 'principal@darussalameduvillage.com',
      subject: "Interview Results Published – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${BRAND_TEAL}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Results Published</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; font-weight: bold; color: ${BRAND_TEAL}; margin-bottom: 24px;">${ISLAMIC_GREETING_AR}</p>
            <p>Dear <strong>${data.StudentName}</strong>,</p>
            <p>Your interview results for the <strong>Tharqiya Course</strong> have now been published and are available for viewing on your applicant profile.</p>
            
            <p>Please log in to the portal to view your detailed evaluation and final marks.</p>

            ${data.Username ? `<p style="font-size: 14px; color: ${BRAND_SLATE}; margin-bottom: 24px;"><strong>Portal Username:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${data.Username}</code></p>` : ''}

            <div style="text-align: center; margin: 32px 0;">
              <a href="${LOGIN_URL}" style="background-color: ${BRAND_TEAL}; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">View Result on Portal</a>
            </div>

            <p style="margin-top: 32px; font-weight: bold; color: ${BRAND_TEAL};">${ISLAMIC_CLOSING_AR}</p>
            <p style="margin: 0; font-weight: 800; color: #1e293b;">Office of the Principal</p>
            <p style="margin: 0; font-size: 14px; color: ${BRAND_SLATE};">Darussalam Edu Village</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
          </div>
        </div>
      `
    },
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Darussalam Edu Village: Your interview marks are published. Check your result on the portal.

${ISLAMIC_CLOSING_AR}`.trim()
  },

  ALLOTMENT_PUBLISHED: {
    email: {
      roleKey: 'PRINCIPAL',
      fromName: 'Office of the Principal – Darussalam Edu Village',
      fromEmail: process.env.EMAIL_PRINCIPAL || 'principal@darussalameduvillage.com',
      subject: "Seat Allotment Results – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${BRAND_CORAL}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Congratulations!</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; font-weight: bold; color: ${BRAND_CORAL}; margin-bottom: 24px;">${ISLAMIC_GREETING_AR}</p>
            <p>Dear <strong>${data.StudentName}</strong>,</p>
            <p>We are delighted to inform you that you have been selected for admission to the <strong>Tharqiya Course</strong>.</p>
            
            <div style="background-color: #f0fdf4; padding: 24px; border-radius: 12px; border: 1px solid #dcfce7; margin: 24px 0;">
              <p style="margin-top: 0; color: #166534;"><strong>Allotted Campus:</strong><br>
              <span style="font-size: 18px; font-weight: bold;">${data.CampusName}</span></p>
            </div>

            <p><strong>Next Action Required:</strong><br>
            Please log in to your portal immediately to confirm your seat and download your allotment letter. Failure to confirm by the deadline may result in the forfeiture of your seat.</p>

            ${data.Username ? `<p style="font-size: 14px; color: ${BRAND_SLATE}; margin-bottom: 24px;"><strong>Portal Username:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${data.Username}</code></p>` : ''}

            <div style="text-align: center; margin: 32px 0;">
              <a href="${LOGIN_URL}" style="background-color: ${BRAND_TEAL}; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Confirm Seat & Join</a>
            </div>

            <p style="margin-top: 32px; font-weight: bold; color: ${BRAND_TEAL};">${ISLAMIC_CLOSING_AR}</p>
            <p style="margin: 0; font-weight: 800; color: #1e293b;">Office of the Principal</p>
            <p style="margin: 0; font-size: 14px; color: ${BRAND_SLATE};">Darussalam Edu Village</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
          </div>
        </div>
      `
    },
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Darussalam Edu Village: You have been allotted a seat at *${data.CampusName}*. Confirm your seat via the portal.

${ISLAMIC_CLOSING_AR}`.trim()
  },

  ADMISSION_CONFIRMED: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
      fromEmail: process.env.EMAIL_ADMISSIONS || 'admissions@darussalameduvillage.com',
      subject: "Admission Confirmed – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${BRAND_TEAL}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Welcome Aboard!</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; font-weight: bold; color: ${BRAND_TEAL}; margin-bottom: 24px;">${ISLAMIC_GREETING_AR}</p>
            <p>Dear <strong>${data.StudentName}</strong>,</p>
            <p>Congratulations! We are delighted to officially confirm your admission to the <strong>Tharqiya Course</strong> at Darussalam Edu Village.</p>
            
            <p>Welcome to our community. You have successfully completed the admission process and your seat is secured.</p>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9; margin: 24px 0;">
              <p style="margin: 0;"><strong>Joining Instructions & Orientation:</strong><br>
              Please check your portal for the orientation schedule, joining instructions, and the academic calendar.</p>
            </div>

            ${data.Username ? `<p style="font-size: 14px; color: ${BRAND_SLATE}; margin-bottom: 24px;"><strong>Portal Username:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${data.Username}</code></p>` : ''}

            <div style="text-align: center; margin: 32px 0;">
              <a href="${LOGIN_URL}" style="background-color: ${BRAND_TEAL}; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Go to Student Dashboard</a>
            </div>

            <p style="margin-top: 32px; font-weight: bold; color: ${BRAND_TEAL};">${ISLAMIC_CLOSING_AR}</p>
            <p style="margin: 0; font-weight: 800; color: #1e293b;">Admissions Office</p>
            <p style="margin: 0; font-size: 14px; color: ${BRAND_SLATE};">Darussalam Edu Village</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
          </div>
        </div>
      `
    },
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Congratulations! Your admission to the Tharqiya Course is confirmed. Check your portal for details.

${ISLAMIC_CLOSING_AR}`.trim(),
  },

  ALLOTMENT_CORRECTION: {
    email: {
      roleKey: 'PRINCIPAL',
      fromName: 'Office of the Principal – Darussalam Edu Village',
      fromEmail: process.env.EMAIL_PRINCIPAL || 'principal@darussalameduvillage.com',
      subject: "CORRECTION: Seat Allotment Update – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${BRAND_CORAL}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Important Update</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; font-weight: bold; color: ${BRAND_CORAL}; margin-bottom: 24px;">${ISLAMIC_GREETING_AR}</p>
            <p>Dear <strong>${data.StudentName}</strong>,</p>
            <p>We are writing to inform you of a <strong>correction</strong> regarding your seat allotment for the Tharqiya Course.</p>
            
            <div style="background-color: #fff7ed; padding: 20px; border-radius: 12px; border: 1px solid #fed7aa; margin: 24px 0;">
              <p style="margin: 0; color: #c2410c; font-size: 14px;">Please be advised that your previous allotment record contained an error during high-volume processing. We sincerely apologize for any confusion this may have caused.</p>
            </div>

            <div style="background-color: #f0fdf4; padding: 24px; border-radius: 12px; border: 1px solid #dcfce7; margin: 24px 0;">
              <p style="margin-top: 0; color: #166534; font-weight: bold; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">Updated Allotment Details:</p>
              <p style="margin: 0; color: #064e3b;"><span style="font-size: 18px; font-weight: bold;">${data.CampusName}</span></p>
            </div>

            <p><strong>Next Action:</strong><br>
            Please log in to your portal immediately to view the revised details and confirm your acceptance. Your previous allotment letter is now void.</p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${LOGIN_URL}" style="background-color: ${BRAND_TEAL}; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">View Revised Allotment</a>
            </div>

            <p style="margin-top: 32px; font-weight: bold; color: ${BRAND_TEAL};">${ISLAMIC_CLOSING_AR}</p>
            <p style="margin: 0; font-weight: 800; color: #1e293b;">Office of the Principal</p>
            <p style="margin: 0; font-size: 14px; color: ${BRAND_SLATE};">Darussalam Edu Village</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
          </div>
        </div>
      `
    }
  },

  ALLOTMENT_REVOKED: {
    email: {
      roleKey: 'PRINCIPAL',
      fromName: 'Office of the Principal – Darussalam Edu Village',
      fromEmail: process.env.EMAIL_PRINCIPAL || 'principal@darussalameduvillage.com',
      subject: "IMPORTANT: Allotment Withdrawal – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${BRAND_DEEP}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Allotment Update</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; font-weight: bold; color: ${BRAND_DEEP}; margin-bottom: 24px;">${ISLAMIC_GREETING_AR}</p>
            <p>Dear <strong>${data.StudentName}</strong>,</p>
            <p>We are writing to formally inform you that your provisional seat allotment for the Tharqiya Course has been <strong>withdrawn</strong> due to an error in the batch processing system.</p>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 12px; border: 1px solid #fee2e2; margin: 24px 0;">
              <p style="margin: 0; color: #991b1b; font-size: 14px;"><strong>Reason for Withdrawal:</strong> Process Error / Data Synchronization Issue.</p>
            </div>

            <p><strong>What this means:</strong><br>
            Your application has been reverted to the <strong>Under Review</strong> status. Our admissions committee is re-evaluating the current allotment pool to ensure absolute fairness and accuracy.</p>

            <p>We deeply regret any inconvenience or discouragement this correction may cause. You will receive a new notification as soon as the re-evaluation is complete.</p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${LOGIN_URL}" style="background-color: ${BRAND_SLATE}; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Check Application Status</a>
            </div>

            <p style="margin-top: 32px; font-weight: bold; color: ${BRAND_TEAL};">${ISLAMIC_CLOSING_AR}</p>
            <p style="margin: 0; font-weight: 800; color: #1e293b;">Office of the Principal</p>
            <p style="margin: 0; font-size: 14px; color: ${BRAND_SLATE};">Darussalam Edu Village</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
          </div>
        </div>
      `
    }
  },

  ADMIN_ALERT: {
    email: {
      roleKey: 'ADMIN',
      fromName: 'Darussalam Edu Village – System Monitor',
      fromEmail: process.env.EMAIL_ADMIN || 'admin@darussalameduvillage.com',
      subject: "System Alert: Tharqiya Portal",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${BRAND_DEEP}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">System Monitor</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <h3 style="color: ${BRAND_DEEP}; margin-top: 0; font-size: 18px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">Admin Notification</h3>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9; margin: 24px 0;">
              <p style="margin: 0; color: #475569;"><strong>Status Message:</strong></p>
              <p style="margin: 8px 0 0 0; color: #1e293b; font-family: 'Courier New', Courier, monospace; background: #f1f5f9; padding: 12px; border-radius: 8px;">${data.RescheduleReason}</p>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; color: ${BRAND_SLATE}; font-size: 14px;">
              <span><strong>Timestamp:</strong> ${new Date().toLocaleString()}</span>
              <span><strong>Priority:</strong> Regular Alert</span>
            </div>

            <p style="margin-top: 32px; font-weight: bold; color: ${BRAND_DEEP};">System Maintenance Team</p>
            <p style="margin: 0; font-size: 14px; color: ${BRAND_SLATE};">Darussalam Edu Village Portal</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
          </div>
        </div>
      `
    }
  },

  PASSWORD_RESET_OTP: {
    email: {
      roleKey: 'SUPPORT',
      fromName: 'Darussalam Edu Village Account Support',
      fromEmail: process.env.EMAIL_SUPPORT || 'support@darussalameduvillage.com',
      subject: "Password Reset OTP",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${BRAND_CORAL}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Password Reset</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; font-weight: bold; color: ${BRAND_CORAL}; margin-bottom: 24px;">${ISLAMIC_GREETING_AR}</p>
            <p>Dear <strong>${data.StudentName}</strong>,</p>
            <p>We received a request to reset your password for the <strong>Darussalam Tharqiya Portal</strong>. Use the verification code below to proceed:</p>
            
            <div style="background-color: #f8fafc; padding: 32px; border-radius: 12px; border: 1px solid #f1f5f9; text-align: center; margin: 24px 0;">
              <p style="margin: 0 0 12px 0; color: ${BRAND_SLATE}; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Your OTP Code</p>
              <h2 style="margin: 0; font-size: 32px; letter-spacing: 8px; color: ${BRAND_TEAL}; font-family: monospace;">${data.TempPassword}</h2>
            </div>

            <div style="background-color: #fff7ed; padding: 16px; border-radius: 8px; border-left: 4px solid #f97316; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 14px; color: #9a3412;"><strong>⌚ Expiry:</strong> This code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
            </div>

            <p>For any technical assistance, contact our support team:<br>
            📧 <a href="mailto:support@darussalameduvillage.com" style="color: ${BRAND_TEAL}; text-decoration: none;">support@darussalameduvillage.com</a></p>

            <p style="margin-top: 32px; font-weight: bold; color: ${BRAND_TEAL};">${ISLAMIC_CLOSING_AR}</p>
            <p style="margin: 0; font-weight: 800; color: #1e293b;">Support Team</p>
            <p style="margin: 0; font-size: 14px; color: ${BRAND_SLATE};">Darussalam Edu Village</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
          </div>
        </div>
      `
    }
  }
};
