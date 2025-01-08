import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import { TemperatureDisplay } from '../components/TemperatureDisplay';
import { ThresholdInputs } from '../components/ThresholdInputs';
import { TemperatureChart } from '../components/TemperatureChart';
import { notificationService } from '../services/notificationService';
import { storageService } from '../services/storageService';
import { TemperatureData, Thresholds } from '../types/types';
import { initializeData } from '../utils/initializeData';
import { startTemperatureSimulation } from '../utils/temperatureSimulator';

const MAX_HISTORY_LENGTH = 6;

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentTemp, setCurrentTemp] = useState<number>(0);
  const [thresholds, setThresholds] = useState<Thresholds>({ min: '20', max: '30' });
  const [tempInputs, setTempInputs] = useState<Thresholds>({ min: '20', max: '30' });
  const [temperatureHistory, setTemperatureHistory] = useState<TemperatureData[]>([]);
  const [isWithinThresholds, setIsWithinThresholds] = useState<boolean>(true);
  const [inputError, setInputError] = useState<string>('');
  const lastNotificationTemp = useRef<number>(0);

  const checkThresholds = useCallback(async (temperature: number) => {
    setIsWithinThresholds(current => {
      const min = parseFloat(thresholds.min);
      const max = parseFloat(thresholds.max);
      
      const isWithin = !isNaN(min) && !isNaN(max) && temperature >= min && temperature <= max;
      
      if (!isWithin && temperature !== lastNotificationTemp.current) {
        notificationService.sendTemperatureAlert(temperature, min, max);
        lastNotificationTemp.current = temperature;
      }
      
      return isWithin;
    });
  }, [thresholds]);

  useEffect(() => {
    const loadInitialData = async () => {
      await notificationService.requestUserPermission();
      const savedThresholds = await storageService.loadThresholds();
      if (savedThresholds) {
        setThresholds(savedThresholds);
        setTempInputs(savedThresholds);
      }
    };
    initializeData();
    loadInitialData();
    startTemperatureSimulation();
  }, []);

  useEffect(() => {
    const currentTempRef = ref(db, 'temperature/current');
    const unsubscribeTemp = onValue(currentTempRef, (snapshot) => {
      const temp = snapshot.val();
      setCurrentTemp(prevTemp => {
        if (prevTemp !== temp) {
          checkThresholds(temp);
        }
        return temp;
      });
      updateTemperatureHistory(temp);
    });

    const historyRef = ref(db, 'temperature/history');
    const unsubscribeHistory = onValue(historyRef, (snapshot) => {
      const historyData: TemperatureData[] = [];
      snapshot.forEach((child) => {
        historyData.push(child.val());
      });
      setTemperatureHistory(historyData.slice(-MAX_HISTORY_LENGTH).reverse());
    });

    return () => {
      unsubscribeTemp();
      unsubscribeHistory();
    };
  }, [checkThresholds]);

  const updateTemperatureHistory = (newTemp: number) => {
    const newEntry: TemperatureData = {
      temperature: newTemp,
      timestamp: new Date().toISOString()
    };

    setTemperatureHistory(prevHistory => {
      const newHistory = [...prevHistory, newEntry];
      return newHistory.slice(-MAX_HISTORY_LENGTH);
    });
  };

  const handleInputChange = (type: 'min' | 'max', value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTempInputs(prev => ({ ...prev, [type]: value }));
    }
  };

  const validateAndSaveThresholds = async (type: 'min' | 'max', value: string) => {
    if (!value.trim() || isNaN(parseFloat(value))) {
      setTempInputs(thresholds);
      return;
    }

    const newInputs = { ...tempInputs };
    newInputs[type] = value;

    const min = parseFloat(newInputs.min);
    const max = parseFloat(newInputs.max);

    if (min >= max) {
      setInputError('El valor mínimo debe ser menor que el máximo');
      setTempInputs(thresholds);
      return;
    }

    setInputError('');
    try {
      await storageService.saveThresholds(newInputs);
      setThresholds(newInputs);
      console.log('New thresholds after save:', newInputs);
      lastNotificationTemp.current = 0;
    } catch (error) {
      console.error('Error saving thresholds:', error);
      setTempInputs(thresholds);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Monitor de Temperatura</Text>

        <TemperatureDisplay 
          currentTemp={currentTemp}
          isWithinThresholds={isWithinThresholds}
        />

        <ThresholdInputs
          thresholds={thresholds}
          tempInputs={tempInputs}
          onInputChange={handleInputChange}
          onInputBlur={validateAndSaveThresholds}
          inputError={inputError}
        />

        {temperatureHistory.length > 0 && (
          <TemperatureChart 
            temperatureHistory={temperatureHistory}
          />
        )}

        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.historyButtonText}>Ver Historial Completo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  historyButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});