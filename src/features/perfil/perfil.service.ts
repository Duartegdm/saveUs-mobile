import { api } from '@/services/api';
import { usuarioSchema } from '@/types/usuario';

export async function obterPerfil() {
  const { data } = await api.get<unknown>('/api/v1/usuarios/me');
  return usuarioSchema.parse(data);
}
