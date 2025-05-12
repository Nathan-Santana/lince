import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { auth, db } from '../../../services/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as Crypto from 'expo-crypto';

export default function TokenDashboard() {
  const { theme } = useTheme();
  const [token, setToken] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // SUA FUNÇÃO ORIGINAL (com pequenos ajustes)
  const generateToken = async (deviceId: string) => {
    try {
      const randomBytes = await Crypto.getRandomBytesAsync(32);
      const token = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${deviceId}-${Date.now()}-${randomBytes}`
      );
      return token;
    } catch (error) {
      console.error("Erro ao gerar token:", error);
      throw error;
    }
  };

  const handleGenerateToken = async () => {
    try {
      setIsLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");

      // 1. Gerar token
      const newToken = await generateToken(user.uid);
      setToken(newToken);
      setTimeLeft(300); // 5 minutos

      // 2. Salvar no Firestore
      await setDoc(doc(db, 'tokens', newToken), {
        token: newToken,
        userId: user.uid,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 300000), // 5 minutos
        used: false
      });

      Alert.alert("Sucesso", "Token gerado com sucesso!");

    } catch (error) {
      console.error("Erro completo:", error);
      Alert.alert("Erro", "Falha ao gerar token. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Contador regressivo
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Token de Acesso</Text>

      {/* Área do Token */}
      <View style={[styles.tokenContainer, { backgroundColor: theme.inputBackground }]}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : (
          <Text style={[styles.tokenText, { color: theme.primary }]}>
            {token || "------"}
          </Text>
        )}
        {timeLeft > 0 && (
          <Text style={[styles.timerText, { color: theme.text }]}>
            Expira em: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </Text>
        )}
      </View>

      {/* Botão de ação */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.primary,
            opacity: isLoading ? 0.6 : 1
          }
        ]}
        onPress={handleGenerateToken}
        disabled={isLoading}
      >
        {isLoading ? (
          <Text style={styles.buttonText}>Gerando...</Text>
        ) : (
          <Text style={styles.buttonText}>
            {token ? "Gerar Novo Token" : "Gerar Token"}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={[styles.instructions, { color: theme.text }]}>
        <MaterialIcons name="info-outline" size={16} color={theme.primary} /> 
        Compartilhe este token com seu responsável para vincular dispositivos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  tokenContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 30,
  },
  tokenText: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 5,
  },
  timerText: {
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  instructions: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
  },
});