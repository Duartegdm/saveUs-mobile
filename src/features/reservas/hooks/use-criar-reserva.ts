import { useMutation, useQueryClient } from '@tanstack/react-query';
import { randomUUID } from 'expo-crypto';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { ApiError } from '@/services/api';
import { queryKeys } from '@/services/query-keys';
import type { CriarReservaRequest } from '@/types/reserva';
import { criarChavesDeIdempotencia } from '../chaves-de-idempotencia';
import { criarReserva } from '../reserva.service';

const STATUS_QUE_MUDAM_AS_VAGAS = [409, 422];

export function useCriarReserva() {
  const queryClient = useQueryClient();
  const [chaves] = useState(() => criarChavesDeIdempotencia(randomUUID));

  return useMutation({
    mutationFn: (reserva: CriarReservaRequest) =>
      criarReserva(reserva, chaves.obter(reserva.refugioId, reserva.dataReserva)),
    onSuccess: (_reserva, { refugioId, dataReserva }) => {
      chaves.descartar(refugioId, dataReserva);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      void queryClient.invalidateQueries({ queryKey: queryKeys.refugios.todos });
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservas.todas });
      void queryClient.invalidateQueries({ queryKey: queryKeys.guia.todos });
    },
    onError: (erro, { refugioId, dataReserva }) => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (erro instanceof ApiError && STATUS_QUE_MUDAM_AS_VAGAS.includes(erro.status)) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.refugios.detalhe(refugioId, dataReserva) });
      }
    },
  });
}
