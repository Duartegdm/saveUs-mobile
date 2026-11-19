import { create } from 'axios';
import { api, apiJava } from '@/services/api';

const TEMPO_PARA_ACORDAR_MS = 90_000;

export const clienteSemSessao = create({ timeout: TEMPO_PARA_ACORDAR_MS });

export async function verificarServidores() {
  await Promise.all([
    clienteSemSessao.get(`${api.defaults.baseURL}/health/live`),
    clienteSemSessao.get(`${apiJava.defaults.baseURL}/actuator/health`),
  ]);
  return true;
}
