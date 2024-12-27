import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TemperatureChartProps } from '../types/types';

/**
 * Componente para mostrar un gráfico de línea que representa el historial de temperaturas.
 * @param temperatureHistory - Arreglo de objetos con los datos de temperatura.
 */
export const TemperatureChart: React.FC<TemperatureChartProps> = ({
  temperatureHistory
}) => {
  // Configuración de datos para el gráfico.
  const chartData = {
    labels: temperatureHistory.map(() => ''), // Etiquetas vacías (no se muestran).
    datasets: [{
      data: temperatureHistory.map(item => item.temperature) // Extrae las temperaturas.
    }]
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40} 
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1, 
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, 
          style: {
            borderRadius: 16, 
          },
        }}
        bezier 
        style={styles.chart}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center', 
    marginTop: 20, 
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
