import { apiJava } from '@/services/api';
import { guiaDoCalorSchema } from '@/types/guia';

const TEMPO_MAXIMO_DA_IA_MS = 60_000;

export async function obterGuiaPersonalizado() {
  const { data } = await apiJava.post<unknown>('/api/v1/ia/guia-do-calor', {}, { timeout: TEMPO_MAXIMO_DA_IA_MS });
  return guiaDoCalorSchema.parse(data);
}
