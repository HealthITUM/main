import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { recipeService } from '../services/RecipeService.js';
import { uploadFile, BUCKETS } from '../configs/storage.config.js';
import nodeCrypto from 'crypto';

class RecipeController {
    getRecipes = async (req: Request, res: Response) => {
        try {
            const recipes = await recipeService.getRecipes();

            return res.status(200).json(recipes);
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    getRecipeById = async (req : Request, res : Response) => {
        try {
            const requestRecipeId = req.params.id;

            if (!requestRecipeId){
                return res.status(404).json({ message : "Error: RecipeID is empty!"})
            }

            const parsedId = parseInt(String(requestRecipeId), 10);

            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: RecipeID must be a valid number!" });
            }

            const recipe = await recipeService.getRecipeById(parsedId);

            if (!recipe){
                return res.status(404).json({ message: "Error: Recipe with that id does not exist!" });
            }

            return res.status(200).json(recipe);
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    create = async (req : AuthRequest, res : Response) => {
        try {
            const authorId = req.user!.id;

            if (!req.file) {
                return res.status(400).json({ message: "Error: Image file is required!" });
            }
            
            const { name, description, ingredients } = req.body;

            if (!name || !description) {
                return res.status(400).json({ message: "Error: Name and description are required fields!" });
            }

            const fileExtension = req.file.originalname.split('.').pop();
            const uniqueFileName = `${nodeCrypto.randomBytes(16).toString('hex')}.${fileExtension}`;

            const imageUrl = await uploadFile(
                BUCKETS.RECIPES,
                uniqueFileName,
                req.file.buffer,
                req.file.mimetype
            );

            let parsedIngredients = ingredients;
            if (typeof ingredients === 'string') {
                try {
                    parsedIngredients = JSON.parse(ingredients);
                } catch {
                    return res.status(400).json({ message: "Error: Invalid ingredients format. Expected JSON." });
                }
            }

            const newRecipe = await recipeService.create({
                name,
                description,
                ingredients: parsedIngredients,
                authorId,
                imageUrl
            });

            if (!newRecipe){
                return res.status(400).json({ message : "Error: Failed to create new recipe! "});
            }

            return res.status(201).json({ message : "Success: Recipe was created! "});
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    delete = async (req : AuthRequest, res : Response) => {
        try {
            const requestRecipeId = req.params.id;

            if (!requestRecipeId){
                return res.status(404).json({ message : "Error: RecipeID is empty!"})
            }

            const parsedId = parseInt(String(requestRecipeId), 10);

            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: RecipeID must be a valid number!" });
            }
            
            const response = await recipeService.delete(parsedId);

            if (!response){
                return res.status(400).json({ message : "Error: Failed to delete recipe! "});
            }

            return res.status(200).json({ message : "Success: Recipe deleted!" });
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }
}

export const recipeController = new RecipeController();