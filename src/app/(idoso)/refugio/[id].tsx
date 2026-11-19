import { router, useLocalSearchParams } from 'expo-router';
import { CalendarCheck, Info, MapPinOff } from 'lucide-react-native';
import { View } from 'react-native';
import { EstadoDaLista } from '@/components/estado-da-lista';
import { Alert, Button, Card, Screen, Text } from '@/components/ui';
import { TIPO_REFUGIO } from '@/constants/tipo-refugio';
import { InformacoesDoRefugio } from '@/features/refugios/components/informacoes-do-refugio';
import { PainelDeVagas } from '@/features/refugios/components/painel-de-vagas';
import { useRefugio } from '@/features/refugios/hooks/use-refugio';
import { useCriarReserva } from '@/features/reservas/hooks/use-criar-reserva';
import { podeReservar } from '@/features/reservas/pode-reservar';
import { ApiError } from '@/services/api';
import { colors } from '@/theme/colors';
import { dataSchema } from '@/types/common';
import type { Refugio } from '@/types/refugio';
import { type DataApi, formatarDataLonga, hojeEmSaoPaulo } from '@/utils/date';

function CabecalhoDoRefugio({ refugio }: { refugio: Refugio }) {
  const { rotulo, Icone } = TIPO_REFUGIO[refugio.tipo];

  return (
    <View className="flex-row items-center gap-3">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-secondary-container">
        <Icone color={colors['on-secondary-container']} size={28} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="title" weight="bold" tone="primary">
          {refugio.nome}
        </Text>
        <Text tone="muted">{rotulo}</Text>
      </View>
    </View>
  );
}

function RegraDaReserva() {
  return (
    <Card variant="filled" className="flex-row items-start gap-3">
      <Info color={colors.secondary} size={20} />
      <Text variant="bodySm" tone="muted" className="flex-1">
        Cada pessoa pode ter uma reserva por dia. Apresente o comprovante na entrada do refúgio.
      </Text>
    </Card>
  );
}

function BarraDeReserva({ refugio, data }: { refugio: Refugio; data: DataApi }) {
  const reserva = useCriarReserva();
  const permissao = podeReservar(refugio);
  const erro = reserva.error;

  const reservar = () =>
    reserva.mutate(
      { refugioId: refugio.id, dataReserva: data },
      { onSuccess: (criada) => router.replace({ pathname: '/reserva/[id]', params: { id: String(criada.id) } }) },
    );

  return (
    <>
      {erro && <Alert tone="error" title={erro instanceof ApiError ? erro.title : undefined} message={erro.message} />}
      <Button
        label="Reservar vaga"
        icon={CalendarCheck}
        variant="secondary"
        size="lg"
        loading={reserva.isPending}
        disabled={!permissao.permitida}
        accessibilityHint={`Reserva uma vaga em ${refugio.nome} para ${formatarDataLonga(data)}`}
        onPress={reservar}
      />
      <Text variant="bodySm" tone="muted" className="text-center">
        {permissao.permitida ? `Para ${formatarDataLonga(data)}` : permissao.motivo}
      </Text>
    </>
  );
}

export default function RefugioScreen() {
  const params = useLocalSearchParams<{ id: string; data?: string }>();
  const id = Number(params.id);
  const dataInformada = dataSchema.safeParse(params.data);
  const data = dataInformada.success ? dataInformada.data : hojeEmSaoPaulo();
  const consulta = useRefugio(id, data);

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <Screen edges={['bottom']}>
        <EstadoDaLista
          tipo="vazio"
          icone={MapPinOff}
          titulo="Refúgio não encontrado"
          mensagem="Este refúgio não está mais disponível."
          acao={{ rotulo: 'Voltar', onPress: () => router.back() }}
        />
      </Screen>
    );
  }

  if (consulta.isPending) {
    return (
      <Screen edges={['bottom']}>
        <EstadoDaLista tipo="carregando" mensagem="Carregando o refúgio..." />
      </Screen>
    );
  }

  if (consulta.isError) {
    return (
      <Screen edges={['bottom']}>
        <EstadoDaLista tipo="erro" mensagem={consulta.error.message} onTentarDeNovo={() => void consulta.refetch()} />
      </Screen>
    );
  }

  const refugio = consulta.data;

  return (
    <Screen edges={['bottom']} rodape={<BarraDeReserva refugio={refugio} data={data} />}>
      <CabecalhoDoRefugio refugio={refugio} />
      <PainelDeVagas refugio={refugio} data={data} />
      <InformacoesDoRefugio refugio={refugio} />
      <RegraDaReserva />
    </Screen>
  );
}
