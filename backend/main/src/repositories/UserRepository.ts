import type { IUserDTO, IUserRegisterRequestDTO, IUserUpdateRequestDTO } from "@project/shared";

export class UserRepository {
    async getById(id : number) : Promise<IUserDTO | null> {
        // TODO
        return null;
    }

    async getByNickname(nickname : string) : Promise<IUserDTO | null>{
        // TODO
        return null;
    }

    async create(data : IUserRegisterRequestDTO) : Promise<boolean> {
        // TODO
        return false;
    }

    async update(data : IUserUpdateRequestDTO) : Promise<boolean> {
        // TODO
        return false;
    }
}

export const userRepository = new UserRepository();