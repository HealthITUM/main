import type { IUserDTO } from "./UserDTO.js";

export interface IRecipeDTO { // Base class. GET /recipes/. Response.
    id: string;
    name: string;
    description: string;
    author: IUserDTO;
    ingredients: IIngredientHasRecipeDTO[];
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
}