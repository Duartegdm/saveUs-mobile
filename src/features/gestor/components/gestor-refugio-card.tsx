import { CircleCheck, CirclePause, Pause, Pencil, Play } from 'lucide-react-native';
import { View } from 'react-native';
import { Badge, Button, Card, ProgressBar, Text } from '@/components/ui';
import { TIPO_REFUGIO } from '@/constants/tipo-refugio';
import { calcularDisponibilidade } from '@/features/refugios/disponibilidade';
import { ESTILO_DA_SITUACAO } from '@/features/refugios/estilo-da-situacao';
import { colors } from '@/theme/colors';
import type { Refugio } from '@/types/refugio';
import { type DataApi, formatarDataLonga, formatarDiaNaFrase, formatarHora } from '@/utils/date';
import { comInicialMinuscula } from '@/utils/texto';

type GestorRefugioCardProps = {
  refugio: Refugio;
  data: DataApi;
  hoje: DataApi;
  alternando: boolean;
  onEditar: () => void;
  onAlternarAtivo: () => void;
};

export function GestorRefugioCard({ refugio, data, hoje, alternando, onEditar, onAlternarAtivo }: GestorRefugioCardProps) {
  const { rotulo, Icone } = TIPO_REFUGIO[refugio.tipo];
  const horario = `${formatarHora(refugio.abre)} às ${formatarHora(refugio.fecha)}`;
  const disponibilidade = calcularDisponibilidade(refugio);
  const estilo = ESTILO_DA_SITUACAO[disponibilidade.situacao];
  const diaPorExtenso = comInicialMinuscula(formatarDataLonga(data));

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
        <View
          accessible
          accessibilityLabel={
            refugio.ativo
              ? `${refugio.vagasDisponiveis} de ${refugio.capacidade} vagas livres para ${diaPorExtenso}`
              : 'Reservas pausadas'
          }
          className="flex-1 gap-1 rounded-xl bg-surface-container-low p-3">
          <Text variant="caption" weight="regular" tone="muted">
            Vagas {formatarDiaNaFrase(data, hoje)}
          </Text>
          <Text variant="label" weight="bold">
            {refugio.ativo ? `${refugio.vagasDisponiveis} de ${refugio.capacidade}` : 'Pausado'}
          </Text>
          {refugio.ativo && (
            <ProgressBar
              value={disponibilidade.ocupacao}
              tone={estilo.barra}
              accessibilityLabel={`${Math.round(disponibilidade.ocupacao * 100)}% ocupado`}
              className="mt-1 h-1.5"
            />
          )}
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
