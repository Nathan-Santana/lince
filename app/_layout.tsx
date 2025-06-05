import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react'; // Adicionado useState
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider} from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { ThemeContextProvider } from '@/context/ThemeContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { currentUser, isLoading: isAuthLoading, userType } = useAuth(); // Renomeado isLoading para evitar conflito
  const [isRouterReady, setIsRouterReady] = useState(false); // Novo estado para prontidão do router

  useEffect(() => {
    // Dá um pequeno tempo para o roteador se inicializar completamente
    const timer = setTimeout(() => {
      console.log("RootLayoutNav: Router considered ready.");
      setIsRouterReady(true);
    }, 100); // 100ms de delay, ajuste se necessário
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log(
      `RootLayoutNav effect: isAuthLoading=${isAuthLoading}, isRouterReady=${isRouterReady}, currentUser=${!!currentUser}, userType=${userType}, segments=${segments.join('/')}`
    );

    if (isAuthLoading || !isRouterReady) {
      console.log("RootLayoutNav: Auth not loaded OR Router not ready. Aborting redirection.");
      return;
    }

    const currentTopLevelSegment = segments[0];
    const currentSecondLevelSegment = segments.length > 1 ? segments[1] : null;

    if (currentUser && userType) { // Garante que userType também esteja definido
      console.log(`RootLayoutNav: User logged in. Type: ${userType}. Path: ${segments.join('/')}`);
      let targetPath: string | null = null;
      let shouldRedirect = true;

      if (userType === 'pai') {
        targetPath = '/(tabs)/ParentDashboard';
        if (currentTopLevelSegment === '(tabs)' && (currentSecondLevelSegment === 'ParentDashboard' || currentSecondLevelSegment === 'reports')) {
          shouldRedirect = false;
        }
      } else if (userType === 'crianca') {
        targetPath = '/(tabs)/TokenDashboard';
        if (currentTopLevelSegment === '(tabs)' && currentSecondLevelSegment === 'TokenDashboard') {
          shouldRedirect = false;
        }
      }
      // Se estiver na modal de configurações, não redirecionar
      if (currentTopLevelSegment === '(modal)' && currentSecondLevelSegment === 'settings') {
          shouldRedirect = false;
      }


      if (targetPath && shouldRedirect) {
        const targetSegments = targetPath.substring(1).split('/');
        const isAlreadyOnTargetPath = segments.length === targetSegments.length && segments.every((seg, i) => seg === targetSegments[i]);
        if (!isAlreadyOnTargetPath) {
          console.log(`RootLayoutNav: Redirecting logged-in user to ${targetPath}.`);
          router.replace(targetPath as any);
        } else {
          console.log(`RootLayoutNav: User already on target path ${targetPath}.`);
        }
      } else if (targetPath && !shouldRedirect) {
         console.log(`RootLayoutNav: User on allowed path, no redirect for ${userType}. Path: ${segments.join('/')}`);
      }

    } else { // No currentUser (usuário não logado)
      console.log(`RootLayoutNav: User not logged in. Path: ${segments.join('/')}`);
      const isAuthScreenOrInitial =
        currentTopLevelSegment === 'login' ||
        currentTopLevelSegment === 'register' ||
        (currentTopLevelSegment as string) === 'index' ||
        currentTopLevelSegment === undefined ||
        (currentTopLevelSegment as string) === '';

      if (!isAuthScreenOrInitial) {
        console.log("RootLayoutNav: User not logged in and not on auth/initial screen. Redirecting to /.");
        router.replace('/' as any);
      } else {
         console.log("RootLayoutNav: User not logged in but on auth/initial screen. No redirect.");
      }
    }
  }, [currentUser, userType, isAuthLoading, segments, router, isRouterReady]);


  if (isAuthLoading && !isRouterReady) { // Mostrar splash/loading apenas se ambos não estiverem prontos
    return null; // Ou seu componente de SplashScreen
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(modal)/settings" options={{ presentation: 'modal', title: "Configurações" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeContextProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <RootLayoutNav />
            </ThemeProvider>
          </ThemeContextProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}