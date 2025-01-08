import { ref, set } from 'firebase/database';
import { db } from '../config/firebase';

export const initializeData = async () => {
  try {
    await set(ref(db, 'temperature/current'), 25);
    await set(ref(db, 'temperature/history/-init'), {
      temperature: 25,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};