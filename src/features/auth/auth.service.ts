import { api } from '@/services/api';
import { type LoginRequest, type LoginResponse, loginResponseSchema, type RegistrarRequest } from '@/types/auth';
import { type UsuarioResumo, usuarioResumoSchema } from '@/types/usuario';

export async function login(credenciais: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<unknown>('/auth/login', credenciais);
  return loginResponseSchema.parse(data);
}

export async function registrar(dados: RegistrarRequest): Promise<UsuarioResumo> {
  const { data } = await api.post<unknown>('/auth/registrar', dados);
  return usuarioResumoSchema.parse(data);
}
