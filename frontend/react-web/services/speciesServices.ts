import { api } from "./api";
import type { ISpecieDTO } from "@project/shared";

export const specieService = {
    getAll: async ():
    Promise<ISpecieDTO[]> => {
        const response = await api.get<ISpecieDTO[]>("/species");
        return response.data;
    },

    getById: async (id: string):
    Promise<ISpecieDTO> => {
        const response = await api.get<ISpecieDTO>(`/species/${id}`);
        return response.data;
    },
};