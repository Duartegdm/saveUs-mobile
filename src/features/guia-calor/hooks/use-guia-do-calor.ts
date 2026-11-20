import { useQuery } from '@tanstack/react-query';
import { javaConfigurado } from '@/services/api';
import { queryKeys } from '@/services/query-keys';
import { obterGuiaDoCalor } from '../guia.service';

const TRINTA_MINUTOS_MS = 30 * 60 * 1000;

export function useGuiaDoCalor() {
  return useQuery({
    queryKey: queryKeys.guiaDoCalor,
    queryFn: obterGuiaDoCalor,
    enabled: javaConfigurado,
    // O guia depende da próxima reserva; reabrir a tela não precisa gerar outro.
    staleTime: TRINTA_MINUTOS_MS,
    retry: false,
  });
}
