import type { ListarRefugiosQuery } from '@/types/refugio';

export const queryKeys = {
  perfil: ['perfil'] as const,
  refugios: {
    todos: ['refugios'] as const,
    lista: (filtros: Omit<ListarRefugiosQuery, 'pagina'>) => ['refugios', 'lista', filtros] as const,
  },
};
