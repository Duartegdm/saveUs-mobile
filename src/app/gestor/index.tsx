import { router } from 'expo-router';
import { Building2, Info, Plus } from 'lucide-react-native';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { EstadoDaLista } from '@/components/estado-da-lista';
import { Alert, Button, Screen, Text } from '@/components/ui';
import { useAuth } from '@/features/auth/use-auth';
import { GestorRefugioCard } from '@/features/gestor/components/gestor-refugio-card';
import { useAlternarAtivo } from '@/features/gestor/hooks/use-acoes-do-refugio';
import { useRefugios } from '@/features/refugios/hooks/use-refugios';
import { refugiosDoGestor } from '@/features/refugios/refugio.service';
import { ApiError } from '@/services/api';
import { colors } from '@/theme/colors';

const cadastrar = () => router.push('/gestor/refugio/novo');

function Separador() {
  return <View className="h-space-md" />;
}

function descreverTotal(total: number) {
  return total === 1 ? '1 refúgio cadastrado' : `${total} refúgios cadastrados`;
}

type EstadoDoGestorProps = {
  carregando: boolean;
  erro: Error | null;
  onTentarDeNovo: () => void;
};

function EstadoDoGestor({ carregando, erro, onTentarDeNovo }: EstadoDoGestorProps) {
  if (carregando) return <EstadoDaLista tipo="carregando" mensagem="Buscando os refúgios..." />;
  if (erro) return <EstadoDaLista tipo="erro" mensagem={erro.message} onTentarDeNovo={onTentarDeNovo} />;

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
  const consulta = useRefugios({}, { servico: refugiosDoGestor });
  const alternar = useAlternarAtivo();

  const primeiroNome = auth.status === 'autenticado' ? auth.usuario.nome.split(' ')[0] : '';
  const erroAoAlternar = alternar.error;

  const cabecalho = (
    <View className="gap-space-md pb-space-md">
      <View className="gap-0.5">
        <Text variant="display" tone="primary">
          Olá, {primeiroNome}
        </Text>
        <Text tone="muted">{consulta.isSuccess ? descreverTotal(consulta.total) : 'Gestão de refúgios'}</Text>
      </View>
      <Button label="Cadastrar refúgio" icon={Plus} variant="secondary" size="lg" onPress={cadastrar} />
      <Button label="Sobre o App" icon={Info} variant="tonal" onPress={() => router.push('/sobre')} />
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
            onTentarDeNovo={() => void consulta.refetch()}
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
