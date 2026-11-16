import { Stack } from 'expo-router';

import { colors } from '@/theme/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors['on-surface'],
        headerTitleStyle: { fontFamily: 'PlusJakartaSans_600SemiBold' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.surface },
      }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
      <Stack.Screen name="recuperar-senha" options={{ title: 'Recuperar senha' }} />
    </Stack>
  );
}
