import { api } from '@/services/api';
import { type ListarRefugiosQuery, paginaRefugioSchema, type RefugioRequest, refugioSchema } from '@/types/refugio';
import type { DataApi } from '@/utils/date';

export async function listarRefugios(query: ListarRefugiosQuery) {
  const { data } = await api.get<unknown>('/api/v1/refugios', { params: query });
  return paginaRefugioSchema.parse(data);
}

export async function obterRefugio(id: number, data: DataApi) {
  const resposta = await api.get<unknown>(`/api/v1/refugios/${id}`, { params: { data } });
  return refugioSchema.parse(resposta.data);
}

export async function criarRefugio(refugio: RefugioRequest) {
  const { data } = await api.post<unknown>('/api/v1/refugios', refugio);
  return refugioSchema.parse(data);
}

export async function atualizarRefugio(id: number, refugio: RefugioRequest) {
  const { data } = await api.put<unknown>(`/api/v1/refugios/${id}`, refugio);
  return refugioSchema.parse(data);
}

export async function excluirRefugio(id: number) {
  await api.delete(`/api/v1/refugios/${id}`);
}
