import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService {
    static async login(login: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/login', {login, password});
    }

    static async registration(data: {
        name: string, 
        surname: string, 
        patronomic?: string,
        login: string,
        password: string,
        gender: string,
        tips?: string,
        parentFullname?: string
    }, roleValue: string
    ): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>(`/auth/registration/${roleValue}`, data);
    }

    static async logout(): Promise<void> {
        return $api.post('/auth/logout');
    }
}
