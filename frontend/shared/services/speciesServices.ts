//import { api } from "../../react-web/src/api";
import type { ISpeciesDTO } from "@project/shared";
import type { AxiosInstance } from "axios";
//exports object with all plant specie related API functions
export const specieService = (api: AxiosInstance) => ({
    //fetch all plants from backend - to populate dropdown selection
    getAll: async ():
    Promise<ISpeciesDTO[]> => {
        //backend: GET /species
        const response = await api.get<ISpeciesDTO[]>("/species");
        //return ISpeciesDTO[]
        return response.data;
    },
    //fetched one specific species by ID
    getById: async (id: string):
    Promise<ISpeciesDTO> => {
        //backend: GET /species/:id
        const response = await api.get<ISpeciesDTO>(`/species/${id}`);
        //ISpeciesDTO
        return response.data;
    },
});