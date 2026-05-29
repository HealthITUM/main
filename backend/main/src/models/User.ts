export interface IUserCreateModel {
    username: string;
    email: string;
    passwordHash: string;
}

export interface IUserFcmTokenAssignModel {
    id : number;
    fcmToken : string;
}

export interface IUser extends IUserCreateModel {
    id: number;
}