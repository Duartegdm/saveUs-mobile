import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import type { ListarRefugiosQuery } from '@/types/refugio';
import { refugiosDoIdoso, type ServicoDeRefugios } from '../refugio.service';

const TAMANHO_DA_PAGINA = 10;

type Filtros = Pick<ListarRefugiosQuery, 'bairro' | 'data' | 'ativo'>;

type Opcoes = { enabled?: boolean; servico?: ServicoDeRefugios };

export function useRefugios(
  { bairro, data, ativo }: Filtros,
  { enabled = true, servico = refugiosDoIdoso }: Opcoes = {},
) {
  const filtros = { bairro, data, ativo, tamanho: TAMANHO_DA_PAGINA };

  const consulta = useInfiniteQuery({
    queryKey: queryKeys.refugios.lista(filtros),
    queryFn: ({ pageParam }) => servico.listar({ ...filtros, pagina: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (ultima) => (ultima.pagina < ultima.totalPaginas ? ultima.pagina + 1 : undefined),
    enabled,
  });

  const refugios = consulta.data?.pages.flatMap((pagina) => pagina.itens) ?? [];
  const total = consulta.data?.pages[0]?.totalItens ?? 0;

  return { ...consulta, refugios, total };
}
