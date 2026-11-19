import { router } from 'expo-router';
import { MapPin, Phone, TriangleAlert } from 'lucide-react-native';
import { Alert as AlertNativo, Linking, View } from 'react-native';
import { Button, Card, Screen, Text } from '@/components/ui';
import { SeuGuiaDeHoje } from '@/features/guia-calor/components/seu-guia-de-hoje';
import { CUIDADOS, type Cuidado, O_QUE_FAZER, SINAIS_DE_ALERTA, TELEFONE_SAMU } from '@/features/guia-calor/conteudo';
import { colors } from '@/theme/colors';

function ligarParaOSamu() {
  Linking.openURL(`tel:${TELEFONE_SAMU}`).catch(() =>
    AlertNativo.alert('Não foi possível ligar', `Disque ${TELEFONE_SAMU} no seu telefone.`),
  );
}

function CartaoDeCuidado({ titulo, descricao, Icone }: Cuidado) {
  return (
    <Card accessible accessibilityLabel={`${titulo}. ${descricao}`} className="flex-row gap-3">
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-secondary-container">
        <Icone color={colors['on-secondary-container']} size={22} />
      </View>
      <View className="flex-1 gap-1">
        <Text variant="label" weight="bold">
          {titulo}
        </Text>
        <Text variant="bodySm" tone="muted">
          {descricao}
        </Text>
      </View>
    </Card>
  );
}

function SinaisDeAlerta() {
  return (
    <Card className="gap-4 border border-error/30">
      <View className="flex-row items-center gap-2">
        <TriangleAlert color={colors.error} size={22} />
        <Text variant="headline" accessibilityRole="header">
          Sinais de alerta
        </Text>
      </View>
      <View className="gap-2">
        {SINAIS_DE_ALERTA.map((sinal) => (
          <View key={sinal} className="flex-row items-start gap-2">
            <Text tone="error">•</Text>
            <Text className="flex-1">{sinal}</Text>
          </View>
        ))}
      </View>

      <Text variant="label" weight="bold" className="pt-1">
        O que fazer
      </Text>
      <View className="gap-2">
        {O_QUE_FAZER.map((passo, indice) => (
          <View key={passo} className="flex-row items-start gap-2">
            <Text variant="label" weight="bold" tone="secondary">
              {indice + 1}.
            </Text>
            <Text className="flex-1">{passo}</Text>
          </View>
        ))}
      </View>

      <Text variant="bodySm" tone="muted">
        Se os sinais não melhorarem, ou se a pessoa ficar confusa ou desmaiar, ligue para o SAMU.
      </Text>
      <Button
        label={`Ligar para o SAMU (${TELEFONE_SAMU})`}
        icon={Phone}
        variant="danger"
        size="lg"
        accessibilityHint="Abre o telefone para ligar para o SAMU"
        onPress={ligarParaOSamu}
      />
    </Card>
  );
}

export default function GuiaCalorScreen() {
  return (
    <Screen edges={['bottom']}>
      <View className="gap-1">
        <Text variant="title" weight="bold" tone="primary">
          Como se proteger do calor
        </Text>
        <Text tone="muted">
          Com a idade, o corpo sente menos sede e tem mais dificuldade para se refrescar. Estes cuidados ajudam nos dias
          quentes.
        </Text>
      </View>

      <SeuGuiaDeHoje />

      <Text variant="headline" accessibilityRole="header" className="pt-space-sm">
        Cuidados para todos os dias
      </Text>
      {CUIDADOS.map((cuidado) => (
        <CartaoDeCuidado key={cuidado.titulo} {...cuidado} />
      ))}

      <SinaisDeAlerta />

      <View className="pb-space-sm">
        <Button
          label="Encontrar um refúgio"
          icon={MapPin}
          variant="secondary"
          size="lg"
          onPress={() => router.navigate('/')}
        />
      </View>
    </Screen>
  );
}
