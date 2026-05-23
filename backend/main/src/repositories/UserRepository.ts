import { prisma } from "../lib/prisma.js";
import type { IUserDTO, IUserRegisterRequestDTO, IUserUpdateRequestDTO } from "@project/shared";

export class UserRepository {
    async getById(id : number) : Promise<IUserDTO | null> {
        const result = await prisma.users.findUnique({
            where: {
                id: id
            }
        });

        if (!result) return null;

        const user: IUserDTO = {
            id: Number(result.id),
            username: result.username,
            email: result.email
        }

        return user;
    }

    async getByNickname(nickname : string) : Promise<IUserDTO | null>{
        const result = await prisma.users.findUnique({
            where: {
                username: nickname
            }
        });

        if (!result) return null;

        const user: IUserDTO = {
            id: Number(result.id),
            username: result.username,
            email: result.email
        }

        return user;
    }

    async create(data : IUserRegisterRequestDTO) : Promise<boolean> {
        try {
            const newUser = await prisma.users.create({
                data: {
                    username: data.username,
                    email: data.email,
                    password: data.password
                }
            });
    
            return !!newUser;

        } catch (error) {
            console.error("Failed to create plant species:", error);
            return false;
        }
    }

    async update(data : IUserUpdateRequestDTO) : Promise<boolean> {
        const updatedUserPlant = await prisma.users.updateMany({
            where: {
                id: Number(data.id),
            },
            data: {
                username: String(data.username),
                password: String(data.password)
            }
        });

        if (updatedUserPlant.count === 0) {
            return false;
        }
        return true;
    }
}

export const userRepository = new UserRepository();