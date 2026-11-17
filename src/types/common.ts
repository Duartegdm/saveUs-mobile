import { z } from 'zod';

export const dataSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato yyyy-MM-dd.');

export const horaSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use o formato HH:mm.');

export const paginaSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    itens: z.array(item),
    pagina: z.number().int(),
    tamanho: z.number().int(),
    totalItens: z.number().int(),
    totalPaginas: z.number().int(),
  });

export type Pagina<T> = {
  itens: T[];
  pagina: number;
  tamanho: number;
  totalItens: number;
  totalPaginas: number;
};
