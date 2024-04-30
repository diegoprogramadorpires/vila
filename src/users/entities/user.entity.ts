export class User {
    id?: string;
    email: string;
    cpf: string;
    password: string;
    name: string;
}

export interface CreateUserResponse {
    id: string;
    username;
}
