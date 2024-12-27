import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { ThresholdInputsProps } from '../types/types';


/**
 * Componente para ingresar valores de temperatura mínima y máxima.
 * @param thresholds - Umbrales actuales de temperatura.
 * @param tempInputs - Valores temporales ingresados.
 * @param onInputChange - Función para manejar cambios en los campos de entrada.
 * @param onInputBlur - Función para manejar validaciones al salir de un campo.
 * @param inputError - Mensaje de error si hay un problema con la entrada.
 */

export const ThresholdInputs: React.FC<ThresholdInputsProps> = ({
  thresholds,
  tempInputs,
  onInputChange,
  onInputBlur,
  inputError,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.thresholdInput}>
        <Text>Temperatura Mínima (°C):</Text>
        <TextInput
          style={[styles.input, inputError ? styles.inputError : null]} // Aplica estilo de error si corresponde.
          onChangeText={(value) => onInputChange('min', value)} // Llama a la función de cambio.
          onBlur={() => onInputBlur('min', tempInputs.min)} // Valida al salir del campo.
          value={tempInputs.min} // Valor actual del input.
          keyboardType="numeric" // Teclado numérico.
          placeholder="Mínimo"
        />
        <Text style={styles.currentValue}>
          Valor actual: {thresholds.min}°C
        </Text>
      </View>

      <View style={styles.thresholdInput}>
        <Text>Temperatura Máxima (°C):</Text>
        <TextInput
          style={[styles.input, inputError ? styles.inputError : null]}
          onChangeText={(value) => onInputChange('max', value)}
          onBlur={() => onInputBlur('max', tempInputs.max)}
          value={tempInputs.max}
          keyboardType="numeric"
          placeholder="Máximo"
        />
        <Text style={styles.currentValue}>
          Valor actual: {thresholds.max}°C
        </Text>
      </View>

      {inputError ? (
        <Text style={styles.errorText}>{inputError}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  thresholdInput: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  currentValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});