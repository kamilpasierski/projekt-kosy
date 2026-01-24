import axios from 'axios';
import { API_BASE_URL } from '../utils/config';


const api = axios.create({
    baseURL: `${API_BASE_URL}/api`, 
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'); 
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;