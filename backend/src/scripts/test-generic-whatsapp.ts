import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function checkGenericApi() {
    const baseUrl = 'https://api.green-api.com';
    const idInstance = process.env.WHATSAPP_ID_INSTANCE;
    const apiToken = process.env.WHATSAPP_API_TOKEN;

    const endpoints = [
        'getStateInstance',
        'getSettings',
        'getSystemStatus'
    ];

    console.log('--- Green API Generic Test ---');
    for (const endpoint of endpoints) {
        const url = `${baseUrl}/waInstance${idInstance}/${endpoint}/${apiToken}`;
        console.log(`Testing ${endpoint}...`);
        try {
            const response = await axios.get(url);
            console.log(`SUCCESS [${endpoint}]:`, response.data);
        } catch (error: any) {
            console.error(`FAILED [${endpoint}]:`, error.response?.status || error.message);
        }
    }
}

checkGenericApi();
