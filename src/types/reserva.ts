import { z } from 'zod';

import { dataSchema } from './common';

export const statusReservaSchema = z.enum(['ATIVA', 'CANCELADA']);
export type StatusReserva = z.infer<typeof statusReservaSchema>;

export const reservaSchema = z.object({
  id: z.number().int(),
  refugioId: z.number().int(),
  refugioNome: z.string(),
  refugioEndereco: z.string(),
  dataReserva: dataSchema,
  status: statusReservaSchema,
  criadoEm: z.string(),
});
export type Reserva = z.infer<typeof reservaSchema>;

export type CriarReservaRequest = {
  refugioId: number;
  dataReserva: string;
};
