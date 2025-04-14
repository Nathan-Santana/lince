import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { db } from '../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useTheme } from '../../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';


export default function ParentDashboard() {
  const params = useLocalSearchParams();
  const deviceId = typeof params.deviceId === 'string' ? params.deviceId : 'deviceIdTeste123';
  const [usageData, setUsageData] = useState<any[]>([]);
  const { theme } = useTheme();

  //useEffect(() => {
    //if (!deviceId) return;

    //const unsubscribe = onSnapshot(doc(db, 'usageData', deviceId), (docSnap) => {
      //const data = docSnap.data();
      //if (data && data.appUsage) {
      //  setUsageData(data.appUsage);
      //}
    //});

    //return () => unsubscribe();
  //}, [deviceId]);
  useEffect(() => {
    const mockData = [
      {
        packageName: 'com.instagram.android',
        totalTimeInForeground: 3600000,
      },
      {
        packageName: 'com.whatsapp',
        totalTimeInForeground: 2700000,
      },
    ];
  
    setUsageData(mockData);
  }, []);
  

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Botão de voltar */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.primary }]}>Informações do Filho</Text>

      
      {usageData.length === 0 ? (
        <Text style={[styles.text, { color: theme.text }]}>Carregando dados...</Text>
      ) : (
        usageData.map((app, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.text}>App: {app.packageName}</Text>
            <Text style={styles.text}>Tempo: {app.totalTimeInForeground} ms</Text>
          </View>
        ))
      )}

      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/reports')}
      >
        <Text style={styles.buttonText}>Ver Relatórios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/settings')}
      >
        <Text style={styles.buttonText}>Configurações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
