import type { Request, Response } from 'express';
import type { AuthRequest } from "../middleware/auth.js";
import type { IUserUpdateRequestDTO } from '@project/shared';
import { userService } from '../services/UserService.js';
import type { IUserFcmTokenModel } from '../models/User.js';

class UserController {
    getProfile = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req?.user?.id;

            const user = await userService.getProfile(userId!);

            if (!user){
                return res.status(404).json({ message : "Error: User not found!"});
            }
            return res.status(200).json(user);
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password){
                return res.status(400).json({ message: "Error: Critical fields are empty!"});
            }

            const user = await userService.login({username, email, password});
            
            if (!user){
                return res.status(404).json({ message: "Error: User is not found!"});
            }

            return res.status(200).json(user);
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    register = async (req : Request, res: Response) => {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password){
                return res.status(400).json({ message: "Error: Critical fields are empty!"});
            }

            const response = await userService.register({username, email, password});
            
            if (!response){
                return res.status(403).json({ message: "Error: User cannot be created."});
            }

            return res.status(201).json({ message : "User created. Successful!"});
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }
    
    assignFcmToken = async (req : AuthRequest, res : Response) => {
        try {
            const userId = req?.user?.id!;
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ message: "Error: FCM Token is empty!"});
            }

            const data : IUserFcmTokenModel = {
                id : userId,
                fcmToken : token
            }

            const response = await userService.assignFcmToken(data);

            if (!response){
                return res.status(403).json({ message: "Error: Failed to assign token to user!"});
            }
            
            return res.status(200).json({ message: "Success: FCM Token assigned successfuly!"});
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    update = async (req : AuthRequest, res : Response) => {
        try {
            const { username, email, password } = req.body as IUserUpdateRequestDTO;
            
            const updateData: IUserUpdateRequestDTO = {};

            updateData.id = req.user?.id!;
            if (username) updateData.username = username;
            if (email) updateData.email = email;
            if (password) updateData.password = password;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: "Error: No data provided for update." });
            }

            const response = await userService.update(updateData);

            if (!response){
                return res.status(403).json({ message: "Error: User cannot be updated."});
            }

            return res.status(201).json({ message : "User updated. Successful!"});
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }
}

export const userController = new UserController();