import { Lock } from 'lucide-react-native';
import { View } from 'react-native';
import { Badge, Card, ProgressBar, Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import type { Refugio } from '@/types/refugio';
import { type DataApi, formatarDataLonga } from '@/utils/date';
import { calcularDisponibilidade } from '../disponibilidade';
import { ESTILO_DA_SITUACAO } from '../estilo-da-situacao';

type PainelDeVagasProps = {
  refugio: Refugio;
  data: DataApi;
};

function emMinusculas(texto: string) {
  return texto.charAt(0).toLowerCase() + texto.slice(1);
}

export function PainelDeVagas({ refugio, data }: PainelDeVagasProps) {
  if (!refugio.ativo) {
    return (
      <Card className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-error-container">
          <Lock color={colors['on-error-container']} size={22} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text variant="headline">Refúgio fechado</Text>
          <Text variant="bodySm" tone="muted">
            Este refúgio não está recebendo reservas no momento.
          </Text>
        </View>
      </Card>
    );
  }

  const disponibilidade = calcularDisponibilidade(refugio);
  const estilo = ESTILO_DA_SITUACAO[disponibilidade.situacao];
  const quando = emMinusculas(formatarDataLonga(data));
  const reservadas = refugio.capacidade - refugio.vagasDisponiveis;

  return (
    <Card className="gap-4">
      <View
        accessible
        accessibilityLabel={`${refugio.vagasDisponiveis} de ${refugio.capacidade} vagas livres para ${quando}`}
        className="gap-1">
        <Text variant="label" tone="muted">
          Vagas para {quando}
        </Text>
        <View className="flex-row items-end justify-between gap-3">
          <View className="flex-row items-baseline gap-1.5">
            <Text variant="metric" tone={estilo.tom === 'default' ? 'primary' : estilo.tom}>
              {refugio.vagasDisponiveis}
            </Text>
            <Text variant="headline" weight="medium" tone="muted">
              de {refugio.capacidade}
            </Text>
          </View>
          <Badge label={estilo.rotuloDoSelo} tone={estilo.selo} className="mb-2" />
        </View>
      </View>

      <ProgressBar
        value={disponibilidade.ocupacao}
        tone={estilo.barra}
        accessibilityLabel={`${reservadas} de ${refugio.capacidade} lugares já reservados`}
      />
      <Text variant="bodySm" tone="muted">
        {reservadas === 1 ? '1 pessoa já reservou' : `${reservadas} pessoas já reservaram`}
      </Text>
    </Card>
  );
}
