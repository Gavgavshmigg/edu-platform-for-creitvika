export interface IUser {
    id: number;
    login: string;
    name: string;
    surname: string;
    patronomic: string;
    gender: string;
    parentFullname: string | null;
    tips: string;
    imagePath: string;
    roles: {id: number, value: string, name: string, isNessessory: boolean}[]
    contacts: {id: number, contact: string, contactType: string}[]
}