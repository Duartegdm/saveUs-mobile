import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import type { DataApi } from '@/utils/date';
import { obterRefugio } from '../refugio.service';

export function useRefugio(id: number, data: DataApi) {
  return useQuery({
    queryKey: queryKeys.refugios.detalhe(id, data),
    queryFn: () => obterRefugio(id, data),
    enabled: Number.isInteger(id) && id > 0,
  });
}
