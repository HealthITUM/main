// GET user/me
export interface IUserDTO { // Basic class.
    id: number;
    username: string;
    email: string;
}

// POST user/register. Request.
export interface IUserRegisterRequestDTO { // FRONTEND -> BACKEND. REGISTRATION.
    username: string;
    email: string;
    password: string;
}

// POST user/login. Request.
export interface IUserLoginRequestDTO { // FRONTEND -> BACKEND. LOGIN.
    username: string;
    email: string;
    password: string;
}

// POST user/login. Response.
export interface IUserLoginResponseDTO extends IUserDTO { // BACKEND -> FRONTEND. LOGIN.
    token: string;
}

// PATCH user/me. Request.
export interface IUserUpdateRequestDTO extends Partial<IUserDTO> { // FRONTEND -> BACKEND. UPDATE.
    password?: string;
}