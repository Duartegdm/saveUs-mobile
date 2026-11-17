import { router, useLocalSearchParams } from 'expo-router';
import { Navigation, Ticket } from 'lucide-react-native';
import { Alert as AlertNativo, Linking, View } from 'react-native';
import { EstadoDaLista } from '@/components/estado-da-lista';
import { Button, Screen, Text } from '@/components/ui';
import { CartaoComprovante } from '@/features/reservas/components/cartao-comprovante';
import { useComprovante } from '@/features/reservas/hooks/use-comprovante';
import type { Reserva } from '@/types/reserva';

function abrirMapa(reserva: Reserva) {
  const destino = encodeURIComponent(`${reserva.refugioNome}, ${reserva.refugioEndereco}, São Paulo`);
  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${destino}`).catch(() =>
    AlertNativo.alert('Não foi possível abrir o mapa', 'Procure o endereço do refúgio no seu aplicativo de mapas.'),
  );
}

function AcoesDoComprovante({ reserva }: { reserva: Reserva }) {
  return (
    <>
      {reserva.status === 'ATIVA' && (
        <Button
          label="Como chegar"
          icon={Navigation}
          variant="secondary"
          size="lg"
          accessibilityHint="Abre o endereço do refúgio no aplicativo de mapas"
          onPress={() => abrirMapa(reserva)}
        />
      )}
      <Button label="Ver minhas reservas" icon={Ticket} variant="tonal" onPress={() => router.navigate('/reservas')} />
    </>
  );
}

export default function ComprovanteScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Number(params.id);
  const { reserva, refugio, carregando, erro, tentarDeNovo } = useComprovante(id);

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <Screen edges={['bottom']}>
        <EstadoDaLista
          tipo="vazio"
          icone={Ticket}
          titulo="Reserva não encontrada"
          mensagem="Não encontramos este comprovante."
          acao={{ rotulo: 'Ver minhas reservas', onPress: () => router.navigate('/reservas') }}
        />
      </Screen>
    );
  }

  if (carregando) {
    return (
      <Screen edges={['bottom']}>
        <EstadoDaLista tipo="carregando" mensagem="Carregando o comprovante..." />
      </Screen>
    );
  }

  if (erro || !reserva) {
    return (
      <Screen edges={['bottom']}>
        <EstadoDaLista
          tipo="erro"
          mensagem={erro?.message ?? 'Não foi possível carregar o comprovante.'}
          onTentarDeNovo={tentarDeNovo}
        />
      </Screen>
    );
  }

  const ativa = reserva.status === 'ATIVA';

  return (
    <Screen edges={['bottom']} rodape={<AcoesDoComprovante reserva={reserva} />}>
      <View className="gap-1">
        <Text variant="title" weight="bold" tone="primary">
          {ativa ? 'Sua vaga está garantida' : 'Reserva cancelada'}
        </Text>
        <Text tone="muted">
          {ativa
            ? 'Apresente este comprovante na entrada do refúgio.'
            : 'Você pode fazer uma nova reserva pela tela Início.'}
        </Text>
      </View>

      <CartaoComprovante reserva={reserva} refugio={refugio} />
    </Screen>
  );
}
