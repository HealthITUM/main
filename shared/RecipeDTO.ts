import type { IUserDTO } from "./UserDTO";
export type DietType = "none" | "vegan" | "vegetarian";

export interface IRecipeDTO { // Base class. GET /recipes/. Response.
    id: string;
    name: string;
    description: string;
    author: IUserDTO;
    ingredients: IIngredientHasRecipeDTO[];
    prepTime: number;
    cookTime: number;
    dietType: DietType;
    imageUrl?: string;
    steps: string[];
}
export interface IIngredientHasRecipeDTO {
    id: string;
    name: string;
    unit: string;
    amount: number;
}
// POST /recipes/
export interface IRecipeCreateRequestDTO {
    name: string;
    description: string;
    authorId: string;
    ingredients: IIngredientHasRecipeDTO[];
    prepTime: number;
    cookTime: number;
    plantIds: string[];
    imageUrl?: string;
    steps: string[];
    dietType: DietType;
}