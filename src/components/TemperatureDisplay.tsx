import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TemperatureDisplayProps } from '../types/types';


/**
 * Componente para mostrar la temperatura actual y su estado (dentro o fuera del rango).
 * @param currentTemp - Temperatura actual.
 * @param isWithinThresholds - Indica si la temperatura está dentro de los límites permitidos.
 */

export const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({ 
  currentTemp, 
  isWithinThresholds 
}) => {
   /**
   * Genera el texto del estado basado en si la temperatura está dentro del rango permitido.
   */
  const getStatusText = () => {
    return isWithinThresholds 
      ? "Temperatura dentro del rango permitido"
      : "¡Temperatura fuera del rango permitido!";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tempText}>
        Temperatura Actual: {currentTemp}°C
      </Text>
      <Text style={[
        styles.statusText,
        isWithinThresholds ? styles.statusOk : styles.statusAlert
      ]}>
        {getStatusText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tempText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 5,
  },
  statusOk: {
    backgroundColor: '#e6ffe6',
    color: '#008000',
  },
  statusAlert: {
    backgroundColor: '#ffe6e6',
    color: '#ff0000',
  },
});