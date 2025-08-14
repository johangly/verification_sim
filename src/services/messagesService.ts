import { API_BASE_URL } from './api';
import { PhoneNumber } from '../types/phoneNumber';

interface SendMessageRequest {
  phoneNumbers: string[];
}

interface MessageResult {
  phoneNumber: string;
  status: 'success' | 'error';
  messageId?: string;
  error?: string;
}

interface SendMessageResponse {
  status: string;
  message: string;
  results: MessageResult[];
  updatedNumbers: PhoneNumber[];
}

export class MessagesService {
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

  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    return this.request<SendMessageResponse>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async handleResponse(data: any): Promise<any> {
    return this.request<any>('/messages/response', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const messagesService = new MessagesService();