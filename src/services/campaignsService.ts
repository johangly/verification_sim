import { API_BASE_URL } from './api';
import { CampaignType } from '../types/campaigns';
import { CreatePhoneNumberByFileRequest, PhoneNumber } from '../types/phoneNumber';

export class CampaignsService {
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

  async getCampaigns(): Promise<CampaignType[]> {
    return this.request<CampaignType[]>('/campaigns', {
      method: 'GET',
    });
  }

  async createFullCampaign(data:{phoneNumbers:PhoneNumber[]}): Promise<any> {
    return this.request<PhoneNumber[]>('/campaigns/create-full-campaign', {
      method: 'POST',
	  body: JSON.stringify(data),
    });
  }

  async getCampaignById(id:number):Promise<CampaignType>{
    return this.request<CampaignType>(`/campaigns/${id}`, {
      method: 'GET',
    });
  }

  async readClientsByFile(
      data: CreatePhoneNumberByFileRequest
    ): Promise<{ phoneNumbersToCreate: PhoneNumber[] }> {
      const formData = new FormData();
      formData.append("file", data.file);
  
      return this.request<{ phoneNumbersToCreate: PhoneNumber[] }>("/campaigns/file", {
        method: "POST",
        body: formData,
      });
    }
}

export const campaignsService = new CampaignsService();