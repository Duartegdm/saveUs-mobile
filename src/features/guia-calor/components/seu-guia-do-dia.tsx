import { CalendarCheck, Sparkles } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';
import { Badge, Button, Card, Text } from '@/components/ui';
import { FiltroData } from '@/features/refugios/components/filtro-data';
import { useEscolhaDeDia } from '@/hooks/use-escolha-de-dia';
import { colors } from '@/theme/colors';
import type { GuiaDoCalor } from '@/types/guia';
import { type DataApi, formatarDataLonga, formatarHora } from '@/utils/date';
import { useGuiaPersonalizado } from '../hooks/use-guia-personalizado';

function RefugioReservado({ refugio }: { refugio: NonNullable<GuiaDoCalor['refugio']> }) {
  const horario = `${formatarHora(refugio.abre)} às ${formatarHora(refugio.fecha)}`;

  return (
    <View
      accessible
      accessibilityLabel={`Sua reserva: ${refugio.nome}, ${formatarDataLonga(refugio.data)}, das ${horario}`}
      className="flex-row items-start gap-3 rounded-xl bg-surface-container-low p-3">
      <CalendarCheck color={colors.secondary} size={20} />
      <View className="flex-1 gap-0.5">
        <Text variant="label" weight="bold">
          {refugio.nome}
        </Text>
        <Text variant="bodySm" tone="muted">
          {formatarDataLonga(refugio.data)}, das {horario}
        </Text>
      </View>
    </View>
  );
}

function ConteudoDoGuia({ data }: { data: DataApi }) {
  const guia = useGuiaPersonalizado(data);

  if (guia.isPending) {
    return (
      <View className="flex-row items-center gap-3 py-2" accessibilityLiveRegion="polite">
        <ActivityIndicator color={colors.secondary} />
        <Text tone="muted" className="flex-1">
          Preparando seu guia...
        </Text>
      </View>
    );
  }

  if (guia.isError) {
    return (
      <View className="gap-3">
        <Text variant="bodySm" tone="muted">
          Não foi possível preparar seu guia agora. As orientações abaixo continuam valendo.
        </Text>
        <Button label="Tentar de novo" variant="tonal" onPress={() => void guia.refetch()} />
      </View>
    );
  }

  const { resumo, dicas, refugio, geradoPorIa } = guia.data;

  return (
    <View className="gap-4">
      {geradoPorIa && <Badge label="Feito para você" tone="success" icon={Sparkles} />}

      <Text>{resumo}</Text>

      {refugio && <RefugioReservado refugio={refugio} />}

      <View className="gap-3">
        {dicas.map((dica) => (
          <View
            key={dica.titulo}
            accessible
            accessibilityLabel={`${dica.titulo}. ${dica.descricao}`}
            className="gap-0.5">
            <Text variant="label" weight="bold" tone="secondary">
              {dica.titulo}
            </Text>
            <Text variant="bodySm" tone="muted">
              {dica.descricao}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function SeuGuiaDoDia() {
  const dia = useEscolhaDeDia();

  return (
    <Card className="gap-4 border border-secondary/30">
      <Text variant="headline" accessibilityRole="header">
        Seu guia do dia
      </Text>
      <FiltroData hoje={dia.hoje} datas={dia.datas} selecionada={dia.data} onSelecionar={dia.setData} />
      <ConteudoDoGuia data={dia.data} />
    </Card>
  );
}
