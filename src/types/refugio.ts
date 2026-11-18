import { z } from 'zod';
import { horaSchema, paginaSchema } from './common';

export const tipoRefugioSchema = z.enum([
  'BIBLIOTECA',
  'CENTRO_COMUNITARIO',
  'CEU',
  'UBS',
  'ESCOLA',
  'IGREJA',
  'OUTRO',
]);
export type TipoRefugio = z.infer<typeof tipoRefugioSchema>;

export const refugioSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  tipo: tipoRefugioSchema,
  cep: z.string(),
  endereco: z.string(),
  bairro: z.string(),
  capacidade: z.number().int(),
  vagasDisponiveis: z.number().int(),
  abre: horaSchema,
  fecha: horaSchema,
  acessivel: z.boolean(),
  ativo: z.boolean(),
});
export type Refugio = z.infer<typeof refugioSchema>;

export const paginaRefugioSchema = paginaSchema(refugioSchema);

export type ListarRefugiosQuery = {
  bairro?: string;
  data?: string;
  ativo?: boolean;
  pagina?: number;
  tamanho?: number;
};

const cepRegex = /^\d{5}-?\d{3}$/;

export const refugioCamposSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome do refúgio.').max(150),
  tipo: tipoRefugioSchema,
  cep: z.string().trim().regex(cepRegex, 'O CEP deve ter 8 dígitos, como 03601-000.'),
  endereco: z.string().trim().min(1, 'Informe o endereço.').max(200),
  bairro: z.string().trim().min(1, 'Informe o bairro.').max(100),
  capacidade: z
    .number({ error: 'Informe a capacidade.' })
    .int()
    .gt(0, 'A capacidade deve ser maior que zero.')
    .max(10_000, 'A capacidade deve ser de no máximo 10.000 pessoas.'),
  abre: horaSchema,
  fecha: horaSchema,
  acessivel: z.boolean(),
  ativo: z.boolean(),
});

export const fechaDepoisDeAbrir = {
  validar: (r: { abre: string; fecha: string }) => r.fecha > r.abre,
  opcoes: { path: ['fecha'], message: 'O horário de fechamento deve ser depois da abertura.' },
};

export const refugioRequestSchema = refugioCamposSchema.refine(fechaDepoisDeAbrir.validar, fechaDepoisDeAbrir.opcoes);
export type RefugioRequest = z.infer<typeof refugioRequestSchema>;

export const cepResponseSchema = z.object({
  cep: z.string(),
  endereco: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  uf: z.string(),
});
export type CepResponse = z.infer<typeof cepResponseSchema>;
