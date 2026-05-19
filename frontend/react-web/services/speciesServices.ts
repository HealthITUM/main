import { api } from "./api";
import type { ISpecieDTO } from "@project/shared";
//exports object with all plant specie related API functions
export const specieService = {
    //fetch all plants from backend - to populate dropdown selection
    getAll: async ():
    Promise<ISpecieDTO[]> => {
        //backend: GET /species
        const response = await api.get<ISpecieDTO[]>("/species");
        //return ISpecieDTO[]
        return response.data;
    },
    //fetched one specific species by ID
    getById: async (id: string):
    Promise<ISpecieDTO> => {
        //backend: GET /species/:id
        const response = await api.get<ISpecieDTO>(`/species/${id}`);
        //ISpecieDTO
        return response.data;
    },
};