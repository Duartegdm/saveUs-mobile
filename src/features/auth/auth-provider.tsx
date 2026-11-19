import { useQueryClient } from '@tanstack/react-query';
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { setAuthToken, setOnUnauthorized } from '@/services/api';
import type { LoginRequest } from '@/types/auth';
import { login } from './auth.service';
import { AuthContext, type AuthContextValue, type AuthState } from './auth-context';
import { apagarSessao, lerSessao, type Sessao, salvarSessao, sessaoExpirada } from './session-storage';

function usarTokens(sessao: Sessao | null) {
  setAuthToken(sessao?.token ?? null, 'net');
  setAuthToken(sessao?.tokenJava ?? null, 'java');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [estado, setEstado] = useState<AuthState>({ status: 'carregando' });

  const sair = useCallback(async () => {
    usarTokens(null);
    setEstado({ status: 'anonimo' });
    queryClient.clear();
    await apagarSessao();
  }, [queryClient]);

  const entrar = useCallback(
    async (credenciais: LoginRequest) => {
      const sessao = await login(credenciais);
      await salvarSessao(sessao);
      queryClient.clear();
      usarTokens(sessao);
      setEstado({ status: 'autenticado', usuario: sessao.usuario });
    },
    [queryClient],
  );

  useEffect(() => {
    setOnUnauthorized(() => void sair());
    return () => setOnUnauthorized(null);
  }, [sair]);

  useEffect(() => {
    let montado = true;

    lerSessao().then((sessao) => {
      if (!montado) return;

      if (sessao && !sessaoExpirada(sessao)) {
        usarTokens(sessao);
        setEstado({ status: 'autenticado', usuario: sessao.usuario });
        return;
      }

      setEstado({ status: 'anonimo' });
      void apagarSessao();
    });

    return () => {
      montado = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ ...estado, entrar, sair }), [estado, entrar, sair]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
