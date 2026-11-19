import { createContext } from 'react';
import type { LoginRequest } from '@/types/auth';
import type { UsuarioResumo } from '@/types/usuario';

export type AuthState =
  { status: 'carregando' } | { status: 'anonimo' } | { status: 'autenticado'; usuario: UsuarioResumo };

export type AuthContextValue = AuthState & {
  entrar: (credenciais: LoginRequest) => Promise<void>;
  sair: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
