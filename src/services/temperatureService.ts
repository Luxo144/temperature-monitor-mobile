import { ref, onValue, get, child } from 'firebase/database';
import { db } from '../config/firebase';
import { TemperatureData, Thresholds } from '../types/types';

export const temperatureService = {
  subscribeToTemperature(callback: (temp: number) => void) {
    const tempRef = ref(db, 'temperature/current');
    return onValue(tempRef, (snapshot) => {
      const temp = snapshot.val();
      callback(temp);
    });
  },

  async getCurrentTemperature(): Promise<number> {
    const tempRef = ref(db, 'temperature/current');
    const snapshot = await get(tempRef);
    return snapshot.val();
  },

  checkTemperature(temperature: number, thresholds: Thresholds): boolean {
    const min = parseFloat(thresholds.min);
    const max = parseFloat(thresholds.max);
    return !isNaN(min) && !isNaN(max) && temperature >= min && temperature <= max;
  }
};