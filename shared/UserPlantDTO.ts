export interface IUserPlantDTO { // Base class.
    id: number;
    plantSpecieId: number;
    name: string;
    imageUrl: string; // <- OR FILE.
}

// GET my/plants/ OR GET my/plants/:id -> IUserPlant as a RESPONSE.

// POST /my/plants/. Request.
export interface IUserPlantCreateRequestDTO {
    plantSpecieId: number;
    name: string;
    image: File;
}
// PATCH /my/plants/:id. Request.
export interface IUserPlantUpdateRequestDTO 
    extends Partial<Omit<IUserPlantCreateRequestDTO, 'image'>> {}
    
// SENSORS.
export interface ISensorDTO { // Base class. GET my/plants/:id/sensors
    id: number;
    internal_chip_id: string;
    last_seen: Date;
    online: boolean;
}

// MEASUREMENT. GET my/plants/:id/measurement
export interface IMeasurementDTO {
    id: number;
    values: JSON;
    timestamp: Date;
    plantId: number;
}