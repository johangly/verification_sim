import { API_BASE_URL } from './api';
import { PromoterDataGet,PromoterDataPost,PromoterDataPut} from '../types/promoter';
export class PromoterService {
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
    async createPromoter(data: PromoterDataPost): Promise<PromoterDataGet> {
		return this.request<PromoterDataGet>(
			'/promoters/create-promoter',
			{
				method: 'POST',
				body: JSON.stringify(data),
			}
		);
	}
    async updatePromoter(data: PromoterDataPut): Promise<PromoterDataGet> {
        return this.request<PromoterDataGet>(
            `/promoters/update-promoter/${data.id}`,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            }
        );
    }
    async getAllPromoters(): Promise<PromoterDataGet[]> {
        return this.request<PromoterDataGet[]>('/promoters');
    }
    async getPromoterById(id: number): Promise<PromoterDataGet> {
        return this.request<PromoterDataGet >(`/promoters/${id}`);
    }
}
export const promoterService = new PromoterService();