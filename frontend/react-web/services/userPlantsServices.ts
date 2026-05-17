import { api } from "./api";
import type { IUserPlantDTO, IUserPlantCreateRequestDTO, IUserPlantUpdateRequestDTO, ISensorDTO, IMeasurementDTO } from "@project/shared";

export const userPlantService = {
    getAll: async ():
    Promise<IUserPlantDTO[]> => {
        const response = await api.get<IUserPlantDTO[]>("/my/plants");
        return response.data;
    },

    getById: async (id: string):
    Promise<IUserPlantDTO> => {
        const response = await api.get<IUserPlantDTO>(`/my/plant/${id}`);
        return response.data;
    },

    create: async (
        data: IUserPlantCreateRequestDTO
    ): Promise<IUserPlantDTO> => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("plant_specie", data.plant_specie.id);
        formData.append("image", data.image);

        const response = await api.post<IUserPlantDTO>("/my/plants", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
    },

    update: async (
        id: string,
        data: IUserPlantUpdateRequestDTO
    ): Promise<IUserPlantDTO> => {
        const response = await api.patch<IUserPlantDTO>(`/my/plants/${id}`, data);
        return response.data;
    },

    delete: async (id: string):
    Promise<void> => {
        await api.delete(`/my/plants/${id}`);
    },

    getSensors: async (plantId: string):
    Promise<ISensorDTO[]> => {
        const response = await api.get<ISensorDTO[]>(`/my/plants/${plantId}/sensors`);
        return response.data;
    },

    getMeasurements: async (plantId: string):
    Promise<IMeasurementDTO[]> => {
        const response = await api.get<IMeasurementDTO[]>(`/my/plants/${plantId}/measurement`);
        return response.data;
    },
};7