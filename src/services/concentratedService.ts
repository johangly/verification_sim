import { API_BASE_URL } from './api';
import { ConcentratedDataGet,ConcentratedDataPost,ConcentratedDataPut } from '../types/concentrated';
export class ConcentratedService {
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
				.catch(() => ({ message: response.statusText }));
			throw new Error(
				`HTTP error! status: ${response.status}, message: ${errorData.message}`
			);
		}

		return response.json();
	}
    async createConcentrated(data: ConcentratedDataPost): Promise<ConcentratedDataGet> {
		return this.request<ConcentratedDataGet>(
			'/concentrated/create-concentrated',
			{
				method: 'POST',
				body: JSON.stringify(data),
			}
		);
	}
    async updateConcentrated(data: ConcentratedDataPut): Promise<ConcentratedDataGet> {
        return this.request<ConcentratedDataGet>(
            `/concentrated/update-concentrated/${data.id}`,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            }
        );
    }
    async getAllConcentrated(): Promise<ConcentratedDataGet[]> {
        return this.request<ConcentratedDataGet[]>('/concentrated');    
    }
    async getConcentratedById(id: number): Promise<ConcentratedDataGet> {
        return this.request<ConcentratedDataGet>(`/concentrated/${id}`);
    }
}
export const concentratedService = new ConcentratedService();