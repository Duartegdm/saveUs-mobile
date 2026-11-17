import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import { hojeEmSaoPaulo } from '@/utils/date';
import { agruparReservas } from '../agrupar-reservas';
import { listarMinhasReservas } from '../reserva.service';

export function useMinhasReservas() {
  const consulta = useQuery({ queryKey: queryKeys.reservas.minhas, queryFn: listarMinhasReservas });
  const secoes = agruparReservas(consulta.data ?? [], hojeEmSaoPaulo());

  return { ...consulta, secoes, total: secoes.reduce((soma, secao) => soma + secao.data.length, 0) };
}
