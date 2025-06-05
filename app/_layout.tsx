// app/_layout.tsx
import { ThemeProvider, useTheme } from '../context/ThemeContext'; //
import { useFonts } from 'expo-font';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from '../services/firebase'; //
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { View, ActivityIndicator } from 'react-native'; 

SplashScreen.preventAutoHideAsync();

// Este AppLoadingScreen agora será renderizado por AppContent,
// que já está dentro do ThemeProvider.
const ThemedAppLoadingScreen = () => {
  const { theme } = useTheme(); 
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
};

function AppContent() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userTypeLoading, setUserTypeLoading] = useState(false);

  const router = useRouter();
  const segments = useSegments();
  const { isDark } = useTheme(); 

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let isMounted = true; // Flag para verificar se o componente está montado

    if (authLoading || !fontsLoaded || userTypeLoading) {
      return;
  }

    // Garante que segments é um array antes de acessar length e índices
    const segArr = Array.isArray(segments) ? segments : [];
    const isUserAtRootHomepage = segArr.length === 0;
    const isUserInLoginPage = segArr.length > 0 && segArr[0] === 'login';
    const isUserInRegisterPage = segArr.length > 0 && segArr[0] === 'register';

  if (currentUser) {
    if (isUserAtRootHomepage || isUserInLoginPage || isUserInRegisterPage) {
      if (isMounted) setUserTypeLoading(true);
      getDoc(doc(db, 'users', currentUser.uid))
        .then((docSnap) => {
          if (!isMounted) return;
          if (docSnap.exists()) {
            const userType = docSnap.data()?.userType;
            if (userType === 'pai') {
              router.replace('/(tabs)/ParentDashboard');
            } else if (userType === 'crianca') {
              router.replace('/(tabs)/TokenDashboard');
            } else {
              console.warn('Tipo de usuário desconhecido, deslogando.');
              auth.signOut(); // APENAS signOut, o useEffect tratará do redirect
            }
          } else {
            console.warn('Usuário logado sem registro no Firestore, deslogando.');
            auth.signOut(); // APENAS signOut
          }
        })
        .catch((error) => {
          if (!isMounted) return;
          console.error("Erro ao buscar tipo de usuário:", error);
          auth.signOut(); // APENAS signOut
        })
        .finally(() => {
          if (isMounted) setUserTypeLoading(false);
        });
      }
    } else {
      // Usuário NÃO LOGADO
      if (!isUserAtRootHomepage && !isUserInLoginPage && !isUserInRegisterPage) {
        if (isMounted) router.replace('/'); // Redireciona para app/index.tsx (sua homepage)
      }
    }
  }, [currentUser, authLoading, fontsLoaded, userTypeLoading, segments, router]);


  if (authLoading || !fontsLoaded || userTypeLoading) {
    return <ThemedAppLoadingScreen />;
  }

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  // O RootLayout mais externo apenas configura o ThemeProvider.
  // Toda a lógica de estado, hooks e renderização condicional acontece em AppContent.
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}