import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { atualizarRefugio, criarRefugio, excluirRefugio } from '@/features/refugios/refugio.service';
import { queryKeys } from '@/services/query-keys';
import type { Refugio, RefugioRequest } from '@/types/refugio';
import { paraRequest } from '../refugio-form';

function useAoConcluir(chaveParaAtualizar: readonly string[] = queryKeys.refugios.todos) {
  const queryClient = useQueryClient();

  return {
    onSuccess: () => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      void queryClient.invalidateQueries({ queryKey: chaveParaAtualizar });
    },
    onError: () => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  };
}

export function useSalvarRefugio() {
  return useMutation({
    mutationFn: ({ id, dados }: { id?: number; dados: RefugioRequest }) =>
      id === undefined ? criarRefugio(dados) : atualizarRefugio(id, dados),
    ...useAoConcluir(),
  });
}

export function useAlternarAtivo() {
  return useMutation({
    mutationFn: (refugio: Refugio) => atualizarRefugio(refugio.id, { ...paraRequest(refugio), ativo: !refugio.ativo }),
    ...useAoConcluir(),
  });
}

export function useExcluirRefugio() {
  return useMutation({
    mutationFn: (id: number) => excluirRefugio(id),
    ...useAoConcluir(queryKeys.refugios.listas),
  });
}
