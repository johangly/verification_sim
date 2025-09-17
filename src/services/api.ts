import {
	PhoneNumber,
	CreatePhoneNumberRequest,
	CreatePhoneNumberByFileRequest,
	UpdatePhoneNumberRequest,
} from "../types/phoneNumber";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

class PhoneNumberService {
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

	async getAllPhoneNumbers(
		elementsPerPage?: number,
		range?: { start: Date | undefined; end: Date | undefined }
	): Promise<PhoneNumber[]> {
		return this.request<PhoneNumber[]>(
			`/phonenumbers?amount=${elementsPerPage}&start=${range?.start?.toISOString()}&end=${range?.end?.toISOString()}`
		);
	}

	async getPhoneNumberById(id: number): Promise<PhoneNumber> {
		return this.request<PhoneNumber>(`/phonenumbers/${id}`);
	}

	async createPhoneNumber(
		data: CreatePhoneNumberRequest
	): Promise<PhoneNumber> {
		return this.request<PhoneNumber>("/phonenumbers", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async createPhoneNumberByFile(
		data: CreatePhoneNumberByFileRequest
	): Promise<PhoneNumber> {
		const formData = new FormData();
		formData.append("file", data.file);

		return this.request<PhoneNumber>("/phonenumbers/file", {
			method: "POST",
			body: formData,
		});
	}

	async updatePhoneNumber(
		id: number,
		data: UpdatePhoneNumberRequest
	): Promise<PhoneNumber> {
		return this.request<PhoneNumber>(`/phonenumbers/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deletePhoneNumber(id: number): Promise<void> {
		await this.request<void>(`/phonenumbers/${id}`, {
			method: "DELETE",
		});
	}
}
export { API_BASE_URL };
export const phoneNumberService = new PhoneNumberService();
