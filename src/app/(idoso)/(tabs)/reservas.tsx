import { router } from 'expo-router';
import { Ticket } from 'lucide-react-native';
import { useState } from 'react';
import { RefreshControl, SectionList, View } from 'react-native';
import { EstadoDaLista } from '@/components/estado-da-lista';
import { Screen, Text } from '@/components/ui';
import { ConfirmarCancelamento } from '@/features/reservas/components/confirmar-cancelamento';
import { ReservaCard } from '@/features/reservas/components/reserva-card';
import { useMinhasReservas } from '@/features/reservas/hooks/use-minhas-reservas';
import { colors } from '@/theme/colors';
import type { Reserva } from '@/types/reserva';
import { hojeEmSaoPaulo } from '@/utils/date';

function Separador() {
  return <View className="h-space-md" />;
}

function descreverTotal(total: number) {
  return total === 1 ? 'Você tem 1 reserva ativa.' : `Você tem ${total} reservas ativas.`;
}

type EstadoDasReservasProps = {
  carregando: boolean;
  erro: Error | null;
  onTentarDeNovo: () => void;
};

function EstadoDasReservas({ carregando, erro, onTentarDeNovo }: EstadoDasReservasProps) {
  if (carregando) return <EstadoDaLista tipo="carregando" mensagem="Buscando suas reservas..." />;
  if (erro) return <EstadoDaLista tipo="erro" mensagem={erro.message} onTentarDeNovo={onTentarDeNovo} />;

  return (
    <EstadoDaLista
      tipo="vazio"
      icone={Ticket}
      titulo="Nenhuma reserva ativa"
      mensagem="Quando você reservar uma vaga, ela aparece aqui com o comprovante."
      acao={{ rotulo: 'Encontrar um refúgio', onPress: () => router.navigate('/') }}
    />
  );
}

export default function ReservasScreen() {
  const consulta = useMinhasReservas();
  const [paraCancelar, setParaCancelar] = useState<Reserva | null>(null);
  const hoje = hojeEmSaoPaulo();

  return (
    <Screen scroll={false}>
      <SectionList
        sections={consulta.secoes}
        keyExtractor={(reserva) => String(reserva.id)}
        renderItem={({ item }) => (
          <ReservaCard
            reserva={item}
            hoje={hoje}
            onVerComprovante={() => router.push({ pathname: '/reserva/[id]', params: { id: String(item.id) } })}
            onCancelar={() => setParaCancelar(item)}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text variant="headline" accessibilityRole="header" className="bg-surface pb-3 pt-space-md">
            {section.titulo}
          </Text>
        )}
        ListHeaderComponent={
          <View className="gap-1">
            <Text variant="display" tone="primary">
              Minhas reservas
            </Text>
            {consulta.total > 0 && <Text tone="muted">{descreverTotal(consulta.total)}</Text>}
          </View>
        }
        ListEmptyComponent={
          <EstadoDasReservas
            carregando={consulta.isPending}
            erro={consulta.error}
            onTentarDeNovo={() => void consulta.refetch()}
          />
        }
        ItemSeparatorComponent={Separador}
        refreshControl={
          <RefreshControl
            refreshing={consulta.isRefetching}
            onRefresh={() => void consulta.refetch()}
            colors={[colors.secondary]}
            tintColor={colors.secondary}
          />
        }
        stickySectionHeadersEnabled={false}
        contentContainerClassName="pb-space-lg"
        showsVerticalScrollIndicator={false}
      />

      <ConfirmarCancelamento reserva={paraCancelar} onFechar={() => setParaCancelar(null)} />
    </Screen>
  );
}
