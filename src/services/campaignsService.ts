import { API_BASE_URL } from './api';
import { CampaignType } from '../types/campaigns';

export class CampaignsService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

  async getCampaigns(): Promise<CampaignType[]> {
    return this.request<CampaignType[]>('/campaigns', {
      method: 'GET',
    });
  }
}

export const campaignsService = new CampaignsService();