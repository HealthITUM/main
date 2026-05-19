import type { IRecipeDTO } from "@project/shared";
import type { IRecipeCreateModel } from "../models/Recipe.js";

export class RecipeRepository {
    async getRecipes(amount? : number) : Promise<IRecipeDTO[] | null> {
        // TODO
        return null;
    }

    async getById(id : number) : Promise<IRecipeDTO | null> {
        // TODO
        return null;
    }

    async create(data : IRecipeCreateModel) : Promise<boolean> {
        // TODO
        return false;
    }

    async delete(recipeId : number, userId : number) : Promise<boolean> {
        // TODO
        return false;
    }
}

export const recipeRepository = new RecipeRepository();