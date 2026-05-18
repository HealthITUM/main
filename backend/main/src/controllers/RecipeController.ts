import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';

class RecipeController {
    getRecipes = async (req: Request, res: Response) => {
        // TODO
        

    }

    getRecipeById = async (req : Request, res : Response) => {
        // TODO

        
    }

    create = async (req : AuthRequest, res : Response) => {
        // TODO


    }

    delete = async (req : AuthRequest, res : Response) => {
        // TODO


    }
}

export const recipeController = new RecipeController();