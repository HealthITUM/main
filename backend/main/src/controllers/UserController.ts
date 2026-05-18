import type { Request, Response } from 'express';
import type { AuthRequest } from "../middleware/auth.js";

class UserController {
    getProfile = async (req: AuthRequest, res: Response) => {
        // TODO
        

    }

    login = async (req: Request, res: Response) => {
        // TODO


    }

    register = async (req : Request, res: Response) => {
        // TODO

        
    }

    update = async (req : AuthRequest, res : Response) => {
        // TODO

        
    }
}

export const userController = new UserController();