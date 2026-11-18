import { z } from 'zod';
import { fechaDepoisDeAbrir, type Refugio, refugioCamposSchema, type RefugioRequest } from '@/types/refugio';

export const refugioFormSchema = refugioCamposSchema
  .extend({
    tipo: z.string().min(1, 'Escolha o tipo do refúgio.').pipe(refugioCamposSchema.shape.tipo),
    capacidade: z
      .string()
      .trim()
      .min(1, 'Informe a capacidade.')
      .regex(/^\d+$/, 'Use apenas números.')
      .transform(Number)
      .pipe(refugioCamposSchema.shape.capacidade),
  })
  .refine(fechaDepoisDeAbrir.validar, fechaDepoisDeAbrir.opcoes);

export type RefugioForm = z.input<typeof refugioFormSchema>;

export const FORMULARIO_VAZIO: RefugioForm = {
  nome: '',
  tipo: '',
  cep: '',
  endereco: '',
  bairro: '',
  capacidade: '',
  abre: '08:00',
  fecha: '18:00',
  acessivel: false,
  ativo: true,
};

export function paraFormulario(refugio: Refugio): RefugioForm {
  return {
    nome: refugio.nome,
    tipo: refugio.tipo,
    cep: refugio.cep,
    endereco: refugio.endereco,
    bairro: refugio.bairro,
    capacidade: String(refugio.capacidade),
    abre: refugio.abre,
    fecha: refugio.fecha,
    acessivel: refugio.acessivel,
    ativo: refugio.ativo,
  };
}

export function paraRequest({ id: _id, vagasDisponiveis: _vagas, ...campos }: Refugio): RefugioRequest {
  return campos;
}
