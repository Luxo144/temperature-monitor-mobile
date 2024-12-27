// Definición de los datos de temperatura registrados en el historial
export interface TemperatureData {
  temperature: number;
  timestamp: string; 
}

// Definición de los umbrales de temperatura
export interface Thresholds {
  min: string; 
  max: string; 
}

// Propiedades esperadas para el componente ThresholdInputs
export interface ThresholdInputsProps {
  thresholds: Thresholds; // Umbrales actuales
  tempInputs: Thresholds; // Valores temporales de entrada del usuario
  onInputChange: (type: 'min' | 'max', value: string) => void; // Función para manejar cambios en los inputs
  onInputBlur: (type: 'min' | 'max', value: string) => void; // Función para validar los inputs
  inputError: string; // Mensaje de error, si existe
}

// Propiedades esperadas para el componente TemperatureDisplay
export interface TemperatureDisplayProps {
  currentTemp: number;
  isWithinThresholds: boolean; 
}

// Historial de temperaturas para graficar
export interface TemperatureChartProps {
  temperatureHistory: TemperatureData[]; 
}

