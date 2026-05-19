import { api } from "./api";
import type { IUserPlantDTO, IUserPlantCreateRequestDTO, ISensorDTO, IMeasurementDTO } from "@project/shared";
//exports object with all user plants related API functions
export const userPlantService = {
    //fetches all plants for logged in user
    getAll: async ():
    Promise<IUserPlantDTO[]> => {
        //backend - GET /my/plants - returns IUserPlantDTO
        const response = await api.get<IUserPlantDTO[]>("/my/plants");
        return response.data;
    },
    //fetches single plant details
    getById: async (id: string):
    Promise<IUserPlantDTO> => {
        //backend: GET /my/plants/:id
        const response = await api.get<IUserPlantDTO>(`/my/plants/${id}`);
        return response.data;
    },
    //creates a new plant with image upload - thats why important: formData
    create: async (
        data: IUserPlantCreateRequestDTO
    ): Promise<IUserPlantDTO> => {
            //we use formdata because we are sending a FILE
            const formData = new FormData();
            //multipart/form-data request
            formData.append("name", data.name);
            formData.append("plant_specie", data.plant_specie.id);
            formData.append("image", data.image);
            //backend: POST /my/plants
            const response = await api.post<IUserPlantDTO>("/my/plants", formData, {
                //multipart request
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        //returns IUserPlantDTO
        return response.data;
    },
    //updates existing plant - image optional
    //formData: for image upload - optional
    update: async (
        id: string,
        formData: FormData
    ): Promise<IUserPlantDTO> => {
        //backend PATCH /my/plants/:id
        const response = await api.patch<IUserPlantDTO>(
            `/my/plants/${id}`,
            formData,
            {
                //multipart request
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    },
    //delete plant
    delete: async (id: string):
    Promise<void> => {
        //backend DELETE /my/plants/:id
        await api.delete(`/my/plants/${id}`);
    },

    //sensor functions
    getSensors: async (plantId: string):
    Promise<ISensorDTO[]> => {
        //backend: GET /my/plants/:id/sensors
        const response = await api.get<ISensorDTO[]>(`/my/plants/${plantId}/sensors`);
        //returns ISensorsDTO[]
        return response.data;
    },
    //sensor history
    getMeasurements: async (plantId: string):
    Promise<IMeasurementDTO[]> => {
        //GET /my/plants/:id/measurement
        const response = await api.get<IMeasurementDTO[]>(`/my/plants/${plantId}/measurement`);
        //returns: IMeasurementDTO[]
        return response.data;
    },
    //body: name: string
    addSensor: async (plantId: string,
        data: { name: string }
    ): Promise<ISensorDTO> => {
        //POST /my/plants/:id/sensors
        const response = await api.post<ISensorDTO>(
            `/my/plants/${plantId}/sensors`,
            data
        );
        //returns: ISensorDTO
        return response.data;
    },

    deleteSensor: async (plantId: string, sensorId: string)
    : Promise<void> => {
        //DELETE /my/plants/:id/sensors/:sensorId
        await api.delete(`/my/plants/${plantId}/sensors/${sensorId}`);
    },
};