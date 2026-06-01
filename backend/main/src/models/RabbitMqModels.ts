export interface IScrapperTaskModel {
    // TODO
}

export interface IPlantDetectionTaskModel {
    requestId : number;
    imageUrl : string;
}

export interface INotificationDataModel {
    userId : number;
    token : string;
    title : string;
    body : string;
}