import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { theme } = useTheme();

  const handleLogin = () => {
    if (!email || !password) {
      alert('Preencha todos os campos!');
      return;
    }
    // Implementar a navegação para '/dashboard'
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Login</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color={theme.placeholder} />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          placeholder="Email"
          placeholderTextColor={theme.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color={theme.placeholder} />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          placeholder="Senha"
          placeholderTextColor={theme.placeholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Button title="Entrar" onPress={handleLogin} color={theme.primary} />

      <Text 
        style={[styles.link, { color: theme.primary }]}
        //implementar a rota pra tela de cadastro}
      >
        Não tem uma conta? Cadastre-se
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
      marginBottom: 40,
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 15,
    },
    input: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    link: {
      marginTop: 20,
      textAlign: 'center',
    },
});