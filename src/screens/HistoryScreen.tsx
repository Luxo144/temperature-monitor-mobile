import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { db } from '../config/firebase';
import { TemperatureData } from '../types/types';

export const HistoryScreen = () => {
  const navigation = useNavigation();
  const [history, setHistory] = useState<TemperatureData[]>([]);

  useEffect(() => {
    const historyRef = ref(db, 'temperature/history');
    const historyQuery = query(historyRef, orderByChild('timestamp'), limitToLast(100));
    
    const unsubscribe = onValue(historyQuery, (snapshot) => {
      const historyData: TemperatureData[] = [];
      snapshot.forEach((child) => {
        historyData.push(child.val());
      });
      setHistory(historyData.reverse());
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Historial</Text>
        <View style={styles.headerRight} />
      </View>
      
      <FlatList
        data={history}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.temperature}>{item.temperature}°C</Text>
            <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
