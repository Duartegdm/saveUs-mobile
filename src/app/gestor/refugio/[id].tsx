import { router, useLocalSearchParams } from 'expo-router';
import { Building2, Save, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { EstadoDaLista } from '@/components/estado-da-lista';
import { Button, Screen } from '@/components/ui';
import { ConfirmarExclusao } from '@/features/gestor/components/confirmar-exclusao';
import { FormularioDoRefugio } from '@/features/gestor/components/formulario-do-refugio';
import { useFormularioDoRefugio } from '@/features/gestor/hooks/use-formulario-do-refugio';
import { useRefugio } from '@/features/refugios/hooks/use-refugio';
import { refugiosDoGestor } from '@/features/refugios/refugio.service';
import type { Refugio } from '@/types/refugio';
import { hojeEmSaoPaulo } from '@/utils/date';

function EditarRefugio({ refugio }: { refugio: Refugio }) {
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const { form, cep, enviar, salvando } = useFormularioDoRefugio({ refugio, onSalvo: () => router.back() });

  return (
    <Screen
      edges={['bottom']}
      rodape={
        <Button
          label="Salvar alterações"
          icon={Save}
          size="lg"
          loading={salvando}
          disabled={!form.formState.isDirty}
          onPress={enviar}
        />
      }>
      <FormularioDoRefugio form={form} cep={cep} />

      <View className="pb-space-sm pt-space-sm">
        <Button label="Excluir refúgio" icon={Trash2} variant="danger" onPress={() => setConfirmandoExclusao(true)} />
      </View>

      <ConfirmarExclusao
        refugio={refugio}
        visivel={confirmandoExclusao}
        onFechar={() => setConfirmandoExclusao(false)}
        onExcluido={() => {
          setConfirmandoExclusao(false);
          router.back();
        }}
      />
    </Screen>
  );
}

export default function EditarRefugioScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Number(params.id);
  const consulta = useRefugio(id, hojeEmSaoPaulo(), refugiosDoGestor);

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <Screen edges={['bottom']}>
        <EstadoDaLista
          tipo="vazio"
          icone={Building2}
          titulo="Refúgio não encontrado"
          mensagem="Este refúgio não existe mais."
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

  return <EditarRefugio refugio={consulta.data} />;
}
