import { Stack } from 'expo-router';
import { BotaoSair } from '@/features/auth/components/botao-sair';
import { stackScreenOptions } from '@/theme/navigation';

export default function GestorLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Refúgios', headerRight: () => <BotaoSair /> }} />
      <Stack.Screen name="refugio/novo" options={{ title: 'Novo refúgio' }} />
      <Stack.Screen name="refugio/[id]" options={{ title: 'Editar refúgio' }} />
    </Stack>
  );
}
