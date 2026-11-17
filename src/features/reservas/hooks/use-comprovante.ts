import { useQuery } from '@tanstack/react-query';
import { useRefugio } from '@/features/refugios/hooks/use-refugio';
import { queryKeys } from '@/services/query-keys';
import { obterReserva } from '../reserva.service';

export function useComprovante(id: number) {
  const reserva = useQuery({
    queryKey: queryKeys.reservas.detalhe(id),
    queryFn: () => obterReserva(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  const refugio = useRefugio(reserva.data?.refugioId ?? 0, reserva.data?.dataReserva ?? '');

  return {
    reserva: reserva.data,
    refugio: refugio.data,
    carregando: reserva.isPending || (reserva.isSuccess && refugio.isPending),
    erro: reserva.error,
    tentarDeNovo: () => void reserva.refetch(),
  };
}
