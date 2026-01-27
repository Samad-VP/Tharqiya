import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || '';
// Remove any leading/trailing quotes and whitespace
baseURL = baseURL.replace(/^["']|["']$/g, '').trim();

if (baseURL && baseURL.startsWith('http')) {
    // Remove trailing slash if present
    baseURL = baseURL.replace(/\/+$/, '');
    // Ensure it ends with /api but don't double it
    if (!baseURL.endsWith('/api')) {
        baseURL += '/api';
    }
} else {
    // Local fallback or relative path
    baseURL = baseURL || '/api';
}

console.log('[API URL Debug]:', baseURL);

const api = axios.create({
    baseURL,
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('edu_village_user');
        if (storedUser) {
            const { token } = JSON.parse(storedUser);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
