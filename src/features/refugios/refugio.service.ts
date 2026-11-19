import type { AxiosInstance } from 'axios';
import { api, apiJava } from '@/services/api';
import { type ListarRefugiosQuery, paginaRefugioSchema, type RefugioRequest, refugioSchema } from '@/types/refugio';
import type { DataApi } from '@/utils/date';

function criarServicoDeRefugios(cliente: AxiosInstance) {
  return {
    async listar(query: ListarRefugiosQuery) {
      const { data } = await cliente.get<unknown>('/api/v1/refugios', { params: query });
      return paginaRefugioSchema.parse(data);
    },
    async obter(id: number, data: DataApi) {
      const resposta = await cliente.get<unknown>(`/api/v1/refugios/${id}`, { params: { data } });
      return refugioSchema.parse(resposta.data);
    },
    async criar(refugio: RefugioRequest) {
      const { data } = await cliente.post<unknown>('/api/v1/refugios', refugio);
      return refugioSchema.parse(data);
    },
    async atualizar(id: number, refugio: RefugioRequest) {
      const { data } = await cliente.put<unknown>(`/api/v1/refugios/${id}`, refugio);
      return refugioSchema.parse(data);
    },
    async excluir(id: number) {
      await cliente.delete(`/api/v1/refugios/${id}`);
    },
  };
}

export type ServicoDeRefugios = ReturnType<typeof criarServicoDeRefugios>;

export const refugiosDoIdoso = criarServicoDeRefugios(api);
export const refugiosDoGestor = criarServicoDeRefugios(apiJava);
