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
      subject: "Application Received – Tharqiya Course | Darussalam Edu Village",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Your application for the Tharqiya Course at Darussalam Edu Village has been successfully received.</p>
          <p><strong>Application ID:</strong> ${data.ApplicationID}</p>
          <p>If needed, you may review your submitted details by logging into your applicant profile:<br>
          🔗 <a href="${LOGIN_URL}">${LOGIN_URL}</a></p>
          <p>Further updates will be communicated by email.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Admissions Office</strong><br>Darussalam Edu Village</p>
        </div>
      `
    },
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Darussalam Edu Village: Your application for the Tharqiya Course is successfully received. 
*Application ID:* ${data.ApplicationID}

${ISLAMIC_CLOSING_AR}`.trim(),
  },

  APPLICATION_UNDER_REVIEW: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
      subject: "Application Under Review – Tharqiya Course | Darussalam Edu Village",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Your application for the Tharqiya Course is currently under review by the admissions committee.</p>
          <p>If you are requested to update or verify any information, please do so through your applicant profile:<br>
          🔗 <a href="${LOGIN_URL}">${LOGIN_URL}</a></p>
          <p>No action is required unless notified.</p>
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
      subject: "Interview Scheduled – Tharqiya Course | Darussalam Edu Village",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Your interview for the Tharqiya Course has been scheduled.</p>
          <p><strong>Date:</strong> ${data.InterviewDate}</p>
          <p><strong>Time:</strong> ${data.InterviewTime}</p>
          <p><strong>Mode:</strong> ${data.Mode || 'On-Campus'}</p>
          <p>Please log in to your profile to view full interview details:<br>
          🔗 <a href="${LOGIN_URL}">${LOGIN_URL}</a></p>
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

Details: ${LOGIN_URL}

${ISLAMIC_CLOSING_AR}`.trim(),
  },

  INTERVIEW_REMINDER: {
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Reminder: Your Tharqiya interview is scheduled for *Tomorrow* at *${data.InterviewTime}*. 

Please login for details: ${LOGIN_URL}

${ISLAMIC_CLOSING_AR}`.trim(),
  },

  INTERVIEW_ATTENDED: {
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Darussalam Edu Village: This is to confirm that you have attended the interview for the Tharqiya Course. Results will be published soon.

${ISLAMIC_CLOSING_AR}`.trim()
  },

  INTERVIEW_MARKS_PUBLISHED: {
    email: {
      roleKey: 'PRINCIPAL',
      fromName: 'Office of the Principal – Darussalam Edu Village',
      subject: "Interview Evaluation Results – Tharqiya Course | Darussalam Edu Village",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Your interview evaluation for the Tharqiya Course has been completed.</p>
          <p>Please log in to your applicant profile to view your result:<br>
          🔗 <a href="${LOGIN_URL}">${LOGIN_URL}</a></p>
          <p>Further instructions will be communicated based on the outcome.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Office of the Principal</strong><br>Darussalam Edu Village</p>
        </div>
      `
    },
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Darussalam Edu Village: Your Tharqiya interview evaluation is completed. Please check your result on the portal.

${ISLAMIC_CLOSING_AR}`.trim()
  },

  ALLOTMENT_RESULT: {
    email: {
      roleKey: 'PRINCIPAL',
      fromName: 'Office of the Principal – Darussalam Edu Village',
      subject: "Admission Allotment – Tharqiya Course | Darussalam Edu Village",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>Based on your interview performance and submitted preferences, you have been allotted admission to the Tharqiya Course.</p>
          <p style="font-size: 1.1em;"><strong>Allotted Campus:</strong> ${data.CampusName}</p>
          <p>Please log in to your profile to review allotment details and next steps:<br>
          🔗 <a href="${LOGIN_URL}">${LOGIN_URL}</a></p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Office of the Principal</strong><br>Darussalam Edu Village</p>
        </div>
      `
    },
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Darussalam Edu Village: You have been allotted a seat at *${data.CampusName}* for the Tharqiya Course.

Kindly confirm via the portal: ${LOGIN_URL}

${ISLAMIC_CLOSING_AR}`.trim()
  },

  APPLICATION_SUBMITTED_SUCCESSFULLY: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
      subject: "Application Submitted Successfully – Tharqiya Course | Darussalam Edu Village",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>We are pleased to inform you that your application for the Tharqiya Course at Darussalam Edu Village has been submitted successfully.</p>
          <p>Your applicant profile has been created. You may use the credentials below to access your profile and track application progress.</p>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="margin-top: 0;"><strong>Applicant Portal Login:</strong><br>
            <a href="${LOGIN_URL}">${LOGIN_URL}</a></p>
            <p><strong>Username:</strong> ${data.Username}</p>
            <p style="margin-bottom: 0;"><strong>Temporary Password:</strong> ${data.TempPassword}</p>
          </div>
          <p>For security, please do not share your login credentials with anyone.</p>
          <p>All future updates regarding your application, interview schedule, and results will be available in your applicant profile and communicated via email.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Admissions Office</strong><br>Darussalam Edu Village</p>
        </div>
      `
    },
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Darussalam Edu Village: Your application for the Tharqiya Course is successfully received. 
Your login credentials have been sent to your registered email for security. 
Please check your Inbox (and Spam folder) immediately.

${ISLAMIC_CLOSING_AR}`.trim(),
  },

  ADMISSION_CONFIRMED: {
    email: {
      roleKey: 'ADMISSIONS',
      fromName: 'Darussalam Edu Village – Tharqiya Admissions',
      subject: "Admission Confirmed – Tharqiya Course | Darussalam Edu Village",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>We are pleased to confirm your admission to the Tharqiya Course at Darussalam Edu Village.</p>
          <p>Your student portal credentials are as follows:</p>
          <p><strong>Login URL:</strong> <a href="${LOGIN_URL}">${LOGIN_URL}</a><br>
          <strong>Username:</strong> ${data.Username}<br>
          <strong>Temporary Password:</strong> ${data.TempPassword}</p>
          <p>Please do not share your credentials with anyone for security purposes.</p>
          <p>Further instructions will be available in your portal.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>Admissions Office</strong><br>Darussalam Edu Village</p>
        </div>
      `
    },
    whatsapp: (data: NotificationData) => `
${ISLAMIC_GREETING_AR}

Congratulations! Your admission to the Tharqiya Course is confirmed. 
Your login credentials have been sent to your registered email for security. Please login at: ${LOGIN_URL}

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
      subject: "Password Reset OTP – Darussalam Edu Village",
      template: (data: NotificationData) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${ISLAMIC_GREETING_AR}</p>
          <p>Dear ${data.StudentName},</p>
          <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h2 style="margin: 0; letter-spacing: 5px; color: #d97706;">${data.TempPassword}</h2>
          </div>
          <p>This OTP is valid for 10 minutes only. Do not share this code with anyone.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>${ISLAMIC_CLOSING_AR}</p>
          <br>
          <p><strong>IT Support Team</strong><br>Darussalam Edu Village</p>
        </div>
      `
    }
  }
};
