import { api } from "./api";
import type { IUser, IUserLoginDTO, IUserLoginResponseDTO, IUserRegisterDTO, IUserUpdateDTO } from "../../../shared/UserDTO";

export const userService = {
    register: async (userData: IUserRegisterDTO)
    : Promise<IUser> => {
        const response = await api.post<IUser>("/user/register", userData);
        return response.data;
    },

    login: async (
        userData: IUserLoginDTO
    ): Promise<IUserLoginResponseDTO> => {
        const response = await api.post<IUserLoginResponseDTO>(
            "/user/login",
            userData
        );
        return response.data;
    },

    getMe: async ():
    Promise<IUser> => {
        const response = await api.get<IUser>("/user/me");
        return response.data;
    },

    updateMe: async (userData: IUserUpdateDTO
    ): Promise<IUser> => {
        const response = await api.patch<IUser>(
            "/user/me",
            userData);
        return response.data;
    },
};