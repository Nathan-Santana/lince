import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth'; // Importar o hook useAuth para acessar o contexto de autenticação
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/context/ThemeContext';
import { Image } from 'expo-image'; // Usar expo-image para melhor performance e placeholders


export default function StartScreen() {
  const { currentUser, isLoading, userType } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    if (!isLoading && currentUser) {
      // Usuário já está logado, RootLayoutNav cuidará do redirecionamento
      // Apenas para garantir, podemos forçar aqui também
      if (userType === 'pai') {
        router.replace('/(tabs)/ParentDashboard');
      } else if (userType === 'crianca') {
        router.replace('/(tabs)/TokenDashboard');
      }
    }
  }, [currentUser, isLoading, userType, router]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText>Carregando...</ThemedText>
      </ThemedView>
    );
  }

  // Se não estiver carregando e não houver usuário, mostrar opções de login/registro
  if (!currentUser) {
    return (
      <ThemedView style={styles.container}>
         <Image
            source={require('../assets/images/lince-logo.png')} // Certifique-se que este caminho está correto
            style={styles.logo}
            placeholder={require('../assets/images/icon.png')} // Placeholder opcional
            contentFit="contain"
            transition={1000}
        />
        <ThemedText type="title" style={styles.title}>Bem-vindo ao Lince!</ThemedText>
        <ThemedText style={styles.subtitle}>Monitoramento inteligente para a segurança da sua família.</ThemedText>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => router.push('/login')}>
            <Text style={[styles.buttonText, {color: theme.buttonText}]}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.secondary, marginTop: 10 }]} onPress={() => router.push('/register')}>
            <Text style={[styles.buttonText, {color: theme.buttonText}]}>Cadastrar</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // Caso o usuário esteja logado mas ainda não redirecionado (raro)
  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" color={theme.primary} />
      <ThemedText>Redirecionando...</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10, // Ajustado
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});