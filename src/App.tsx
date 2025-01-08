import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { HomeScreen } from './screens/HomeScreen'; 
import { HistoryScreen } from './screens/HistoryScreen';
import { AuthScreen } from './screens/AuthScreen';

// Definición de los parámetros de navegación entre pantallas
export type RootStackParamList = {
  Auth: undefined;
  Home: undefined; // La pantalla Home no requiere parámetros
  History: undefined; // La pantalla History no requiere parámetros
};

// Creación del stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente principal de la aplicación
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}