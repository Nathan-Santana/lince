import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { theme } = useTheme();

  const handleRegister = () => {
    if (!name || !email || !password) {
      alert('Preencha todos os campos!');
      return;
    }
    // Implementar a navegação para '/dashboard'
    // router.push('/dashboard');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Cadastro</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={24} color={theme.placeholder} />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          placeholder="Nome"
          placeholderTextColor={theme.placeholder}
          value={name}
          onChangeText={setName}
        />
      </View>

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

      <Button title="Cadastrar" onPress={handleRegister} color={theme.primary} />

      <Text 
        style={[styles.link, { color: theme.primary }]}
        //implementar a volta pro login
      >
        Já tem uma conta? Faça login
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