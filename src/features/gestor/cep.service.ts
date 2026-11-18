import { api } from '@/services/api';
import { cepResponseSchema } from '@/types/refugio';

export async function consultarCep(cep: string) {
  const digitos = cep.replace(/\D/g, '');
  const { data } = await api.get<unknown>(`/api/v1/cep/${digitos}`);
  return cepResponseSchema.parse(data);
}
