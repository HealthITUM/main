import type { IRecipeCreateRequestDTO } from "@project/shared";
import { recipeRepository } from "../repositories/RecipeRepository.js";

export class RecipeService {
    async getRecipes () {
        // TODO

        var amount = 10;
        recipeRepository.getRecipes(amount); 
    }

    async getRecipeById (id : Number) {
        // TODO
        
        recipeRepository.getById(id);
    }

    async create (data : IRecipeCreateRequestDTO) {
        // TODO
        
        recipeRepository.create(data);
    }

    async delete (id : Number) {
        // TODO
        
        recipeRepository.delete(id);
    }
}

export const recipeService = new RecipeService();