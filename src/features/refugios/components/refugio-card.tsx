import { Accessibility, Clock, MapPin } from 'lucide-react-native';
import { View } from 'react-native';
import { Badge, Button, Card, ProgressBar, Text } from '@/components/ui';
import { TIPO_REFUGIO } from '@/constants/tipo-refugio';
import { colors } from '@/theme/colors';
import type { Refugio } from '@/types/refugio';
import { formatarHora } from '@/utils/date';
import { calcularDisponibilidade } from '../disponibilidade';
import { ESTILO_DA_SITUACAO } from '../estilo-da-situacao';

type RefugioCardProps = {
  refugio: Refugio;
  onVerDetalhes: () => void;
};

export function RefugioCard({ refugio, onVerDetalhes }: RefugioCardProps) {
  const { rotulo: tipo, Icone } = TIPO_REFUGIO[refugio.tipo];
  const disponibilidade = calcularDisponibilidade(refugio);
  const estilo = ESTILO_DA_SITUACAO[disponibilidade.situacao];
  const horario = `${formatarHora(refugio.abre)} às ${formatarHora(refugio.fecha)}`;

  return (
    <Card className="gap-4">
      <View className="flex-row gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-surface-container-low">
          <Icone color={colors.secondary} size={24} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text variant="headline" numberOfLines={2}>
            {refugio.nome}
          </Text>
          <Text variant="bodySm" tone="muted">
            {tipo}
          </Text>
        </View>
      </View>

      <View className="gap-1.5">
        <View className="flex-row items-center gap-2">
          <MapPin color={colors['on-surface-variant']} size={16} />
          <Text variant="bodySm" tone="muted" className="flex-1" numberOfLines={1}>
            {refugio.endereco}, {refugio.bairro}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Clock color={colors['on-surface-variant']} size={16} />
          <Text variant="bodySm" tone="muted">
            Aberto das {horario}
          </Text>
        </View>
      </View>

      {refugio.acessivel && <Badge label="Acessível" tone="success" icon={Accessibility} />}

      <View className="gap-2">
        <View className="flex-row items-baseline justify-between">
          <Text variant="label" weight="bold" tone={estilo.tom}>
            {disponibilidade.rotulo}
          </Text>
          <Text variant="caption" weight="regular" tone="muted">
            Capacidade {refugio.capacidade}
          </Text>
        </View>
        <ProgressBar
          value={disponibilidade.ocupacao}
          tone={estilo.barra}
          accessibilityLabel={`Lotação: ${disponibilidade.rotulo} de ${refugio.capacidade} lugares`}
        />
      </View>

      <Button
        label="Ver detalhes"
        variant={disponibilidade.situacao === 'lotado' ? 'tonal' : 'primary'}
        accessibilityHint={`Abre os detalhes de ${refugio.nome}`}
        onPress={onVerDetalhes}
      />
    </Card>
  );
}
