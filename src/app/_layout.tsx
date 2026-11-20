import '@/global.css';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider } from '@/features/auth/auth-provider';
import { rotaInicial } from '@/features/auth/rota-inicial';
import { useAuth } from '@/features/auth/use-auth';
import { queryClient } from '@/services/query-client';
import { colors } from '@/theme/colors';
import { stackScreenOptions } from '@/theme/navigation';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootNavigator() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.status !== 'carregando') SplashScreen.hideAsync();
  }, [auth.status]);

  if (auth.status === 'carregando') return null;

  const papel = auth.status === 'autenticado' ? auth.usuario.papel : null;
  const destino = rotaInicial(papel);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }}>
      <Stack.Protected guard={papel === null} redirectTo={destino}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={papel === 'IDOSO'} redirectTo={destino}>
        <Stack.Screen name="(idoso)" />
      </Stack.Protected>
      <Stack.Protected guard={papel === 'GESTOR'} redirectTo={destino}>
        <Stack.Screen name="gestor" />
      </Stack.Protected>
      <Stack.Screen name="sobre" options={{ ...stackScreenOptions, headerShown: true, title: 'Sobre o App' }} />
    </Stack>
  );
}
