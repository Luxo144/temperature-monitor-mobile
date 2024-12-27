import { TemperatureData } from '../types/types';
import { API_URL } from '@env';

export const historyService = {
  async getTemperatureHistory(): Promise<TemperatureData[]> {
    try {
      const response = await fetch(`${API_URL}/temperature/history`);
      const data = await response.json();
      return data.history;
    } catch (error) {
      console.error('Error fetching temperature history:', error);
      throw error;
    }
  }
};