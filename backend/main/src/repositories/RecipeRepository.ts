import type { IRecipeCreateRequestDTO } from "@project/shared";

export class RecipeRepository {
    async getRecipes(amount? : Number) {
        // TODO

    }
    async getById(id : Number) {
        // TODO

    }
    async create(data : IRecipeCreateRequestDTO){
        // TODO

    }
    async delete(id : Number){
        // TODO

    }
}

export const recipeRepository = new RecipeRepository();