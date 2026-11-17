import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import { obterPerfil } from '../perfil.service';

export function usePerfil() {
  return useQuery({ queryKey: queryKeys.perfil, queryFn: obterPerfil });
}
