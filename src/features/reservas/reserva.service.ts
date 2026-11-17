import { api } from '@/services/api';
import { type CriarReservaRequest, reservaSchema } from '@/types/reserva';

export async function criarReserva(reserva: CriarReservaRequest, chaveDeIdempotencia: string) {
  const { data } = await api.post<unknown>('/api/v1/reservas', reserva, {
    headers: { 'Idempotency-Key': chaveDeIdempotencia },
  });
  return reservaSchema.parse(data);
}
