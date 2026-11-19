import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import type { DataApi } from '@/utils/date';
import { obterGuiaPersonalizado } from '../guia.service';

const TRINTA_MINUTOS_MS = 30 * 60 * 1000;

export function useGuiaPersonalizado(data: DataApi) {
  return useQuery({
    queryKey: queryKeys.guia.dia(data),
    queryFn: () => obterGuiaPersonalizado(data),
    staleTime: TRINTA_MINUTOS_MS,
    retry: false,
  });
}
