import { apiJava } from '@/services/api';
import { guiaDoCalorSchema } from '@/types/guia';

/** O LLM pode passar dos 15 s padrão do app; acima de 20 s o backend já devolve o guia padrão. */
const TIMEOUT_DO_GUIA_MS = 30_000;

export async function obterGuiaDoCalor() {
  const { data } = await apiJava.post<unknown>('/api/v1/ia/guia-do-calor', {}, { timeout: TIMEOUT_DO_GUIA_MS });
  return guiaDoCalorSchema.parse(data);
}
