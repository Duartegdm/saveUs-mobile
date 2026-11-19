import { apiJava } from '@/services/api';
import { guiaDoCalorSchema } from '@/types/guia';
import type { DataApi } from '@/utils/date';

const TEMPO_MAXIMO_DA_IA_MS = 60_000;

export async function obterGuiaPersonalizado(data: DataApi) {
  const { data: guia } = await apiJava.post<unknown>(
    '/api/v1/ia/guia-do-calor',
    { data },
    { timeout: TEMPO_MAXIMO_DA_IA_MS },
  );
  return guiaDoCalorSchema.parse(guia);
}
