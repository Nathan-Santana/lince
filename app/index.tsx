// app/index.tsx
import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function HomePage() { 
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MaterialIcons name="family-restroom" size={80} color={theme.primary} />
      <Text style={[styles.title, { color: theme.text }]}>Bem-vindo ao Lince</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>
        Controle parental inteligente para famílias.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Fazer Login"
          onPress={() => router.push('/login')} // Navega para a tela de login
          color={theme.primary}
        />
        <Button
          title="Cadastrar"
          onPress={() => router.push('/register')} // Navega para a tela de registro
          color={theme.primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    gap: 15,
  },
});