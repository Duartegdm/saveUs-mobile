import { LogOut } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import { useAuth } from '../use-auth';

export function BotaoSair() {
  const { sair } = useAuth();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Sair da conta"
      onPress={() => void sair()}
      className="min-h-12 flex-row items-center gap-1.5 px-2">
      <LogOut color={colors.secondary} size={18} />
      <Text variant="label" weight="bold" tone="secondary">
        Sair
      </Text>
    </Pressable>
  );
}
