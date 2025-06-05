import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/hooks/useAuth'; // Importar o hook useAuth para acessar o contexto de autenticação
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors'; // Importado para usar Colors.light.error

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'pai' | 'crianca'>('pai');
  const [loading, setLoading] = useState(false); // Loading local para a ação de registro
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(email, password, userType);
      Alert.alert("Cadastro realizado!", "Você agora pode fazer o login.");
      // Navegar para a tela inicial. Como o usuário foi deslogado após o registro,
      // a StartScreen (app/index.tsx) deve mostrar opções de login/registro.
      router.replace('/' as any); // Cast to any para satisfazer o TypeScript
    } catch (err: any) {
      console.error("RegisterScreen: handleRegister error", err);
      // Tratar erros específicos do Firebase se necessário
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso. Tente outro.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha é muito fraca. Use pelo menos 6 caracteres.');
      } else {
        setError(err.message || 'Erro ao registrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Cadastro Lince</ThemedText>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder="Email"
        placeholderTextColor={theme.textMuted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder="Senha (mínimo 6 caracteres)"
        placeholderTextColor={theme.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder="Confirmar Senha"
        placeholderTextColor={theme.textMuted}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <ThemedText style={styles.label}>Eu sou:</ThemedText>
      <View style={[styles.pickerContainer, { borderColor: theme.border, backgroundColor: theme.backgroundComposed }]}>
        <Picker
          selectedValue={userType}
          onValueChange={(itemValue) => setUserType(itemValue as 'pai' | 'crianca')}
          style={[styles.picker, { color: theme.text }]}
          dropdownIconColor={theme.text}
        >
          <Picker.Item label="Responsável (Pai/Mãe)" value="pai" />
          <Picker.Item label="Criança/Adolescente" value="crianca" />
        </Picker>
      </View>

      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
         <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleRegister}>
            <Text style={[styles.buttonText, {color: theme.buttonText}]}>Cadastrar</Text>
        </TouchableOpacity>
      )}
      <Link href="/login" style={styles.link}>
        <ThemedText type="link">Já tem uma conta? Faça login</ThemedText>
      </Link>
      <Link href="/" style={styles.link}>
        <ThemedText type="link">Voltar para Início</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerContainer: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 15,
  },
  picker: {
    height: '100%',
    width: '100%',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.light.error, // Usar uma cor de erro consistente
    marginBottom: 10,
    textAlign: 'center',
  },
});