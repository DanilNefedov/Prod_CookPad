export type RegisterErrorState = {
    server?: boolean;
    email?: boolean;
    post?: boolean;
};


export type RegisterResult = {
    error: RegisterErrorState | null;
};


export interface UploadFileParams {
    connection_id: string;
    image: File;
}

export interface RegisterFormData {
    email: string;
    password: string;
    name: string;
    image: string;
    connection_id: string;
}






export type InputErrorState = {
    email: boolean;
    password: boolean;
    name: boolean;
    image: boolean;
};






export type State = {
    error: boolean;
    email: string;
    success?: boolean;
};

