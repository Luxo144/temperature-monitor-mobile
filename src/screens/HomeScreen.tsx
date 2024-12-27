import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TemperatureDisplay } from '../components/TemperatureDisplay';
import { ThresholdInputs } from '../components/ThresholdInputs';
import { TemperatureChart } from '../components/TemperatureChart';
import { temperatureService } from '../services/temperatureService';
import { notificationService } from '../services/notificationService';
import { storageService } from '../services/storageService';
import { TemperatureData, Thresholds } from '../types/types';
import { RootStackParamList } from '../App';
import * as Notifications from 'expo-notifications';

// Define el tipo de navegación para esta pantalla
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Define el límite máximo de historial que se mostrará en la gráfica
const MAX_HISTORY_LENGTH = 6;

// Componente principal de la pantalla Home
export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Hook de navegación
  const [currentTemp, setCurrentTemp] = useState<number>(0); // Estado para la temperatura actual
  const [thresholds, setThresholds] = useState<Thresholds>({ min: '20', max: '30' }); // Umbrales actuales
  const [tempInputs, setTempInputs] = useState<Thresholds>({ min: '20', max: '30' }); // Entrada de umbrales
  const [temperatureHistory, setTemperatureHistory] = useState<TemperatureData[]>([]); // Historial de temperaturas
  const [isWithinThresholds, setIsWithinThresholds] = useState<boolean>(true); // Indicador de si la temperatura está en los umbrales
  const [inputError, setInputError] = useState<string>(''); // Mensaje de error de validación
  const lastNotificationTemp = useRef<number>(0); // Ref para evitar notificaciones repetidas

  // Efecto inicial para configurar permisos y cargar umbrales desde el almacenamiento
  useEffect(() => {
    const initializeApp = async () => {
      await notificationService.requestPermissions(); // Solicita permisos para notificaciones
      const savedThresholds = await storageService.loadThresholds(); // Carga umbrales guardados
      if (savedThresholds) {
        setThresholds(savedThresholds); // Establece umbrales guardados
        setTempInputs(savedThresholds); // Establece entradas con valores guardados
      }
    };

    initializeApp();

    // Configura listeners para notificaciones
    const { notificationListener, responseListener } = notificationService.createNotificationListeners();

    return () => {
      // Limpia listeners al desmontar el componente
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  // Actualiza el historial de temperaturas
  const updateTemperatureHistory = (newTemp: number) => {
    const newEntry: TemperatureData = {
      temperature: newTemp,
      timestamp: new Date().toISOString(), // Registra la fecha actual
    };

    setTemperatureHistory(prevHistory => {
      const newHistory = [...prevHistory, newEntry];
      return newHistory.slice(-MAX_HISTORY_LENGTH); // Mantiene solo las últimas entradas
    });
  };

  // Maneja los cambios en los inputs de umbrales
  const handleInputChange = (type: 'min' | 'max', value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTempInputs(prev => ({ ...prev, [type]: value })); // Actualiza el valor del input
    }
  };

  // Valida y guarda los umbrales ingresados
  const validateAndSaveThresholds = async (type: 'min' | 'max', value: string) => {
    if (!value.trim() || isNaN(parseFloat(value))) {
      setTempInputs(thresholds); // Restaura valores previos si hay un error
      return;
    }

    const newInputs = { ...tempInputs, [type]: value };
    const min = parseFloat(newInputs.min);
    const max = parseFloat(newInputs.max);

    if (min >= max) {
      setInputError('El valor mínimo debe ser menor que el máximo'); // Muestra error
      setTempInputs(thresholds); // Restaura valores previos
      return;
    }

    setInputError(''); // Limpia el error
    try {
      await storageService.saveThresholds(newInputs); // Guarda los nuevos umbrales
      setThresholds(newInputs); // Actualiza los umbrales actuales
      lastNotificationTemp.current = 0; // Reinicia la temperatura de notificación
    } catch (error) {
      console.error('Error saving thresholds:', error);
      setTempInputs(thresholds); // Restaura valores previos en caso de error
    }
  };

  // Efecto para obtener y actualizar la temperatura periódicamente
  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const newTemp = await temperatureService.getCurrentTemperature(); // Obtiene la temperatura actual
        setCurrentTemp(newTemp); // Actualiza el estado
        updateTemperatureHistory(newTemp); // Agrega al historial

        const isWithin = temperatureService.checkTemperature(newTemp, thresholds); // Valida contra umbrales
        setIsWithinThresholds(isWithin);

        if (!isWithin && !isNaN(parseFloat(thresholds.min)) && !isNaN(parseFloat(thresholds.max))) {
          const message = temperatureService.getTemperatureMessage(newTemp, thresholds);
          if (newTemp !== lastNotificationTemp.current) {
            await notificationService.sendNotification('¡Alerta de Temperatura!', message); // Envía notificación
            lastNotificationTemp.current = newTemp; // Evita repetición
          }
        }
      } catch (error) {
        console.error('Error fetching temperature:', error);
      }
    };

    fetchTemperature();
    const interval = setInterval(fetchTemperature, 5000); // Intervalo de 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [thresholds]);

  return (
    <View style={styles.container}>
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
  );
};

// Estilos para la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
