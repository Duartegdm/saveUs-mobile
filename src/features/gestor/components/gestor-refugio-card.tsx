import { CircleCheck, CirclePause, Pause, Pencil, Play } from 'lucide-react-native';
import { View } from 'react-native';
import { Badge, Button, Card, Text } from '@/components/ui';
import { TIPO_REFUGIO } from '@/constants/tipo-refugio';
import { colors } from '@/theme/colors';
import type { Refugio } from '@/types/refugio';
import { formatarHora } from '@/utils/date';

type GestorRefugioCardProps = {
  refugio: Refugio;
  alternando: boolean;
  onEditar: () => void;
  onAlternarAtivo: () => void;
};

export function GestorRefugioCard({ refugio, alternando, onEditar, onAlternarAtivo }: GestorRefugioCardProps) {
  const { rotulo, Icone } = TIPO_REFUGIO[refugio.tipo];
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
            {rotulo} em {refugio.bairro}
          </Text>
        </View>
      </View>

      {refugio.ativo ? (
        <Badge label="Recebendo reservas" tone="success" icon={CircleCheck} />
      ) : (
        <Badge label="Reservas pausadas" tone="warning" icon={CirclePause} />
      )}

      <View className="flex-row gap-3">
        <View className="flex-1 gap-0.5 rounded-xl bg-surface-container-low p-3">
          <Text variant="caption" weight="regular" tone="muted">
            Vagas hoje
          </Text>
          <Text variant="label" weight="bold">
            {refugio.ativo ? `${refugio.vagasDisponiveis} de ${refugio.capacidade}` : 'Pausado'}
          </Text>
        </View>
        <View className="flex-1 gap-0.5 rounded-xl bg-surface-container-low p-3">
          <Text variant="caption" weight="regular" tone="muted">
            Horário
          </Text>
          <Text variant="label" weight="bold">
            {horario}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <Button
          label="Editar"
          icon={Pencil}
          onPress={onEditar}
          accessibilityLabel={`Editar ${refugio.nome}`}
          className="flex-1"
        />
        <Button
          label={refugio.ativo ? 'Pausar' : 'Reativar'}
          icon={refugio.ativo ? Pause : Play}
          variant="tonal"
          loading={alternando}
          onPress={onAlternarAtivo}
          accessibilityLabel={`${refugio.ativo ? 'Pausar' : 'Reativar'} reservas em ${refugio.nome}`}
          className="flex-1"
        />
      </View>
    </Card>
  );
}
