import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { TouchableOpacity } from 'react-native';
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
  if (!name || !email || !password) {
    Alert.alert('Erro', 'Preencha todos os campos!');
    return;
  }

  try {
    setLoading(true);

    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    
    await updateProfile(user, { displayName: name });

    
    await setDoc(doc(db, 'users', user.uid), {
      displayName: name,
      email: email,
      userType: userType,
    });

    router.replace('/(tabs)');
  } catch (error) {
    let errorMessage = 'Falha no cadastro';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    Alert.alert('Erro', errorMessage);
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
      </TouchableOpacity>

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
      <View style={styles.inputContainer}>

  <Text style={{ color: theme.text, marginBottom: 10 }}>Tipo de usuário</Text>
  <Picker
    selectedValue={userType}
    style={{ flex: 1, backgroundColor: theme.inputBackground, color: theme.text }}
    onValueChange={(itemValue) => setUserType(itemValue)}
  >
    <Picker.Item label="Pai" value="pai" />
    <Picker.Item label="Criança" value="crianca" />
  </Picker>
  </View>

      <Button 
        title={loading ? "Cadastrando..." : "Cadastrar"} 
        onPress={handleRegister} 
        color={theme.primary}
        disabled={loading}
      />

      <Text 
        style={[styles.link, { color: theme.primary }]}
        onPress={() => router.push('/login')}
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

function getOrCreateDeviceId() {
  throw new Error('Function not implemented.');
}