import { router } from 'expo-router';
import { ChevronRight, ThermometerSun } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui';
import { colors } from '@/theme/colors';

export function BannerGuiaCalor() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Guia do Calor"
      accessibilityHint="Abre dicas para se proteger nos dias quentes"
      onPress={() => router.push('/guia-calor')}
      className="min-h-14 flex-row items-center gap-3 rounded-xl bg-tertiary-fixed p-3 active:opacity-90">
      <View className="h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest">
        <ThermometerSun color={colors['on-tertiary-fixed-variant']} size={22} />
      </View>
      <View className="flex-1">
        <Text variant="label" weight="bold" tone="onTertiaryFixed">
          Dias de calor
        </Text>
        <Text variant="bodySm" tone="onTertiaryFixed">
          Veja como se proteger
        </Text>
      </View>
      <ChevronRight color={colors['on-tertiary-fixed']} size={22} />
    </Pressable>
  );
}
