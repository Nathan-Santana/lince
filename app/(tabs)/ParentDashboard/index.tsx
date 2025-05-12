import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db, auth } from '../../../services/firebase';
import UsageProgress from '../../../components/usageProgress';
import { FirebaseError } from 'firebase/app';

export default function DashboardScreen() {
  const [usageData, setUsageData] = useState<AppUsage[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface AppUsage {
    name: string;
    duration: number;
    limit?: number;
  }

  // Busca deviceId vinculado e dados de uso
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
  
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Usuário não autenticado');
  
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const linkedDeviceId = userDoc.data()?.linkedDeviceId;
        if (!linkedDeviceId) throw new Error('Nenhum dispositivo vinculado');
        setDeviceId(linkedDeviceId);
  
        const deviceRef = doc(db, 'devices', linkedDeviceId);
  
        unsubscribe = onSnapshot(
          deviceRef,
          (doc) => {
            const rawData = doc.data();
            const processedData: AppUsage[] = Object.entries(rawData?.timeLimits || {}).map(
              ([appName, limit]) => ({
                name: appName,
                duration: rawData?.activities?.find((a: any) => a.name === appName)?.duration || 0,
                limit: limit as number
              })
            );
            setUsageData(processedData);
            setError(null);
          },
          (error) => {
            throw error;
          }
        );
  
      } catch (error) {
        let errorMessage = "Falha ao carregar dados";
        if (error instanceof FirebaseError) {
          errorMessage = `Firebase: ${error.code}`;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
        setUsageData([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  
    return () => {
      if (unsubscribe) unsubscribe(); 
    };
  }, []);  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          title="Tentar novamente" 
          onPress={() => setLoading(true)} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uso Diário</Text>
      
      <FlatList
        data={usageData}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <UsageProgress 
            app={item.name}
            used={item.duration}
            limit={item.limit || 0}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum dado de uso disponível</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  }
});