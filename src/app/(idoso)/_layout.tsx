import { Stack } from 'expo-router';
import { stackScreenOptions } from '@/theme/navigation';

export default function IdosoLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="refugio/[id]" options={{ title: 'Detalhes do refúgio' }} />
      <Stack.Screen name="reserva/[id]" options={{ title: 'Comprovante' }} />
      <Stack.Screen name="guia-calor" options={{ title: 'Guia do Calor' }} />
    </Stack>
  );
}
