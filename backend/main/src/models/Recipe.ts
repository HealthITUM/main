import type { IIngredientHasRecipeDTO } from "@project/shared";

export interface IRecipeCreateServiceInput {
    name: string;
    description: string;
    ingredients: IIngredientHasRecipeDTO[];
    authorId: number;
    imageUrl: string;
}