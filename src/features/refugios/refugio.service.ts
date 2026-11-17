import { api } from '@/services/api';
import { type ListarRefugiosQuery, paginaRefugioSchema } from '@/types/refugio';

export async function listarRefugios(query: ListarRefugiosQuery) {
  const { data } = await api.get<unknown>('/api/v1/refugios', { params: query });
  return paginaRefugioSchema.parse(data);
}
