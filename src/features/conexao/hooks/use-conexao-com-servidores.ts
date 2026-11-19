import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { queryKeys } from '@/services/query-keys';
import { verificarServidores } from '../conexao.service';

export type EstadoDaConexao = 'conectando' | 'pronto' | 'falhou';

export function useConexaoComServidores() {
  const [continuarSemConexao, setContinuarSemConexao] = useState(false);
  const consulta = useQuery({
    queryKey: queryKeys.saude,
    queryFn: verificarServidores,
    retry: 1,
    staleTime: Infinity,
  });

  let estado: EstadoDaConexao = 'conectando';
  if (consulta.isSuccess || continuarSemConexao) estado = 'pronto';
  else if (consulta.isError && !consulta.isFetching) estado = 'falhou';

  return {
    estado,
    tentarDeNovo: () => void consulta.refetch(),
    continuarMesmoAssim: () => setContinuarSemConexao(true),
  };
}
