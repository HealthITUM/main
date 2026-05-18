import type { IUserRegisterRequestDTO, IUserUpdateRequestDTO } from "@project/shared";

export class UserRepository {
    async create(data : IUserRegisterRequestDTO) {
        // TODO

    }
    async getById(id : Number) {
        // TODO

    }
    async getByNickname(nickname : string){
        // TODO

    }
    async update(data : IUserUpdateRequestDTO) {
        // TODO
        
    }
}

export const userRepository = new UserRepository();