import { api } from "./api";
import type { IRecipeDTO } from "@project/shared";

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

    create: async (data: FormData
    ): Promise<IRecipeDTO> => {
        const response = await api.post<IRecipeDTO>("/recipes", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    },

    update: async (
        id: string,
        data: FormData
    ): Promise<IRecipeDTO> => {
        const response = await api.patch<IRecipeDTO>(`/recipes/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    },

    delete: async (id: string):
    Promise<void> => {
        await api.delete(`/recipes/${id}`);
    },

    uploadImage: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    },
};