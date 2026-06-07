import type { IIngredientHasRecipeCreateRequestDTO } from "@project/shared";

export interface IRecipeCreateModel {
    name: string;
    description: string;
    ingredients: IIngredientHasRecipeCreateRequestDTO[];
    authorId: number;
    imageUrl: string;
}