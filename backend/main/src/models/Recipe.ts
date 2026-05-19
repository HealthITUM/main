import type { IIngredientHasRecipeDTO } from "@project/shared";

export interface IRecipeCreateModel {
    name: string;
    description: string;
    ingredients: IIngredientHasRecipeDTO[];
    authorId: number;
    imageUrl: string;
}