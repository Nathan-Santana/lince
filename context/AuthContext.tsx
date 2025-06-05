import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '../services/authService';
// User as FirebaseUser não é mais necessário aqui com as mudanças
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  currentUser: AuthUser | null;
  userType: 'pai' | 'crianca' | null;
  isLoading: boolean; // Será true até o primeiro onAuthStateChanged retornar
  linkedChildDeviceId: string | null;
  login: (email: string, pass: string) => Promise<AuthUser>;
  register: (email: string, pass: string, userType: 'pai' | 'crianca') => Promise<AuthUser>;
  logout: () => Promise<void>;
  setLinkedChildDeviceIdContext: (deviceId: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userType, setUserType] = useState<'pai' | 'crianca' | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa true
  const [linkedChildDeviceId, setLinkedChildDeviceIdState] = useState<string | null>(null);
  const [authProviderInitialized, setAuthProviderInitialized] = useState(false); // Novo estado

  useEffect(() => {
    console.log("AuthContext: useEffect for onAuthStateChangedListener triggered.");
    const unsubscribe = authService.onAuthStateChangedListener(async (user) => {
      console.log("AuthContext: onAuthStateChangedListener callback. User:", user ? user.uid : 'null');
      setCurrentUser(user);
      setUserType(user?.type || null);

      if (user?.type === 'pai') {
        if (user.linkedChildDeviceId) {
            setLinkedChildDeviceIdState(user.linkedChildDeviceId);
            await AsyncStorage.setItem('linkedChildDeviceId', user.linkedChildDeviceId);
            console.log("AuthContext: Parent user, linkedChildDeviceId from Firestore:", user.linkedChildDeviceId);
        } else {
            const storedChildId = await AsyncStorage.getItem('linkedChildDeviceId');
            setLinkedChildDeviceIdState(storedChildId);
            console.log("AuthContext: Parent user, linkedChildDeviceId from AsyncStorage:", storedChildId);
        }
      } else {
        setLinkedChildDeviceIdState(null);
        await AsyncStorage.removeItem('linkedChildDeviceId');
        console.log("AuthContext: Not a parent user or no user, cleared linkedChildDeviceId.");
      }

      if (!authProviderInitialized) {
        setIsLoading(false); // Define isLoading como false APÓS o primeiro retorno
        setAuthProviderInitialized(true);
        console.log("AuthContext: Initial auth state loaded. isLoading set to false.");
      }
    });

    return () => {
      console.log("AuthContext: Unsubscribing from onAuthStateChangedListener.");
      unsubscribe();
    };
  }, [authProviderInitialized]); // Dependência para garantir que isLoading só mude uma vez

  const login = async (email: string, pass: string) => {
    // setIsLoading(true); // O isLoading global é para o estado inicial
    try {
      const user = await authService.login(email, pass);
      // O onAuthStateChangedListener irá atualizar currentUser, userType e isLoading
      console.log("AuthContext: login successful for", user.email);
      return user;
    } catch (error) {
      // setIsLoading(false);
      console.error("AuthContext: login error", error);
      throw error;
    }
  };

  const register = async (email: string, pass: string, type: 'pai' | 'crianca') => {
    // setIsLoading(true);
    try {
      const registeredUser = await authService.register(email, pass, type);
      console.log("AuthContext: registration successful for", registeredUser.email);
      // Importante: Fazer logout para forçar o usuário a logar e garantir que o fluxo de _layout seja o de "não logado"
      await authService.logout();
      console.log("AuthContext: User logged out immediately after registration.");
      // O onAuthStateChangedListener será acionado pelo logout, atualizando o estado para não logado.
      return registeredUser; // Retorna o usuário que foi criado, mesmo que agora deslogado
    } catch (error) {
      // setIsLoading(false);
      console.error("AuthContext: registration error", error);
      throw error;
    }
  };

  const logout = async () => {
    // setIsLoading(true);
    try {
      await authService.logout();
      console.log("AuthContext: logout successful.");
      // O onAuthStateChangedListener irá limpar currentUser, userType e isLoading (se necessário)
    } catch (error) {
      // setIsLoading(false);
      console.error("AuthContext: logout error", error);
      throw error;
    }
  };

  const setLinkedChildDeviceIdContext = async (deviceId: string | null) => {
    console.log("AuthContext: setLinkedChildDeviceIdContext called with", deviceId);
    setLinkedChildDeviceIdState(deviceId);
    if (deviceId) {
        await AsyncStorage.setItem('linkedChildDeviceId', deviceId);
    } else {
        await AsyncStorage.removeItem('linkedChildDeviceId');
    }
    if (currentUser && currentUser.type === 'pai') {
        // Correção: Se deviceId for null, atribuir undefined para corresponder ao tipo AuthUser.
        const newLinkedChildDeviceId = deviceId === null ? undefined : deviceId;
        setCurrentUser(prev => prev ? {...prev, linkedChildDeviceId: newLinkedChildDeviceId } : null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userType,
        isLoading,
        linkedChildDeviceId,
        login,
        register,
        logout,
        setLinkedChildDeviceIdContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};