import { api } from "./api";
import type { IRecipeDTO } from "@project/shared";
//exports object with all recipe related API functions
export const recipeService = {
    //fetch all recipes
    getAll: async ()
    : Promise<IRecipeDTO[]> => {
        // GET /recipes
        const response = await api.get<IRecipeDTO[]>("/recipes");
        //returns IRecipeDTO[]
        return response.data;
    },
    //fetch single recipe by ID
    getById: async (id: string)
    : Promise<IRecipeDTO> => {
        //backend: GET /recipes/:id
        const response = await api.get<IRecipeDTO>(`/recipes/${id}`);
        return response.data;
    },
    //create a new recipe + image upload
    //form data because we have text fields and file uploads
    create: async (data: FormData
    ): Promise<IRecipeDTO> => {
        //POST /recipes
        const response = await api.post<IRecipeDTO>("/recipes", data, {
            //multipart request
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        //returns IRecipeDTO
        return response.data;
    },
    //update existing recipe
    //form data dor image as well
    update: async (
        id: string,
        data: FormData
    ): Promise<IRecipeDTO> => {
        //PATCH /recipes/:id
        const response = await api.patch<IRecipeDTO>(`/recipes/${id}`, data, {
            //multipart request
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    },
    //deletes a recipe
    delete: async (id: string):
    Promise<void> => {
        //DELETE /recipes/:id
        await api.delete(`/recipes/${id}`);
    },
    /*
    //upload a single image file - seperate from recipes
    uploadImage: async (file: File): Promise<{ url: string }> => {
        //whaps file into multipart form
        const formData = new FormData();
        formData.append("file", file);
        //multipart form
        //endpoint: POST /upload
        const response = await api.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        //returns {url: string}
        return response.data;
    },*/
};