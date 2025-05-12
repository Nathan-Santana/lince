import { View, Text, Button, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../services/firebase';

export default function LimitsScreen() {
  const [selectedApp, setSelectedApp] = useState('com.instagram.android');
  const [minutes, setMinutes] = useState(60);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apps = [
    { id: 'com.instagram.android', name: 'Instagram' },
    { id: 'com.tiktok', name: 'TikTok' },
    { id: 'com.google.android.youtube', name: 'YouTube' }
  ];

  // ⏳ busca o deviceId
  useEffect(() => {
    const fetchDeviceId = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setDeviceId(userDoc.data()?.linkedDeviceId || null);
      } catch (error) {
        console.error("Erro ao buscar deviceId:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeviceId();
  }, []);

  // 🔄 salva o limite
  const saveLimit = async () => {
    if (!deviceId) {
      alert('Nenhum dispositivo vinculado!');
      return;
    }

    try {
      await updateDoc(doc(db, 'devices', deviceId), {
        [`timeLimits.${selectedApp}`]: minutes * 60 
      });
      alert('Limite salvo com sucesso!');
    } catch (error) {
      let errorMessage = "Erro desconhecido";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "message" in error
      ) {
        errorMessage = `${(error as any).code}: ${(error as any).message}`;
      }
      alert(errorMessage);
    }
  };  // ← salvaLimit fechado aqui

  // 🔄 renderização condicional no próprio componente
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!deviceId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Nenhum dispositivo vinculado. Escaneie um token primeiro!</Text>
      </View>
    );
  }

  // ✅ render principal
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Definir Limites Diários</Text>

      <Text>Selecione o App:</Text>
      <Picker
        selectedValue={selectedApp}
        onValueChange={setSelectedApp}
        style={{ backgroundColor: '#f0f0f0', marginBottom: 20 }}
      >
        {apps.map(app => (
          <Picker.Item key={app.id} label={app.name} value={app.id} />
        ))}
      </Picker>

      <Text>Minutos Permitidos:</Text>
      <Picker
        selectedValue={minutes}
        onValueChange={setMinutes}
        style={{ backgroundColor: '#f0f0f0', marginBottom: 20 }}
      >
        {[30, 60, 90, 120].map(m => (
          <Picker.Item key={m} label={`${m} minutos`} value={m} />
        ))}
      </Picker>

      <Button title="Salvar Limite" onPress={saveLimit} />
    </View>
  );
}
