//import { api } from "../../react-web/src/api";
import type { IUserDTO, IUserLoginRequestDTO, IUserLoginResponseDTO, IUserRegisterRequestDTO, IUserUpdateRequestDTO } from "@project/shared";
import type { AxiosInstance } from "axios";

//exports object with all user related API functions
export const userService = (api: AxiosInstance) => ({
    //create a new user account
    register: async (userData: IUserRegisterRequestDTO)
    : Promise<void> => {
        //API call - POST /user/register - sends user data to backend
        await api.post<void>("/user/register", userData);
    },

    //authentication - user, returns token
    //frontend stores token in local storage
    login: async (
        userData: IUserLoginRequestDTO
    ): Promise<IUserLoginResponseDTO> => {
        //API call - backend returns token
        const response = await api.post<IUserLoginResponseDTO>(
            "/user/login",
            userData
        );
        return response.data;
    },

    //fetch currently logged in user
    getMe: async ():
    Promise<IUserDTO> => {
        //API call - requires authentication
        const response = await api.get<IUserDTO>("/user/me");
        return response.data;
    },

    //update currently logged in user data
    updateMe: async (userData: IUserUpdateRequestDTO
    ): Promise<void> => {
        //API call - partial update - only provided fields
        await api.patch<void>(
            "/user/me",
            userData);
    },
});