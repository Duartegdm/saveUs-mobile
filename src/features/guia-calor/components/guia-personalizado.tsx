import { Accessibility, Clock, MapPin, Sparkles } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';
import { Badge, Card, Text } from '@/components/ui';
import type { GuiaDoCalor } from '@/types/guia';
import { colors } from '@/theme/colors';
import { formatarDataLonga, formatarHora } from '@/utils/date';
import { useGuiaDoCalor } from '../hooks/use-guia-do-calor';

function RefugioDoGuia({ refugio }: { refugio: NonNullable<GuiaDoCalor['refugio']> }) {
  return (
    <View className="gap-2 rounded-xl bg-secondary-container p-3">
      <Text variant="label" weight="bold" tone="onSecondaryContainer">
        Sua vaga: {formatarDataLonga(refugio.data)}
      </Text>
      <Text weight="bold">{refugio.nome}</Text>
      <View className="flex-row items-center gap-2">
        <MapPin color={colors['on-secondary-container']} size={16} />
        <Text variant="bodySm" className="flex-1">
          {refugio.endereco}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Clock color={colors['on-secondary-container']} size={16} />
        <Text variant="bodySm">
          Das {formatarHora(refugio.abre)} às {formatarHora(refugio.fecha)}
        </Text>
      </View>
      {refugio.acessivel && (
        <View className="flex-row items-center gap-2">
          <Accessibility color={colors['on-secondary-container']} size={16} />
          <Text variant="bodySm">Acessível para cadeira de rodas</Text>
        </View>
      )}
    </View>
  );
}

/**
 * Guia gerado pelo backend Java a partir da próxima reserva do idoso.
 * Sem o backend Java, ou se ele falhar, a tela segue só com os cuidados fixos.
 */
export function GuiaPersonalizado() {
  const guia = useGuiaDoCalor();

  if (guia.isPending && guia.fetchStatus === 'fetching') {
    return (
      <Card className="flex-row items-center gap-3">
        <ActivityIndicator color={colors.secondary} />
        <Text tone="muted" className="flex-1">
          Preparando o seu guia de hoje...
        </Text>
      </Card>
    );
  }

  if (!guia.isSuccess) return null;

  const { resumo, dicas, refugio, geradoPorIa } = guia.data;

  return (
    <Card className="gap-4 border border-secondary/30" accessible={false}>
      <View className="gap-2">
        <Text variant="headline" accessibilityRole="header">
          Seu guia de hoje
        </Text>
        {geradoPorIa && <Badge label="Feito para você com IA" tone="success" icon={Sparkles} />}
      </View>

      <Text>{resumo}</Text>

      {refugio && <RefugioDoGuia refugio={refugio} />}

      <View className="gap-3">
        {dicas.map((dica) => (
          <View key={dica.titulo} accessible accessibilityLabel={`${dica.titulo}. ${dica.descricao}`} className="gap-0.5">
            <Text variant="label" weight="bold">
              {dica.titulo}
            </Text>
            <Text variant="bodySm" tone="muted">
              {dica.descricao}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
