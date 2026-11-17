import type { DataApi } from '@/utils/date';

export function criarChavesDeIdempotencia(gerar: () => string) {
  const chaves = new Map<string, string>();
  const identificar = (refugioId: number, data: DataApi) => `${refugioId}:${data}`;

  return {
    obter(refugioId: number, data: DataApi) {
      const id = identificar(refugioId, data);
      const existente = chaves.get(id);
      if (existente) return existente;

      const nova = gerar();
      chaves.set(id, nova);
      return nova;
    },
    descartar(refugioId: number, data: DataApi) {
      chaves.delete(identificar(refugioId, data));
    },
  };
}
