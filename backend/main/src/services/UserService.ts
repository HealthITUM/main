import type { IUserDTO, IUserLoginRequestDTO, IUserLoginResponseDTO, IUserRegisterRequestDTO, IUserUpdateRequestDTO } from "@project/shared";
import { userRepository } from "../repositories/UserRepository.js";

export class UserService {
    async getProfile (id : number) : Promise<IUserDTO> {
        // TODO

        const user = await userRepository.getById(id);
        return user;
    }

    async login (data : IUserLoginRequestDTO) : Promise<IUserLoginResponseDTO> {
        // TODO
        
        const user = await userRepository.getByNickname(data.username);
        return user;
    }

    async register (data : IUserRegisterRequestDTO) : boolean  {
        // TODO
        
        const response = await userRepository.create(data);
        return response;
    }

    async update (data : IUserUpdateRequestDTO) : boolean {
        // TODO
        
        const response = await userRepository.update(data);
        return response;
    }
}

export const userService = new UserService();