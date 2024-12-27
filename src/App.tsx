import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './screens/HomeScreen'; 
import { HistoryScreen } from './screens/HistoryScreen';

// Definición de los parámetros de navegación entre pantallas
export type RootStackParamList = {
  Home: undefined; // La pantalla Home no requiere parámetros
  History: undefined; // La pantalla History no requiere parámetros
};

// Creación del stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente principal de la aplicación
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Configuración de la pantalla Home */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Monitor de Temperatura' }}
        />
        {/* Configuración de la pantalla History */}
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ title: 'Historial' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
