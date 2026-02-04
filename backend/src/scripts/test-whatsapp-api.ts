import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function testGreenApi() {
    const baseUrl = process.env.WHATSAPP_API_URL?.replace(/\/$/, '') || 'https://api.green-api.com';
    const idInstance = process.env.WHATSAPP_ID_INSTANCE;
    const apiToken = process.env.WHATSAPP_API_TOKEN;

    const url = `${baseUrl}/waInstance${idInstance}/sendMessage/${apiToken}`;
    const cleanPhone = '918086555479'; // The number from DB
    const chatId = `${cleanPhone}@c.us`;
    const message = 'Test message from Tharqiya Backend Debugger.';

    console.log('--- Green API Direct Test ---');
    console.log(`URL: ${url}`);
    console.log(`Chat ID: ${chatId}`);
    
    try {
        const response = await axios.post(url, { chatId, message });
        console.log('Success!', response.data);
    } catch (error: any) {
        console.error('Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

testGreenApi();
