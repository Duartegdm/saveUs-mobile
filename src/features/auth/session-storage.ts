import * as SecureStore from 'expo-secure-store';
import { type LoginResponse, loginResponseSchema } from '@/types/auth';

const CHAVE_SESSAO = 'saveus.sessao';

export type Sessao = LoginResponse;

export async function salvarSessao(sessao: Sessao) {
  await SecureStore.setItemAsync(CHAVE_SESSAO, JSON.stringify(sessao));
}

export async function lerSessao(): Promise<Sessao | null> {
  try {
    const salva = await SecureStore.getItemAsync(CHAVE_SESSAO);
    if (!salva) return null;

    const resultado = loginResponseSchema.safeParse(JSON.parse(salva));
    return resultado.success ? resultado.data : null;
  } catch {
    return null;
  }
}

export async function apagarSessao() {
  await SecureStore.deleteItemAsync(CHAVE_SESSAO);
}

export function sessaoExpirada(sessao: Sessao, agora = Date.now()) {
  const expiraEm = Date.parse(sessao.expiraEm);
  return Number.isNaN(expiraEm) || expiraEm <= agora;
}
