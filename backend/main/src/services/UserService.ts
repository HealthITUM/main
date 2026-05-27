import type { IUserDTO, IUserLoginRequestDTO, IUserLoginResponseDTO, IUserRegisterRequestDTO, IUserUpdateRequestDTO } from "@project/shared";
import type { IUserCreateModel } from "../models/User.js";
import { userRepository } from "../repositories/UserRepository.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {
    async getProfile (id : number) : Promise<IUserDTO | null> {
        const user = await userRepository.getById(id);

        return user;
    }

    async login (data : IUserLoginRequestDTO) : Promise<IUserLoginResponseDTO | null> {
        const user = await userRepository.getByNickname(data.username);

        if (user == null){
            return null;
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
        if (!isPasswordValid) {
            return null;
        }

        const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET as string,
                { expiresIn: '1d' }
            );

        const response : IUserLoginResponseDTO = {
            id : user.id,
            username : user.username,
            email : user.email,
            token
        }

        return response;
    }

    async register (data : IUserRegisterRequestDTO) : Promise<boolean>  {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(data.password, salt);

        const user : IUserCreateModel = {
            username : data.username,
            passwordHash,
            email : data.email
        }

        const response = await userRepository.create(user);

        return response;
    }

    async update (data : IUserUpdateRequestDTO) : Promise<boolean> {
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(data.password, salt);
            data.password = passwordHash;
        }
        
        const response = await userRepository.update(data);

        return response;
    }
}

export const userService = new UserService();