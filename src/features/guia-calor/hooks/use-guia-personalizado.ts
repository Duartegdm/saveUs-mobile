import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import { obterGuiaPersonalizado } from '../guia.service';

const TRINTA_MINUTOS_MS = 30 * 60 * 1000;

export function useGuiaPersonalizado() {
  return useQuery({
    queryKey: queryKeys.guia,
    queryFn: obterGuiaPersonalizado,
    staleTime: TRINTA_MINUTOS_MS,
    retry: false,
  });
}
