import type { IRecipeCreateRequestDTO } from "@project/shared";

export class RecipeRepository {
    async getRecipes(amount? : number) {
        // TODO

    }
    async getById(id : number) {
        // TODO

    }
    async create(data : IRecipeCreateRequestDTO){
        // TODO

    }
    async delete(id : number){
        // TODO

    }
}

export const recipeRepository = new RecipeRepository();