import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TemperatureData } from '../types/types';
import { historyService } from '../services/historyService';

// Pantalla para mostrar el historial de temperaturas registradas
export const HistoryScreen = () => {
  const navigation = useNavigation(); // Hook para navegar entre pantallas
  const [history, setHistory] = useState<TemperatureData[]>([]); // Estado para almacenar el historial
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string>(''); // Estado para errores

  // Carga el historial al montar el componente
  useEffect(() => {
    loadHistory();
  }, []);

  // Función para cargar el historial desde el servicio
  const loadHistory = async () => {
    try {
      setLoading(true); // Activa el indicador de carga
      const data = await historyService.getTemperatureHistory(); // Llama al servicio para obtener datos
      setHistory(data); // Actualiza el historial con los datos recibidos
      setError(''); // Limpia cualquier error previo
    } catch (error) {
      setError('Error al cargar el historial'); // Muestra un mensaje de error si falla
      console.error(error);
    } finally {
      setLoading(false); // Desactiva el indicador de carga
    }
  };

  // Formatea una fecha para mostrarla en un formato legible
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES'); // Devuelve la fecha en formato local
  };

  // Si está cargando, muestra un indicador de carga
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()} // Navega de regreso
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Historial</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  // Si hay un error, muestra el mensaje correspondiente
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()} // Navega de regreso
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Historial</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Pantalla principal: muestra el historial en una lista
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()} // Navega de regreso
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Historial</Text>
        <View style={styles.headerRight} />
      </View>
      
      <FlatList
        data={history} // Datos del historial
        contentContainerStyle={styles.listContent}
        keyExtractor={(item, index) => index.toString()} // Clave única para cada elemento
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.temperature}>{item.temperature}°C</Text>
            <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />} // Separador entre elementos
      />
    </SafeAreaView>
  );
};

// Estilos para la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerRight: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
  },
  historyItem: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  temperature: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  separator: {
    height: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
