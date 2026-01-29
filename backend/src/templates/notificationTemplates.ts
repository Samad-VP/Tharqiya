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

export const NOTIFICATION_TEMPLATES: Record<string, any> = {
  APPLICATION_RECEIVED: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
      subject: "Application Received – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #0d9488; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">WELCOME TO THARQIYA</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; font-weight: bold; color: #0d9488; margin-bottom: 24px;">${ISLAMIC_GREETING_AR}</p>
            <p>Dear <strong>${data.StudentName}</strong>,</p>
            <p>We are pleased to confirm that your application for the <strong>Tharqiya Course</strong> at <strong>Darussalam Edu Village</strong> has been received successfully.</p>
            <p>Your applicant profile has been created. You may log in using the details below:</p>
            
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #f1f5f9; margin: 24px 0;">
              <p style="margin-top: 0;"><strong>Applicant Portal:</strong><br>
              <a href="${LOGIN_URL}" style="color: #0d9488; text-decoration: none; font-weight: bold;">${LOGIN_URL}</a></p>
              <p><strong>Username:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${data.Username}</code></p>
              <p style="margin-bottom: 0;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${data.TempPassword}</code></p>
            </div>

            <div style="background-color: #fff7ed; padding: 16px; border-radius: 8px; border-left: 4px solid #f97316; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 14px; color: #9a3412;"><strong>⚠️ Security Notice:</strong> Please log in immediately and change your password.</p>
            </div>

            <p>You will receive further updates regarding review, interviews, and results through this portal and via email.</p>
            
            <p>For any assistance, contact us at:<br>
            📧 <a href="mailto:admissions@darussalameduvillage.com" style="color: #0d9488; text-decoration: none;">admissions@darussalameduvillage.com</a></p>

            <p style="margin-top: 32px; font-weight: bold; color: #0d9488;">${ISLAMIC_CLOSING_AR}</p>
            <p style="margin: 0; font-weight: 800; color: #1e293b;">Admissions Office</p>
            <p style="margin: 0; font-size: 14px; color: #64748b;">Darussalam Edu Village</p>
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
      subject: "Portal Access Credentials – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Your applicant profile has been created. Use the credentials below to track your application.</p>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; margin: 20px 0;">
            <p><strong>Portal Login:</strong> <a href="${LOGIN_URL}">${LOGIN_URL}</a></p>
            <p><strong>Username:</strong> ${data.Username}</p>
            <p><strong>Temporary Password:</strong> ${data.TempPassword}</p>
          </div>
          <p>For security, please change your password after your first login.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Admissions Office</strong><br>Darussalam Edu Village</p>
        </div>
      `
    }
    // WhatsApp: Never send credentials as per security rules
  },

  APPLICATION_UNDER_REVIEW: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
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
      subject: "Application Selected for Interview – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>We are pleased to inform you that your application has been approved for the next stage: the Interview.</p>
          <p>You will receive your interview schedule details shortly.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Admissions Office</strong><br>Darussalam Edu Village</p>
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
      subject: "Application Status Update – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Thank you for your interest in the Tharqiya Course. After careful review, we regret to inform you that your application has not been selected at this time.</p>
          <p>We wish you the best in your future endeavors.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Admissions Office</strong><br>Darussalam Edu Village</p>
        </div>
      `
    }
  },

  INTERVIEW_SCHEDULED: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
      subject: "Interview Scheduled – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Your interview for the Tharqiya Course has been scheduled.</p>
          <p><strong>Date:</strong> ${data.InterviewDate}</p>
          <p><strong>Time:</strong> ${data.InterviewTime}</p>
          <p><strong>Mode:</strong> ${data.Mode || 'On-Campus'}</p>
          <p>Please log in to your profile for full details and preparation guidelines.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Admissions Office</strong><br>Darussalam Edu Village</p>
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
      subject: "Interview Results Published – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Your interview results for the Tharqiya Course are now available.</p>
          <p>Please log in to your applicant profile to view your marks and evaluation.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Office of the Principal</strong><br>Darussalam Edu Village</p>
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
      subject: "Seat Allotment Results – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Based on your performance, you have been allotted a seat for the Tharqiya Course.</p>
          <p><strong>Allotted Campus:</strong> ${data.CampusName}</p>
          <p>Please log in to confirm your acceptance by the deadline.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Office of the Principal</strong><br>Darussalam Edu Village</p>
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
      subject: "Admission Confirmed – Tharqiya Course",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Welcome! We are pleased to confirm your admission to the Tharqiya Course at Darussalam Edu Village.</p>
          <p>Please check your portal for joining instructions and orientation schedule.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Admissions Office</strong><br>Darussalam Edu Village</p>
        </div>
      `
    },
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Congratulations! Your admission to the Tharqiya Course is confirmed. Check your portal for details.

${ISLAMIC_CLOSING_AR}`.trim(),
  },

  ADMIN_ALERT: {
    email: {
      roleKey: 'ADMIN',
      fromName: 'Tharqiya System Monitor',
      subject: "System Alert: Tharqiya Portal",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h3>Admin Notification</h3>
          <p>${data.RescheduleReason}</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      `
    }
  },

  PASSWORD_RESET_OTP: {
    email: {
      roleKey: 'SUPPORT',
      fromName: 'Darussalam Edu Village Account Support',
      subject: "Password Reset OTP",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Use the following OTP to reset your password:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h2 style="margin: 0; letter-spacing: 5px; color: #d97706;">${data.TempPassword}</h2>
          </div>
          <p>This code is valid for 10 minutes.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Support Team</strong><br>Darussalam Edu Village</p>
        </div>
      `
    }
  }
};
