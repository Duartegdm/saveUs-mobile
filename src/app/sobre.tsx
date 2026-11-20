import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { GitCommitHorizontal, Info } from 'lucide-react-native';
import { View } from 'react-native';
import { Card, Screen, Text } from '@/components/ui';
import { colors } from '@/theme/colors';

const versao = Constants.expoConfig?.version ?? '—';
const commit = String(Constants.expoConfig?.extra?.commitHash ?? 'desconhecido');

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View className="gap-0.5">
      <Text variant="label" tone="muted">
        {rotulo}
      </Text>
      <Text weight="bold" selectable>
        {valor}
      </Text>
    </View>
  );
}

export default function SobreScreen() {
  return (
    <Screen edges={['bottom']}>
      <View className="items-center gap-2 pt-space-sm">
        <Image
          source={require('../../assets/images/logo.png')}
          style={{ width: 96, height: 96 }}
          contentFit="contain"
          accessibilityLabel="Logo do SaveUs"
        />
        <Text variant="title" weight="bold" tone="primary">
          SaveUs
        </Text>
        <Text tone="muted" className="text-center">
          Refúgios climáticos para pessoas idosas passarem as ondas de calor em segurança.
        </Text>
      </View>

      <Card className="gap-4">
        <View className="flex-row items-center gap-2">
          <Info color={colors.secondary} size={20} />
          <Text variant="headline" accessibilityRole="header">
            Versão publicada
          </Text>
        </View>
        <Linha rotulo="Versão" valor={versao} />
        <View className="flex-row items-start gap-2">
          <GitCommitHorizontal color={colors['on-surface-variant']} size={20} />
          <View className="flex-1">
            <Linha rotulo="Commit de referência" valor={commit} />
          </View>
        </View>
      </Card>

      <Text variant="bodySm" tone="muted" className="text-center">
        Global Solution 2026/2 · FIAP · CitizenTech
      </Text>
    </Screen>
  );
}
