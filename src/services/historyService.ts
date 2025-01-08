import { ref, query, orderByChild, limitToLast, get } from 'firebase/database';
import { db } from '../config/firebase';
import { TemperatureData } from '../types/types';

export const historyService = {
  async getTemperatureHistory(): Promise<TemperatureData[]> {
    const historyRef = ref(db, 'temperature/history');
    const historyQuery = query(historyRef, orderByChild('timestamp'), limitToLast(100));
    const snapshot = await get(historyQuery);
    
    const history: TemperatureData[] = [];
    snapshot.forEach((child) => {
      history.push(child.val());
    });
    
    return history.reverse();
  }
};