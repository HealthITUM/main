import { api } from "./api";
import type { IUserDTO, IUserLoginRequestDTO, IUserLoginResponseDTO, IUserRegisterRequestDTO, IUserUpdateRequestDTO } from "@project/shared";

export const userService = {
    register: async (userData: IUserRegisterRequestDTO)
    : Promise<IUserDTO> => {
        const response = await api.post<IUserDTO>("/user/register", userData);
        return response.data;
    },

    login: async (
        userData: IUserLoginRequestDTO
    ): Promise<IUserLoginResponseDTO> => {
        const response = await api.post<IUserLoginResponseDTO>(
            "/user/login",
            userData
        );
        return response.data;
    },

    getMe: async ():
    Promise<IUserDTO> => {
        const response = await api.get<IUserDTO>("/user/me");
        return response.data;
    },

    updateMe: async (userData: IUserUpdateRequestDTO
    ): Promise<IUserDTO> => {
        const response = await api.patch<IUserDTO>(
            "/user/me",
            userData);
        return response.data;
    },
};