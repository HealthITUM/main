import type { IRecipeDTO } from "@project/shared";
import type { IRecipeCreateModel } from "../models/Recipe.js";
import { recipeRepository } from "../repositories/RecipeRepository.js";

export class RecipeService {
    async getRecipes () : Promise<IRecipeDTO[] | null> {
        // TODO

        const recipes = await recipeRepository.getRecipes(); 

        return recipes;
    }

    async getRecipeById (id : number) : Promise<IRecipeDTO | null> {
        // TODO
        
        const recipe = await recipeRepository.getById(id);

        return recipe;
    }

    async create (data : IRecipeCreateModel) : Promise<boolean> {
        // TODO
        
        const response = recipeRepository.create(data);

        return response;
    }

    async delete (recipeId : number, userId : number) : Promise<boolean> {
        // TODO
        
        const response = recipeRepository.delete(recipeId, userId);

        return response;
    }
}

export const recipeService = new RecipeService();