import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase'; // Seu arquivo de configuração do Firebase
import * as Device from 'expo-device';

export interface AuthUser {
  uid: string;
  email: string | null;
  type: 'pai' | 'crianca' | null; // 'pai' ou 'crianca'
  deviceId?: string; // Adicionado para o tipo 'crianca'
  linkedChildDeviceId?: string; // Adicionado para o tipo 'pai'
}


export const authService = {
  onAuthStateChangedListener: (callback: (user: AuthUser | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Usuário está logado, buscar tipo de usuário no Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            type: userData.type,
            deviceId: userData.deviceId, // Se for criança
            linkedChildDeviceId: userData.linkedChildDeviceId, // Se for pai e tiver filho vinculado
          });
        } else {
          callback(null);
        }
      } else {
        // Usuário deslogado
        callback(null);
      }
    });
  },

  login: async (email: string, pass: string): Promise<AuthUser> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          type: userData.type,
          deviceId: userData.deviceId,
          linkedChildDeviceId: userData.linkedChildDeviceId,
        };
      } else {
        throw new Error('Documento do usuário não encontrado.');
      }
    } catch (error: any) {
      console.error('Erro no login:', error.message);
      throw error;
    }
  },

  register: async (
    email: string,
    pass: string,
    userType: 'pai' | 'crianca'
  ): Promise<AuthUser> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;
      let deviceId = null;

      if (userType === 'crianca') {
        deviceId = Device.osInternalBuildId || Device.osBuildId || Device.modelName || 'unknown_device'; // Usando expo-device
      }

      const userDocData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        type: userType,
        deviceId: userType === 'crianca' ? deviceId : null,
        createdAt: new Date().toISOString(),
        linkedChildDeviceId: null, // Inicialmente nulo para pais
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        type: userType,
        deviceId: userDocData.deviceId ?? undefined,
      };
    } catch (error: any) {
      console.error('Erro no registro:', error.message);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Erro no logout:', error.message);
      throw error;
    }
  },

  getCurrentUser: (): AuthUser | null => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      // Esta função pode precisar buscar dados do Firestore para obter o 'type'
      // Por simplicidade, retornaremos o que temos, mas o onAuthStateChangedListener é mais completo
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        type: null, // O tipo precisaria ser buscado no Firestore aqui também
      };
    }
    return null;
  },

  // Função para atualizar o linkedChildDeviceId do pai
  linkChildToParent: async (parentId: string, childDeviceId: string): Promise<void> => {
    try {
      const parentDocRef = doc(db, 'users', parentId);
      await updateDoc(parentDocRef, {
        linkedChildDeviceId: childDeviceId,
      });
    } catch (error: any) {
      console.error('Erro ao vincular filho ao pai:', error.message);
      throw error;
    }
  },

  // Função para buscar dados do filho vinculado pelo deviceId
  getChildDataByDeviceId: async (childDeviceId: string): Promise<AuthUser | null> => {
    // Esta função pode não ser necessária se o deviceId já estiver no AuthUser do pai
    // Mas pode ser útil para verificar se o filho existe
    // Implementação dependerá da estrutura de dados dos filhos
    console.log('Buscando dados do filho por deviceId (não implementado completamente):', childDeviceId);
    return null; // Placeholder
  }
};