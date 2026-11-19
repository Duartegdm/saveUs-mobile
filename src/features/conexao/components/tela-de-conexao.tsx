import { Image } from 'expo-image';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from '@/components/ui';
import { colors } from '@/theme/colors';

const logo = require('../../../../assets/images/logo.png');

type TelaDeConexaoProps =
  | { estado: 'conectando' }
  | { estado: 'falhou'; onTentarDeNovo: () => void; onContinuar: () => void };

export function TelaDeConexao(props: TelaDeConexaoProps) {
  const conectando = props.estado === 'conectando';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors['surface-container-lowest'] }}>
      <View className="flex-1 items-center justify-center gap-space-md px-space-xl">
        <Image source={logo} style={{ width: 96, height: 96 }} contentFit="contain" accessibilityLabel="SaveUs" />

        <View className="items-center gap-2" accessibilityLiveRegion="polite">
          <Text variant="title" weight="bold" tone="primary" className="text-center">
            {conectando ? 'Conectando ao SaveUs' : 'Não foi possível conectar'}
          </Text>
          <Text tone="muted" className="text-center">
            {conectando
              ? 'Nossos servidores estavam em repouso. Isso pode levar até 1 minuto.'
              : 'Verifique sua internet e tente de novo.'}
          </Text>
        </View>

        {conectando ? (
          <ActivityIndicator color={colors.secondary} size="large" accessibilityLabel="Conectando" />
        ) : (
          <View className="w-full max-w-[360px] gap-3 pt-space-sm">
            <Button label="Tentar de novo" size="lg" onPress={props.onTentarDeNovo} />
            <Button label="Continuar mesmo assim" variant="tonal" onPress={props.onContinuar} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
