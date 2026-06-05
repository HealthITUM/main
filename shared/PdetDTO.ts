export interface IPlantDetectionCreateRequestDTO { // POST api/pdet/. REQUEST.
    image : File;
}

export interface IPlantDetectionCreateResponseDTO { // POST api/pdet/. RESPONSE.
    requestId : number;
}

export type RequestStatus = 'PENDING' | 'DONE' | 'FAILED';

export interface IPlantDetectionsDTO { // GET api/pdet/:id. RESPONSE
    type : RequestStatus;
    id : number;
    imageUrl : string;
    plantSpeciesId : number | null; // <- ONLY IF DONE, ELSE -1
}