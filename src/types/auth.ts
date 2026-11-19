import { z } from 'zod';
import { usuarioResumoSchema } from './usuario';

export const loginResponseSchema = z.object({
  token: z.string(),
  expiraEm: z.string(),
  usuario: usuarioResumoSchema,
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const loginJavaResponseSchema = z.object({ token: z.string() });

// Sessão salva: login do .NET mais o token do backend Java (null se o Java não respondeu no login).
export const sessaoSchema = loginResponseSchema.extend({ tokenJava: z.string().nullable() });
export type Sessao = z.infer<typeof sessaoSchema>;

export const loginRequestSchema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail.'),
  senha: z.string().min(1, 'Informe a senha.'),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export type RegraSenha = {
  rotulo: string;
  mensagem: string;
  atende: (senha: string) => boolean;
};

export const REGRAS_SENHA: RegraSenha[] = [
  {
    rotulo: '8 caracteres ou mais',
    mensagem: 'A senha deve ter entre 8 e 100 caracteres.',
    atende: (senha) => senha.length >= 8 && senha.length <= 100,
  },
  { rotulo: 'uma letra maiúscula', mensagem: 'A senha deve ter uma letra maiúscula.', atende: (senha) => /[A-Z]/.test(senha) },
  { rotulo: 'uma letra minúscula', mensagem: 'A senha deve ter uma letra minúscula.', atende: (senha) => /[a-z]/.test(senha) },
  { rotulo: 'um número', mensagem: 'A senha deve ter um número.', atende: (senha) => /[0-9]/.test(senha) },
];

const senhaSchema = z.string().superRefine((senha, contexto) => {
  for (const regra of REGRAS_SENHA) {
    if (!regra.atende(senha)) contexto.addIssue({ code: 'custom', message: regra.mensagem });
  }
});

export const registrarRequestSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome.').max(150),
  email: z.string().trim().min(1, 'Informe o e-mail.').email('Informe um e-mail válido.').max(200),
  senha: senhaSchema,
});
export type RegistrarRequest = z.infer<typeof registrarRequestSchema>;

export const cadastroFormSchema = registrarRequestSchema
  .extend({ confirmarSenha: z.string().min(1, 'Repita a senha.') })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    path: ['confirmarSenha'],
    message: 'As senhas não conferem.',
  });
export type CadastroForm = z.infer<typeof cadastroFormSchema>;
