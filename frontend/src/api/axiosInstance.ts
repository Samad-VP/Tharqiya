import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || '';
baseURL = baseURL.replace(/^["']|["']$/g, '').trim();

// Ensure it ends with /api if it's an absolute URL
if (baseURL.startsWith('http')) {
    if (!baseURL.endsWith('/api')) {
        baseURL = baseURL.replace(/\/$/, '') + '/api';
    }
} else {
    // If not absolute and empty, fallback to '/api'
    if (!baseURL) baseURL = '/api';
}

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
