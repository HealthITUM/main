import type { IUserDTO, IUserRegisterRequestDTO, IUserUpdateRequestDTO } from "@project/shared";
import type { IUser, IUserCreateModel } from "../models/User.js";

export class UserRepository {
    async getById(id : number) : Promise<IUserDTO | null> {
        // TODO
        return null;
    }

    async getByNickname(nickname : string) : Promise<IUser | null>{
        // TODO
        return null;
    }

    async create(data : IUserCreateModel) : Promise<boolean> {
        // TODO
        return false;
    }

    async update(data : IUserUpdateRequestDTO) : Promise<boolean> {
        // TODO
        return false;
    }
}

export const userRepository = new UserRepository();