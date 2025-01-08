import { ref, push, set } from 'firebase/database';
import { db } from '../config/firebase';

const getRandomTemperature = (min: number, max: number) => {
  return +(min + Math.random() * (max - min)).toFixed(1);
};

export const startTemperatureSimulation = () => {
  const updateTemperature = async () => {
    try {
      const temp = getRandomTemperature(15, 35);
      
      // Actualizar temperatura actual
      await set(ref(db, 'temperature/current'), temp);
      
      // Agregar al historial
      const historyRef = ref(db, 'temperature/history');
      await push(historyRef, {
        temperature: temp,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating temperature:', error);
    }
  };

  // Actualizar cada 5 segundos
  updateTemperature();
  return setInterval(updateTemperature, 5000);
};