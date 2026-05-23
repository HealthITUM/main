import type { IRecipeDTO } from "@project/shared";
import type { IRecipeCreateModel } from "../models/Recipe.js";
import type { IIngredientHasRecipeDTO } from "@project/shared"
import { prisma } from "../lib/prisma.js";

export class RecipeRepository {
    async getRecipes(amount? : number) : Promise<IRecipeDTO[] | null> {
        const result = await prisma.recipes.findMany({
            take: 10,
            include: {
                ingredients: true
            }
        });

        if (!result) {
            return null;
        }
        
        const recipes: IRecipeDTO[] = result.map((result) => {
            const ingredients: IIngredientHasRecipeDTO[] = (result.ingredients || []).map((item) => {
                return {
                    id: Number(item?.id),
                    name: String(item?.name),
                    unit: String(item?.unit),
                    amount: Number(item?.amount)
                };
            });

            return {
                id: Number(result?.id),
                name: String(result?.dishName),
                description: String(result?.description),
                authorId: Number(result?.fkUserId),
                imageUrl: String(result?.imagePath),
                ingredients: ingredients
            };
        });

        return recipes;
    }

    async getById(id : number) : Promise<IRecipeDTO | null> {
        const result = await prisma.recipes.findUnique({
            where: {id: id},
            include: { ingredients: true },
        });

        if (!result) {
            return null;
        }

        const ingredients: IIngredientHasRecipeDTO[] = (result.ingredients || []).map((item) => {
            return {
                id: Number(item?.id),
                name: String(item?.name),
                unit: String(item?.unit),
                amount: Number(item?.amount)
            };
        });

        const recipe: IRecipeDTO = {
            id: Number(result?.id),
            name: String(result?.dishName),
            description: String(result?.description),
            authorId: Number(result?.fkUserId),
            imageUrl: String(result?.imagePath),
            ingredients: ingredients
        };
        
        return recipe;
    }

    async create(data : IRecipeCreateModel) : Promise<boolean> {
        try {
            const newRecipe = await prisma.recipes.create({
                data: {
                    dishName: data.name,
                    description: data.description,
                    imagePath: data.imageUrl,
                    author: {
                        connect: { id: data.authorId }
                    },
                    ingredients: {
                        connect: data.ingredients.map((ingredient) => ({
                            id: ingredient.id
                        }))
                    }
                }
            });
    
            return !!newRecipe;

        } catch (error) {
            console.error("Failed to create recipe:", error);
            return false;
        }
    }

    async delete(recipeId : number, userId: number) : Promise<boolean> {
        try {
            const deleteResult = await prisma.recipes.deleteMany({
              where: {
                id: recipeId,
                fkUserId: userId,
              },
            });

            if (deleteResult.count === 0) {
                return false;
            }
            return true;
            
        } catch (error) {
            console.error("Failed to delete recipe:", error);
            return false;
        }
    }
}

export const recipeRepository = new RecipeRepository();