import type { IUserPlantUpdateRequestDTO } from "@project/shared";

export interface IUserPlantCreateModel {
    plantSpecieId: number;
    name: string;
    imagePath: string;
    userId: number;
}

export interface IUserPlantUpdateModel extends Partial<IUserPlantUpdateRequestDTO> {
    id: number;
}