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
import { useAuth } from '@/features/auth/use-auth';
import { queryClient } from '@/services/query-client';
import { colors } from '@/theme/colors';

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
  const { status } = useAuth();

  useEffect(() => {
    if (status !== 'carregando') SplashScreen.hideAsync();
  }, [status]);

  if (status === 'carregando') return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors['on-surface'],
        headerTitleStyle: { fontFamily: 'PlusJakartaSans_600SemiBold' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.surface },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="refugio/[id]" options={{ title: 'Detalhes do refúgio' }} />
      <Stack.Screen name="reserva/[id]" options={{ title: 'Comprovante' }} />
      <Stack.Screen name="guia-calor" options={{ title: 'Guia do Calor' }} />
    </Stack>
  );
}
