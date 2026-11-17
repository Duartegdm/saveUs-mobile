import { api } from '@/services/api';
import { type ListarRefugiosQuery, paginaRefugioSchema, refugioSchema } from '@/types/refugio';
import type { DataApi } from '@/utils/date';

export async function listarRefugios(query: ListarRefugiosQuery) {
  const { data } = await api.get<unknown>('/api/v1/refugios', { params: query });
  return paginaRefugioSchema.parse(data);
}

export async function obterRefugio(id: number, data: DataApi) {
  const resposta = await api.get<unknown>(`/api/v1/refugios/${id}`, { params: { data } });
  return refugioSchema.parse(resposta.data);
}
