import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

export interface Club {
    id: number;
    name: string;
}

export interface TicketPayload {
    club_a: string;
    club_b: string;
    relation: 'kosa' | 'zgoda' | 'neutralnie';
    description: string;
}

// Konfiguracja Axiosa
const api = axios.create({
    baseURL: `${API_BASE_URL}/api`, 
});

api.interceptors.request.use(
    (config) => {
        // Pobierz token
        let token = localStorage.getItem('accessToken');
        if (token) {
            if (token.startsWith('"') && token.endsWith('"')) {
                token = token.slice(1, -1);
            }
            
            // NAGŁÓWEK: Dla JWT (SimpleJWT) musi być 'Bearer'
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export const relationsApi = {
    // Pobiera listę klubów do dropdowna
    getAllClubs: async () => {
        const response = await api.get<Club[]>('/clubs/all/');
        return response.data;
    },

    // Wysyła nowy ticket
    createTicket: async (payload: TicketPayload) => {
        const response = await api.post('/ticketcreate/', payload);
        return response.data;
    },

    updateRelationDirectly: async (payload: TicketPayload) => {
        const response = await api.post('/relations/update/', payload);
        return response.data;
    }
};