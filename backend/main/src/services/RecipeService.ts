import type { IRecipeCreateRequestDTO, IRecipeDTO } from "@project/shared";
import { recipeRepository } from "../repositories/RecipeRepository.js";

export class RecipeService {
    async getRecipes () : Promise<Array<IRecipeDTO>> {
        // TODO

        var amount = 10;
        const recipes = await recipeRepository.getRecipes(amount); 

        return recipes as Array<IRecipeDTO>;
    }

    async getRecipeById (id : number) : Promise<IRecipeDTO> {
        // TODO
        
        const recipe = await recipeRepository.getById(id);
        return recipe;
    }

    async create (data : IRecipeCreateRequestDTO) : boolean {
        // TODO
        
        const response = recipeRepository.create(data);
        return response;
    }

    async delete (id : number) : boolean {
        // TODO
        
        const response = recipeRepository.delete(id);
        return response;
    }
}

export const recipeService = new RecipeService();