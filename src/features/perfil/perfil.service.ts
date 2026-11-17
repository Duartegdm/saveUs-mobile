import { api } from '@/services/api';
import { type AtualizarUsuarioRequest, usuarioSchema } from '@/types/usuario';

export async function obterPerfil() {
  const { data } = await api.get<unknown>('/api/v1/usuarios/me');
  return usuarioSchema.parse(data);
}

export async function atualizarPerfil(dados: AtualizarUsuarioRequest) {
  const { data } = await api.put<unknown>('/api/v1/usuarios/me', dados);
  return usuarioSchema.parse(data);
}
