import { z } from 'zod';
import { api } from '@/services/api';
import { type CriarReservaRequest, reservaSchema } from '@/types/reserva';

export async function criarReserva(reserva: CriarReservaRequest, chaveDeIdempotencia: string) {
  const { data } = await api.post<unknown>('/api/v1/reservas', reserva, {
    headers: { 'Idempotency-Key': chaveDeIdempotencia },
  });
  return reservaSchema.parse(data);
}

export async function obterReserva(id: number) {
  const { data } = await api.get<unknown>(`/api/v1/reservas/${id}`);
  return reservaSchema.parse(data);
}

export async function listarMinhasReservas() {
  const { data } = await api.get<unknown>('/api/v1/reservas/minhas');
  return z.array(reservaSchema).parse(data);
}

export async function cancelarReserva(id: number) {
  await api.delete(`/api/v1/reservas/${id}`);
}
