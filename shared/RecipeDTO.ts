//import type { IUserDTO } from "./UserDTO";
//export type DietType = "none" | "vegan" | "vegetarian";

export interface IRecipeDTO { // Base class. GET /recipes/. Response.
    id: number;
    name: string;
    description: string;
    authorId: number;
    ingredients: IIngredientHasRecipeDTO[];
    //prepTime: number;
    //cookTime: number;
    //dietType: DietType;
    imageUrl: string;
    //steps: string[];
}
export interface IIngredientHasRecipeDTO {
    id: number;
    name: string;
    unit: string;
    amount: number;
}
// POST /recipes/
export interface IRecipeCreateRequestDTO {
    name: string;
    description: string;
    //authorId: string;
    ingredients: IIngredientHasRecipeCreateRequestDTO[];
    //prepTime: number;
    //cookTime: number;
    //plantIds: string[];
    image: File;
    //steps: string[];
    //dietType: DietType;
}

export interface IIngredientHasRecipeCreateRequestDTO {
    name: string;
    unit: string;
    amount: number;
}
