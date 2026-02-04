import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function checkInstanceState() {
    const baseUrl = process.env.WHATSAPP_API_URL?.replace(/\/$/, '') || 'https://api.green-api.com';
    const idInstance = process.env.WHATSAPP_ID_INSTANCE;
    const apiToken = process.env.WHATSAPP_API_TOKEN;

    const url = `${baseUrl}/waInstance${idInstance}/getStateInstance/${apiToken}`;

    console.log('--- Green API Instance State Check ---');
    try {
        const response = await axios.get(url);
        console.log('Instance State:', response.data);
    } catch (error: any) {
        console.error('Failed to get instance state!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

checkInstanceState();
