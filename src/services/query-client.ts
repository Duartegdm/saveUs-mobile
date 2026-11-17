import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './api';

const MAXIMO_DE_TENTATIVAS = 2;

function deveTentarDeNovo(tentativas: number, erro: Error) {
  const erroDoCliente = erro instanceof ApiError && erro.status >= 400 && erro.status < 500;
  return !erroDoCliente && tentativas < MAXIMO_DE_TENTATIVAS;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: deveTentarDeNovo,
    },
  },
});
