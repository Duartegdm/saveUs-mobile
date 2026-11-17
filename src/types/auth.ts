import { z } from 'zod';

import { usuarioResumoSchema } from './usuario';

export const loginResponseSchema = z.object({
  token: z.string(),
  expiraEm: z.string(),
  usuario: usuarioResumoSchema,
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const loginRequestSchema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail.'),
  senha: z.string().min(1, 'Informe a senha.'),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const registrarRequestSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome.').max(150),
  email: z.string().trim().min(1, 'Informe o e-mail.').email('Informe um e-mail válido.').max(200),
  senha: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .max(100)
    .regex(/[A-Z]/, 'A senha deve ter uma letra maiúscula.')
    .regex(/[a-z]/, 'A senha deve ter uma letra minúscula.')
    .regex(/[0-9]/, 'A senha deve ter um número.'),
});
export type RegistrarRequest = z.infer<typeof registrarRequestSchema>;
