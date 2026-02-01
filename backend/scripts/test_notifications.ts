import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import { sendEmail } from '../src/services/notificationService';

const TEST_RECIPIENT = 'abdulsamadvp10@gmail.com';

async function runTests() {
    console.log('🚀 Starting Comprehensive Notification Test...');
    console.log(`📦 Targeted Recipient: ${TEST_RECIPIENT}\n`);

    const tests = [
        {
            name: 'Admissions Office Test',
            event: 'APPLICATION_RECEIVED',
            data: { StudentName: 'Test Candidate', Username: 'testuser123', TempPassword: 'password123' }
        },
        {
            name: 'Principal Office Test',
            event: 'ALLOTMENT_PUBLISHED',
            data: { StudentName: 'Test Candidate', CampusName: 'Main Campus (Tharqiya)' }
        },
        {
            name: 'Account Support Test',
            event: 'PASSWORD_RESET_OTP',
            data: { StudentName: 'Test Candidate', TempPassword: '999888' }
        },
        {
            name: 'System Admin Test',
            event: 'ADMIN_ALERT',
            data: { RescheduleReason: 'Automated SMTP Test - Departmental Verification' }
        }
    ];

    for (const test of tests) {
        console.log(`📡 Sending: ${test.name}...`);
        try {
            const result = await sendEmail(TEST_RECIPIENT, test.event, test.data);
            if (result.success) {
                console.log(`✅ SUCCESS: Sent via ${result.sender}\n`);
            } else {
                console.log(`❌ FAILED: ${result.error}\n`);
            }
        } catch (error: any) {
            console.log(`💥 CRITICAL ERROR: ${error.message}\n`);
        }
    }

    console.log('🏁 Verification sequence complete. Please check your inbox for 4 different emails.');
}

runTests().catch(err => {
    console.error('Fatal Test Error:', err);
    process.exit(1);
});
