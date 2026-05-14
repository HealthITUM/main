// GET user/me
export interface IUser { // Basic class.
    id: string;
    username: string;
    email: string;
}

// POST user/register. Request.
export interface IUserRegisterDTO { // FRONTEND -> BACKEND. REGISTRATION.
    username: string;
    email: string;
    password: string;
}

// POST user/login. Request.
export interface IUserLoginDTO { // FRONTEND -> BACKEND. LOGIN.
    username: string;
    email: string;
    password: string;
}

// POST user/login. Response.
export interface IUserLoginResponseDTO extends IUser { // BACKEND -> FRONTEND. LOGIN.
    token: string;
}

// PATCH user/me. Request.
export interface IUserUpdateDTO extends Partial<IUser> { // FRONTEND -> BACKEND. UPDATE.
    password?: string;
}