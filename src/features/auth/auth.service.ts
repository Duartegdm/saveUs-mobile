import { api, apiJava } from '@/services/api';
import {
  type LoginRequest,
  loginJavaResponseSchema,
  loginResponseSchema,
  type RegistrarRequest,
  type Sessao,
} from '@/types/auth';
import { type UsuarioResumo, usuarioResumoSchema } from '@/types/usuario';

// O backend Java assina o JWT com outra chave, então o app entra nos dois com as mesmas credenciais.
// O .NET decide o login; se o Java falhar, a sessão segue sem o token dele (só gestor e Guia do Calor dependem dele).
async function loginJava(credenciais: LoginRequest): Promise<string | null> {
  try {
    const { data } = await apiJava.post<unknown>('/auth/login', credenciais);
    return loginJavaResponseSchema.parse(data).token;
  } catch {
    return null;
  }
}

export async function login(credenciais: LoginRequest): Promise<Sessao> {
  const [{ data }, tokenJava] = await Promise.all([api.post<unknown>('/auth/login', credenciais), loginJava(credenciais)]);
  return { ...loginResponseSchema.parse(data), tokenJava };
}

export async function registrar(dados: RegistrarRequest): Promise<UsuarioResumo> {
  const { data } = await api.post<unknown>('/auth/registrar', dados);
  return usuarioResumoSchema.parse(data);
}
