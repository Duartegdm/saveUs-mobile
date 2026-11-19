import { router } from 'expo-router';
import { Building2, Plus, SearchX } from 'lucide-react-native';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { EstadoDaLista } from '@/components/estado-da-lista';
import { Alert, Button, Screen, Segmentos, Text } from '@/components/ui';
import { useAuth } from '@/features/auth/use-auth';
import { GestorRefugioCard } from '@/features/gestor/components/gestor-refugio-card';
import { useAlternarAtivo } from '@/features/gestor/hooks/use-acoes-do-refugio';
import { descreverResultado, SEGMENTOS_DE_SITUACAO, useFiltrosDoGestor } from '@/features/gestor/hooks/use-filtros-do-gestor';
import { FiltroData } from '@/features/refugios/components/filtro-data';
import { SeletorBairro } from '@/features/refugios/components/seletor-bairro';
import { useRefugios } from '@/features/refugios/hooks/use-refugios';
import { refugiosDoGestor } from '@/features/refugios/refugio.service';
import { ApiError } from '@/services/api';
import { colors } from '@/theme/colors';

const cadastrar = () => router.push('/gestor/refugio/novo');

function Separador() {
  return <View className="h-space-md" />;
}

type EstadoDoGestorProps = {
  carregando: boolean;
  erro: Error | null;
  temFiltro: boolean;
  onTentarDeNovo: () => void;
  onLimparFiltros: () => void;
};

function EstadoDoGestor({ carregando, erro, temFiltro, onTentarDeNovo, onLimparFiltros }: EstadoDoGestorProps) {
  if (carregando) return <EstadoDaLista tipo="carregando" mensagem="Buscando os refúgios..." />;
  if (erro) return <EstadoDaLista tipo="erro" mensagem={erro.message} onTentarDeNovo={onTentarDeNovo} />;

  if (temFiltro) {
    return (
      <EstadoDaLista
        tipo="vazio"
        icone={SearchX}
        titulo="Nenhum refúgio encontrado"
        mensagem="Nenhum refúgio corresponde aos filtros escolhidos."
        acao={{ rotulo: 'Limpar filtros', onPress: onLimparFiltros }}
      />
    );
  }

  return (
    <EstadoDaLista
      tipo="vazio"
      icone={Building2}
      titulo="Nenhum refúgio cadastrado"
      mensagem="Cadastre o primeiro local para os idosos começarem a reservar."
      acao={{ rotulo: 'Cadastrar refúgio', onPress: cadastrar }}
    />
  );
}

export default function GestorRefugiosScreen() {
  const auth = useAuth();
  const filtros = useFiltrosDoGestor();
  const consulta = useRefugios(filtros.filtros, { servico: refugiosDoGestor });
  const alternar = useAlternarAtivo();

  const primeiroNome = auth.status === 'autenticado' ? auth.usuario.nome.split(' ')[0] : '';
  const erroAoAlternar = alternar.error;

  const cabecalho = (
    <View className="gap-space-md pb-space-md">
      <View className="gap-0.5">
        <Text variant="display" tone="primary">
          Olá, {primeiroNome}
        </Text>
        <Text tone="muted">Gestão de refúgios</Text>
      </View>
      <Button label="Cadastrar refúgio" icon={Plus} variant="secondary" size="lg" onPress={cadastrar} />
      <Segmentos segmentos={SEGMENTOS_DE_SITUACAO} selecionado={filtros.situacao} onSelecionar={filtros.setSituacao} />
      <SeletorBairro bairro={filtros.bairro} onEscolher={filtros.escolherBairro} />
      <View className="gap-2">
        <Text variant="label" tone="muted">
          Ver vagas para
        </Text>
        <FiltroData hoje={filtros.hoje} datas={filtros.datas} selecionada={filtros.data} onSelecionar={filtros.setData} />
      </View>
      {consulta.isSuccess && consulta.total > 0 && (
        <Text variant="headline" accessibilityRole="header">
          {descreverResultado(consulta.total, filtros.situacao, filtros.bairro)}
        </Text>
      )}
      {erroAoAlternar && (
        <Alert
          tone="error"
          title={erroAoAlternar instanceof ApiError ? erroAoAlternar.title : undefined}
          message={erroAoAlternar.message}
          onDismiss={() => alternar.reset()}
        />
      )}
    </View>
  );

  return (
    <Screen scroll={false} edges={['bottom']}>
      <FlatList
        data={consulta.refugios}
        keyExtractor={(refugio) => String(refugio.id)}
        renderItem={({ item }) => (
          <GestorRefugioCard
            refugio={item}
            data={filtros.data}
            hoje={filtros.hoje}
            alternando={alternar.isPending && alternar.variables?.id === item.id}
            onEditar={() => router.push({ pathname: '/gestor/refugio/[id]', params: { id: String(item.id) } })}
            onAlternarAtivo={() => alternar.mutate(item)}
          />
        )}
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={
          <EstadoDoGestor
            carregando={consulta.isPending}
            erro={consulta.error}
            temFiltro={filtros.temFiltro}
            onTentarDeNovo={() => void consulta.refetch()}
            onLimparFiltros={filtros.limpar}
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
