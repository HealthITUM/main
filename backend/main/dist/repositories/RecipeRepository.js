import { getPublicUrl } from "../configs/storage.config.js";
import { prisma } from "../lib/prisma.js";
export class RecipeRepository {
    async getRecipes(amount) {
        const result = await prisma.recipes.findMany({
            take: 10,
            include: {
                ingredients: true
            }
        });
        if (!result) {
            return null;
        }
        const recipes = result.map((item) => {
            const ingredients = (item.ingredients || []).map((ing) => {
                return {
                    id: Number(ing?.id),
                    name: String(ing?.name),
                    unit: String(ing?.unit),
                    amount: Number(ing?.amount)
                };
            });
            return {
                id: Number(item?.id),
                name: String(item?.dishName),
                description: String(item?.description),
                authorId: Number(item?.fkUserId),
                imageUrl: getPublicUrl(String(item?.imagePath)),
                ingredients: ingredients
            };
        });
        return recipes;
    }
    async getById(id) {
        const result = await prisma.recipes.findUnique({
            where: { id: id },
            include: { ingredients: true },
        });
        if (!result) {
            return null;
        }
        const ingredients = (result.ingredients || []).map((item) => {
            return {
                id: Number(item?.id),
                name: String(item?.name),
                unit: String(item?.unit),
                amount: Number(item?.amount)
            };
        });
        const recipe = {
            id: Number(result?.id),
            name: String(result?.dishName),
            description: String(result?.description),
            authorId: Number(result?.fkUserId),
            imageUrl: getPublicUrl(String(result?.imagePath)),
            ingredients: ingredients
        };
        return recipe;
    }
    async create(data) {
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
                        create: data.ingredients.map((ingredient) => ({
                            name: ingredient.name,
                            amount: ingredient.amount,
                            unit: ingredient.unit,
                        }))
                    }
                }
            });
            return !!newRecipe;
        }
        catch (error) {
            console.error("Failed to create recipe:", error);
            return false;
        }
    }
    async delete(recipeId, userId) {
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
        }
        catch (error) {
            console.error("Failed to delete recipe:", error);
            return false;
        }
    }
}
export const recipeRepository = new RecipeRepository();
