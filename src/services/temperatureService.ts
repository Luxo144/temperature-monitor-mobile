import { TemperatureData, Thresholds } from '../types/types';
import { API_URL } from '@env';

export const temperatureService = {
  async getCurrentTemperature(): Promise<number> {
    try {
      const response = await fetch(`${API_URL}/temperature`);
      const data = await response.json();
      return data.temperature;
    } catch (error) {
      console.error('Error fetching temperature:', error);
      throw error;
    }
  },

  checkTemperature(temperature: number, thresholds: Thresholds): boolean {
    const min = parseFloat(thresholds.min);
    const max = parseFloat(thresholds.max);
    return !isNaN(min) && !isNaN(max) && temperature >= min && temperature <= max;
  },

  getTemperatureMessage(temperature: number, thresholds: Thresholds): string {
    const min = parseFloat(thresholds.min);
    const max = parseFloat(thresholds.max);
    
    if (temperature < min) {
      return `La temperatura (${temperature}°C) está por debajo del mínimo (${min}°C)`;
    }
    return `La temperatura (${temperature}°C) está por encima del máximo (${max}°C)`;
  }
};