// app/register.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native'; // 
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'pai' | 'crianca'>('pai');
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) { 
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Formato de e-mail inválido.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: name,
        email: email,
        userType: userType,
        createdAt: new Date().toISOString(),
      });

      // Redirecionamento baseado no userType
      if (userType === 'pai') {
        router.replace('/(tabs)/ParentDashboard');
      } else if (userType === 'crianca') {
        router.replace('/(tabs)/TokenDashboard');
      } else {
        router.replace('/(tabs)'); // Ou para login com uma mensagem
      }

    } catch (error: any) { 
      let errorMessage = 'Falha no cadastro. Tente novamente.';
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Este e-mail já está cadastrado.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'O formato do e-mail é inválido.';
            break;
          case 'auth/weak-password':
            errorMessage = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
            break;
          default:
            console.error("Erro no registro:", error);
            break;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("DETALHE DO ERRO NO REGISTRO (setDoc pode ter falhado):", JSON.stringify(error, Object.getOwnPropertyNames(error))); // Log mais completo
      Alert.alert('Erro no Cadastro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/login')} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.text }]}>Cadastro</Text>

      <View style={[styles.inputContainer, { borderColor: theme.border }]}>
        <MaterialIcons name="person" size={20} color={theme.placeholder} style={styles.icon} />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          placeholder="Nome Completo"
          placeholderTextColor={theme.placeholder}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

      <View style={[styles.inputContainer, { borderColor: theme.border }]}>
        <MaterialIcons name="email" size={20} color={theme.placeholder} style={styles.icon} />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          placeholder="Email"
          placeholderTextColor={theme.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={[styles.inputContainer, { borderColor: theme.border }]}>
        <MaterialIcons name="lock" size={20} color={theme.placeholder} style={styles.icon} />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          placeholder="Senha (mínimo 6 caracteres)"
          placeholderTextColor={theme.placeholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Tipo de usuário:</Text>
      <View style={[styles.pickerContainer, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
        <Picker
          selectedValue={userType}
          style={[styles.picker, { color: theme.text }]} // Cor do texto do Picker
          dropdownIconColor={theme.text} // Cor do ícone do dropdown
          onValueChange={(itemValue) => setUserType(itemValue as 'pai' | 'crianca')}
        >
          <Picker.Item label="Responsável (Pai/Mãe)" value="pai" />
          <Picker.Item label="Criança/Adolescente" value="crianca" />
        </Picker>
      </View>

      <Button
        title={loading ? "Cadastrando..." : "Cadastrar"}
        onPress={handleRegister}
        color={theme.primary}
        disabled={loading}
      />
      {loading && <ActivityIndicator size="small" color={theme.primary} style={{ marginTop: 10 }} />}

      <TouchableOpacity onPress={() => router.replace('/login')} style={styles.linkContainer}>
        <Text style={[styles.link, { color: theme.primary }]}>
          Já tem uma conta? Faça login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40, // Ajuste para SafeAreaView se necessário
    left: 20,
    zIndex: 1,
    padding: 5, // Aumentar área de toque
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
  },
  icon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    flex: 1, // Para ocupar o espaço do container
    height: '100%',
  },
  linkContainer: {
    marginTop: 20,
    paddingVertical: 10,
  },
  link: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});