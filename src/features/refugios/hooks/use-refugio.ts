import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import type { DataApi } from '@/utils/date';
import { refugiosDoIdoso, type ServicoDeRefugios } from '../refugio.service';

export function useRefugio(id: number, data: DataApi, servico: ServicoDeRefugios = refugiosDoIdoso) {
  return useQuery({
    queryKey: queryKeys.refugios.detalhe(id, data),
    queryFn: () => servico.obter(id, data),
    enabled: Number.isInteger(id) && id > 0,
  });
}
