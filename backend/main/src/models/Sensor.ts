export interface ISensorCreateModel {
    userPlantId: number;
}

export interface ISensorUpdateModel {
    userPlantId: number;
    online : boolean;
    last_seen : Date;
}