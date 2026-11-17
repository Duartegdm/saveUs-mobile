import { z } from 'zod';

export const papelSchema = z.enum(['IDOSO', 'GESTOR']);
export type Papel = z.infer<typeof papelSchema>;

export const usuarioResumoSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  email: z.string(),
  papel: papelSchema,
});
export type UsuarioResumo = z.infer<typeof usuarioResumoSchema>;

export const usuarioSchema = usuarioResumoSchema.extend({
  bairro: z.string().nullable(),
  telefone: z.string().nullable(),
  contatoEmergenciaNome: z.string().nullable(),
  contatoEmergenciaTelefone: z.string().nullable(),
});
export type Usuario = z.infer<typeof usuarioSchema>;

const telefoneRegex = /^[0-9()+\-\s]{8,20}$/;

const opcional = (schema: z.ZodString) =>
  z
    .string()
    .trim()
    .transform((v) => (v === '' ? null : v))
    .pipe(schema.nullable());

const telefone = z.string().regex(telefoneRegex, 'Informe um telefone válido, como (11) 98888-0000.');

export const atualizarUsuarioRequestSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome.').max(150),
  bairro: opcional(z.string().max(100)),
  telefone: opcional(telefone),
  contatoEmergenciaNome: opcional(z.string().max(150)),
  contatoEmergenciaTelefone: opcional(telefone),
});
export type AtualizarUsuarioForm = z.input<typeof atualizarUsuarioRequestSchema>;
export type AtualizarUsuarioRequest = z.output<typeof atualizarUsuarioRequestSchema>;
