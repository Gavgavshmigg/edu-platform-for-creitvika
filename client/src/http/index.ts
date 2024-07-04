import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = process.env.API_URL // || 'http://178.49.124.232:8001';
export const MEDIA_URL = process.env.MEDIA_URL;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    return config;
})

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, {},
                {withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`}}
            );
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            return $api.request(originalRequest);
        } catch (e) {
            console.log('Пользователь не авторизован');
        }
    }
    throw error;
});

export default $api;