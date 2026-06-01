import { prisma } from "../lib/prisma.js";
export class UserRepository {
    async getById(id) {
        const result = await prisma.users.findUnique({
            where: {
                id: id
            }
        });
        if (!result)
            return null;
        const user = {
            id: Number(result.id),
            username: result.username,
            email: result.email
        };
        return user;
    }
    async getByNickname(nickname) {
        const result = await prisma.users.findUnique({
            where: {
                username: nickname
            }
        });
        if (!result)
            return null;
        const user = {
            id: Number(result.id),
            username: result.username,
            email: result.email,
            passwordHash: result.password
        };
        return user;
    }
    async create(data) {
        try {
            const newUser = await prisma.users.create({
                data: {
                    username: data.username,
                    email: data.email,
                    password: data.passwordHash
                }
            });
            return !!newUser;
        }
        catch (error) {
            console.error("Failed to create plant species:", error);
            return false;
        }
    }
    async update(data) {
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
