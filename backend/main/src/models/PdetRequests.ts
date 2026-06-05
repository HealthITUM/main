import type { RequestStatus } from "@project/shared"

export interface IPlantDetectionCreateModel {
    imageUrl : string;
    userId : number;
}

export interface IPlantDetectionUpdateModel {
    id : number;
    plantSpeciesId? : number;
    status : RequestStatus;
}