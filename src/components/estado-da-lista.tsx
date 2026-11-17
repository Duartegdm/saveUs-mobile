import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';
import { Button, Text } from '@/components/ui';
import { colors } from '@/theme/colors';

type EstadoDaListaProps =
  | { tipo: 'carregando'; mensagem: string }
  | { tipo: 'erro'; mensagem: string; onTentarDeNovo: () => void }
  | { tipo: 'vazio'; titulo: string; mensagem: string; icone: LucideIcon; acao?: { rotulo: string; onPress: () => void } };

export function EstadoDaLista(props: EstadoDaListaProps) {
  if (props.tipo === 'carregando') {
    return (
      <View className="items-center gap-3 py-space-2xl" accessibilityLiveRegion="polite">
        <ActivityIndicator color={colors.secondary} size="large" />
        <Text tone="muted">{props.mensagem}</Text>
      </View>
    );
  }

  if (props.tipo === 'erro') {
    return (
      <View className="items-center gap-space-md py-space-2xl" accessibilityRole="alert">
        <Text variant="headline" className="text-center">
          Não foi possível carregar
        </Text>
        <Text tone="muted" className="text-center">
          {props.mensagem}
        </Text>
        <Button label="Tentar de novo" variant="tonal" onPress={props.onTentarDeNovo} />
      </View>
    );
  }

  const { icone: Icone } = props;

  return (
    <View className="items-center gap-3 px-space-lg py-space-2xl">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-surface-container">
        <Icone color={colors.primary} size={28} />
      </View>
      <Text variant="headline" className="text-center">
        {props.titulo}
      </Text>
      <Text tone="muted" className="text-center">
        {props.mensagem}
      </Text>
      {props.acao && <Button label={props.acao.rotulo} variant="tonal" onPress={props.acao.onPress} className="mt-2" />}
    </View>
  );
}
