import type { IUserDTO, IUserLoginRequestDTO, IUserLoginResponseDTO, IUserRegisterRequestDTO, IUserUpdateRequestDTO } from "@project/shared";
import { userRepository } from "../repositories/UserRepository.js";

export class UserService {
    async getProfile (id : number) : Promise<IUserDTO | null> {
        // TODO

        const user = await userRepository.getById(id);

        return user;
    }

    async login (data : IUserLoginRequestDTO) : Promise<IUserLoginResponseDTO | null> {
        // TODO TOKEN
        
        const user = await userRepository.getByNickname(data.username);
        
        if (user == null){
            return null;
        }

        const response : IUserLoginResponseDTO = { // TEMP
            id : user.id,
            username : user.username,
            email : user.email,
            token : "TEMP"
        }

        return response;
    }

    async register (data : IUserRegisterRequestDTO) : Promise<boolean>  {
        // TODO HASH PASSWORD
        
        const response = await userRepository.create(data);

        return response;
    }

    async update (data : IUserUpdateRequestDTO) : Promise<boolean> {
        // TODO VALIDATE THE DATA
        
        const response = await userRepository.update(data);

        return response;
    }
}

export const userService = new UserService();