import type { IRecipeCreateRequestDTO } from "@project/shared";
import type { IRecipeCreateServiceInput } from "../models/Recipe.js";

export class RecipeRepository {
    async getRecipes(amount? : number) {
        // TODO

    }
    async getById(id : number) {
        // TODO

    }
    async create(data : IRecipeCreateServiceInput){
        // TODO

    }
    async delete(id : number){
        // TODO

    }
}

export const recipeRepository = new RecipeRepository();