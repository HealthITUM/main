import type { IUserLoginRequestDTO, IUserRegisterRequestDTO, IUserUpdateRequestDTO } from "@project/shared";
import { userRepository } from "../repositories/UserRepository.js";

export class UserService {
    async getProfile (id : Number) {
        // TODO

        userRepository.getById(id);
    }

    async login (data : IUserLoginRequestDTO) {
        // TODO
        
        userRepository.getByNickname(data.username);
    }

    async register (data : IUserRegisterRequestDTO) {
        // TODO
        
        userRepository.create(data);
    }

    async update (data : IUserUpdateRequestDTO) {
        // TODO
        
        userRepository.update(data);
    }
}

export const userService = new UserService();