import { recipeRepository } from "../repositories/RecipeRepository.js";
export class RecipeService {
    async getRecipes() {
        const recipes = await recipeRepository.getRecipes();
        return recipes;
    }
    async getRecipeById(id) {
        const recipe = await recipeRepository.getById(id);
        return recipe;
    }
    async create(data) {
        const response = await recipeRepository.create(data);
        return response;
    }
    async delete(recipeId, userId) {
        const response = await recipeRepository.delete(recipeId, userId);
        return response;
    }
}
export const recipeService = new RecipeService();
