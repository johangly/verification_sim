import { API_BASE_URL } from './api';
import { Login, LoginGetResponse } from '../types/auth'
import toast from 'react-hot-toast';

export class LoginService {
    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        // Asegura que 'headers' sea siempre una instancia de Headers, incluso si options?.headers es undefined.
        const headers = new Headers(options?.headers);

        const finalOptions: RequestInit = {
            ...options,
            headers: headers, // Asigna la instancia de Headers creada
        };

        // Si el cuerpo es FormData, ELIMINA CUALQUIER Content-Type manual.
        // El navegador establecerá el Content-Type correcto con el 'boundary'.
        if (finalOptions.body instanceof FormData) {
            headers.delete("Content-Type");
        } else {
            if (!headers.has("Content-Type")) {
                headers.set("Content-Type", "application/json");
            }
        }

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            finalOptions
        );

        if (!response.ok) {
           
            // Intenta leer el mensaje de error del servidor si está disponible
            const errorData = await response
                .json()
            toast.error(errorData.error)
                throw new Error(
                `HTTP error! status: ${response.status}, message: ${errorData.error}`
            );
        }

        return response.json();
    }
    async login(credentials: Login): Promise<LoginGetResponse> {
        return  this.request<LoginGetResponse>('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }
    async logout(email: string): Promise<void> {
        return this.request<void>('/users/logout', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }
}
export const loginService = new LoginService();