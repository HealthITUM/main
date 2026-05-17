import { api } from "./api";
import type { IRecipeDTO, IRecipeCreateRequestDTO } from "@project/shared";

export const recipeService = {
    getAll: async ()
    : Promise<IRecipeDTO[]> => {
        const response = await api.get<IRecipeDTO[]>("/recipes");
        return response.data;
    },

    getById: async (id: string)
    : Promise<IRecipeDTO> => {
        const response = await api.get<IRecipeDTO>(`/recipes/${id}`);
        return response.data;
    },

    create: async (
        data: IRecipeCreateRequestDTO
    ): Promise<IRecipeDTO> => {
        const response = await api.post<IRecipeDTO>("/recipes", data);
        return response.data;
    },

    update: async (
        id: string,
        data: IRecipeCreateRequestDTO
    ): Promise<IRecipeDTO> => {
        const response = await api.put<IRecipeDTO>(`/recipes/${id}`, data);
        return response.data;
    },

    delete: async (id: string):
    Promise<void> => {
        await api.delete(`/recipes/${id}`);
    },
};