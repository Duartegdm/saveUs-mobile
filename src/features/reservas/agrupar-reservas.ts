import type { Reserva } from '@/types/reserva';
import type { DataApi } from '@/utils/date';

export type SecaoDeReservas = {
  titulo: string;
  data: Reserva[];
};

export function agruparReservas(reservas: Reserva[], hoje: DataApi): SecaoDeReservas[] {
  const ativas = reservas.filter((reserva) => reserva.status === 'ATIVA');
  const ordenadas = [...ativas].sort((a, b) => a.dataReserva.localeCompare(b.dataReserva));

  const secoes: SecaoDeReservas[] = [
    { titulo: 'Hoje', data: ordenadas.filter((reserva) => reserva.dataReserva === hoje) },
    { titulo: 'Próximas', data: ordenadas.filter((reserva) => reserva.dataReserva > hoje) },
  ];

  return secoes.filter((secao) => secao.data.length > 0);
}
