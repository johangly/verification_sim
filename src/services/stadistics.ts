import { API_BASE_URL } from './api';
import type { TypeStatistics } from '../types/stadistics'


class StatisticsService {
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
    
    async getGeneralStatistics(type: 'cached' | 'refresh' = 'cached'): Promise<TypeStatistics> {
        return this.request<TypeStatistics>(`/estadisticas?type=${type}`);
    }
    async getStatisticsByRangeDays(){
        return this.request('/estadisticas/phonesbydaysrange/120');
    }
}

export const statisticsService = new StatisticsService();
