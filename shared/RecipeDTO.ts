export interface IRecipeDTO { // Base class. GET /recipes/. Response.
    id: number;
    name: string;
    description: string;
    authorId: number;   
    ingredients: IIngredientHasRecipeDTO[];
    imageUrl: string;
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
    ingredients: IIngredientHasRecipeCreateRequestDTO[];
    image: File;
}

export interface IIngredientHasRecipeCreateRequestDTO {
    name: string;
    unit: string;
    amount: number;
}