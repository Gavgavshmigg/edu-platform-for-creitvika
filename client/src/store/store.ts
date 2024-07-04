import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import axios, { AxiosError } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";
import UserService from "../services/UserService";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(login: string, password: string) {
        try {
            const response = await AuthService.login(login, password);
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            this.setAuth(true);
            const user = await UserService.getProfile();
            this.setUser(user.data)
            return response;
        } catch (e: any) {
            console.log(e);
            throw e;
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            console.log(e);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, {},
                {withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`}})
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            this.setAuth(true);
            const user = await UserService.getProfile();
            this.setUser(user.data)
        } catch (e) {
            this.setAuth(false);
            this.setUser({} as IUser);
            console.log(e);
        } finally {
            this.setLoading(false);
        }
    }
}