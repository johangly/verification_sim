import { PhoneNumber, CreatePhoneNumberRequest, UpdatePhoneNumberRequest } from '../types/phoneNumber';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/verificationsim';

class PhoneNumberService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getAllPhoneNumbers(): Promise<PhoneNumber[]> {
    return this.request<PhoneNumber[]>('/phonenumbers');
  }

  async getPhoneNumberById(id: number): Promise<PhoneNumber> {
    return this.request<PhoneNumber>(`/phonenumbers/${id}`);
  }

  async createPhoneNumber(data: CreatePhoneNumberRequest): Promise<PhoneNumber> {
    return this.request<PhoneNumber>('/phonenumbers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePhoneNumber(id: number, data: UpdatePhoneNumberRequest): Promise<PhoneNumber> {
    return this.request<PhoneNumber>(`/phonenumbers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePhoneNumber(id: number): Promise<void> {
    await this.request<void>(`/phonenumbers/${id}`, {
      method: 'DELETE',
    });
  }
}

export const phoneNumberService = new PhoneNumberService();