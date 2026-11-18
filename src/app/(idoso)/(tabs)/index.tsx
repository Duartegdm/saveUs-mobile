import { router } from 'expo-router';
import { MapPinOff } from 'lucide-react-native';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { EstadoDaLista } from '@/components/estado-da-lista';
import { Screen, Text } from '@/components/ui';
import { useAuth } from '@/features/auth/use-auth';
import { BannerGuiaCalor } from '@/features/guia-calor/components/banner-guia-calor';
import { FiltroData } from '@/features/refugios/components/filtro-data';
import { RefugioCard } from '@/features/refugios/components/refugio-card';
import { SeletorBairro } from '@/features/refugios/components/seletor-bairro';
import { useFiltrosDoInicio } from '@/features/refugios/hooks/use-filtros-do-inicio';
import { useRefugios } from '@/features/refugios/hooks/use-refugios';
import { colors } from '@/theme/colors';
import { formatarDataLonga } from '@/utils/date';

function descreverTotal(total: number, bairro: string | null) {
  const onde = bairro ? `em ${bairro}` : 'em todos os bairros';
  return total === 1 ? `1 refúgio aberto ${onde}` : `${total} refúgios abertos ${onde}`;
}

function Separador() {
  return <View className="h-space-md" />;
}

type EstadoDoInicioProps = {
  carregando: boolean;
  erro: Error | null;
  bairro: string | null;
  onTentarDeNovo: () => void;
  onVerTodos: () => void;
};

function EstadoDoInicio({ carregando, erro, bairro, onTentarDeNovo, onVerTodos }: EstadoDoInicioProps) {
  if (carregando) return <EstadoDaLista tipo="carregando" mensagem="Buscando refúgios abertos..." />;
  if (erro) return <EstadoDaLista tipo="erro" mensagem={erro.message} onTentarDeNovo={onTentarDeNovo} />;

  if (bairro) {
    return (
      <EstadoDaLista
        tipo="vazio"
        icone={MapPinOff}
        titulo="Nenhum refúgio aberto"
        mensagem={`Não encontramos refúgios abertos em ${bairro} nesta data.`}
        acao={{ rotulo: 'Ver todos os bairros', onPress: onVerTodos }}
      />
    );
  }

  return (
    <EstadoDaLista
      tipo="vazio"
      icone={MapPinOff}
      titulo="Nenhum refúgio aberto"
      mensagem="Não encontramos refúgios abertos nesta data."
    />
  );
}

export default function InicioScreen() {
  const auth = useAuth();
  const filtros = useFiltrosDoInicio();
  const consulta = useRefugios(
    { bairro: filtros.bairro ?? undefined, data: filtros.data, ativo: true },
    { enabled: filtros.pronto },
  );

  const primeiroNome = auth.status === 'autenticado' ? auth.usuario.nome.split(' ')[0] : '';
  const carregandoPrimeiraPagina = !filtros.pronto || consulta.isPending;

  const cabecalho = (
    <View className="gap-space-md pb-space-sm">
      <View className="gap-0.5">
        <Text variant="display" tone="primary">
          Olá, {primeiroNome}
        </Text>
        <Text tone="muted">{formatarDataLonga(filtros.hoje)}</Text>
      </View>

      <BannerGuiaCalor />
      <SeletorBairro bairro={filtros.bairro} onEscolher={filtros.escolherBairro} />
      <FiltroData hoje={filtros.hoje} datas={filtros.datas} selecionada={filtros.data} onSelecionar={filtros.setData} />

      {consulta.isSuccess && consulta.total > 0 && (
        <Text variant="headline" accessibilityRole="header">
          {descreverTotal(consulta.total, filtros.bairro)}
        </Text>
      )}
    </View>
  );

  return (
    <Screen scroll={false}>
      <FlatList
        data={consulta.refugios}
        keyExtractor={(refugio) => String(refugio.id)}
        renderItem={({ item }) => (
          <RefugioCard
            refugio={item}
            onVerDetalhes={() =>
              router.push({ pathname: '/refugio/[id]', params: { id: String(item.id), data: filtros.data } })
            }
          />
        )}
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={
          <EstadoDoInicio
            carregando={carregandoPrimeiraPagina}
            erro={consulta.error}
            bairro={filtros.bairro}
            onTentarDeNovo={() => void consulta.refetch()}
            onVerTodos={() => filtros.escolherBairro(null)}
          />
        }
        ListFooterComponent={
          consulta.isFetchingNextPage ? (
            <View className="py-space-md">
              <ActivityIndicator color={colors.secondary} />
            </View>
          ) : undefined
        }
        ItemSeparatorComponent={Separador}
        onEndReached={() => {
          if (consulta.hasNextPage && !consulta.isFetchingNextPage) void consulta.fetchNextPage();
        }}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={consulta.isRefetching && !consulta.isFetchingNextPage}
            onRefresh={() => void consulta.refetch()}
            colors={[colors.secondary]}
            tintColor={colors.secondary}
          />
        }
        contentContainerClassName="pb-space-lg"
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
