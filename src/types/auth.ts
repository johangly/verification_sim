export interface Login{
    email: string;
    password: string;
}
export interface LoginGetResponse{
    message: string;
    user: {
        id: string;
        code: string;
        name: string;
        email: string;
        role: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        lastLogin: string | null;
    }
}