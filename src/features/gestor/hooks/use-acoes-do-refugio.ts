import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { refugiosDoGestor } from '@/features/refugios/refugio.service';
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
      id === undefined ? refugiosDoGestor.criar(dados) : refugiosDoGestor.atualizar(id, dados),
    ...useAoConcluir(),
  });
}

export function useAlternarAtivo() {
  return useMutation({
    mutationFn: (refugio: Refugio) => refugiosDoGestor.atualizar(refugio.id, { ...paraRequest(refugio), ativo: !refugio.ativo }),
    ...useAoConcluir(),
  });
}

export function useExcluirRefugio() {
  return useMutation({
    mutationFn: (id: number) => refugiosDoGestor.excluir(id),
    ...useAoConcluir(queryKeys.refugios.listas),
  });
}
