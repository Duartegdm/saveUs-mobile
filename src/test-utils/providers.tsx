import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/auth-provider';

export function criarQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false, gcTime: Infinity } },
  });
}

export function comQueryClient(queryClient = criarQueryClient()) {
  function Envoltorio({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return { wrapper: Envoltorio, queryClient };
}

export function comAutenticacao(queryClient = criarQueryClient()) {
  function Envoltorio({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  }
  return { wrapper: Envoltorio, queryClient };
}
