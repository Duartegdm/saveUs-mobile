import { z } from 'zod';
import { dataSchema, horaSchema } from './common';

export const guiaDoCalorSchema = z.object({
  resumo: z.string(),
  dicas: z.array(z.object({ titulo: z.string(), descricao: z.string() })),
  refugio: z
    .object({
      id: z.number().int(),
      nome: z.string(),
      endereco: z.string(),
      data: dataSchema,
      abre: horaSchema,
      fecha: horaSchema,
      acessivel: z.boolean().nullable(),
    })
    .nullable(),
  sinaisDeAlerta: z.array(z.string()),
  emergencia: z.string(),
  geradoPorIa: z.boolean(),
});
export type GuiaDoCalor = z.infer<typeof guiaDoCalorSchema>;
