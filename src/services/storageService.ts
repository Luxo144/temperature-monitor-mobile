import AsyncStorage from '@react-native-async-storage/async-storage';
import { Thresholds } from '../types/types';

const THRESHOLDS_KEY = 'thresholds';

export const storageService = {
  async saveThresholds(thresholds: Thresholds): Promise<void> {
    try {
      await AsyncStorage.setItem(THRESHOLDS_KEY, JSON.stringify(thresholds));
    } catch (error) {
      console.error('Error saving thresholds:', error);
      throw error;
    }
  },

  async loadThresholds(): Promise<Thresholds | null> {
    try {
      const savedThresholds = await AsyncStorage.getItem(THRESHOLDS_KEY);
      return savedThresholds ? JSON.parse(savedThresholds) : null;
    } catch (error) {
      console.error('Error loading thresholds:', error);
      throw error;
    }
  }
};