import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { queryKeys } from '@/services/query-keys';
import type { Reserva } from '@/types/reserva';
import { cancelarReserva } from '../reserva.service';

export function useCancelarReserva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reserva: Reserva) => cancelarReserva(reserva.id),
    onSuccess: (_resultado, reserva) => {
      queryClient.setQueryData<Reserva[]>(queryKeys.reservas.minhas, (atuais) =>
        atuais?.filter((atual) => atual.id !== reserva.id),
      );
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservas.todas });
      void queryClient.invalidateQueries({ queryKey: queryKeys.refugios.todos });
      void queryClient.invalidateQueries({ queryKey: queryKeys.guiaDoCalor });
    },
    onError: () => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });
}
