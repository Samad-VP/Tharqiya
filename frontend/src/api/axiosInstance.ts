import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
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
