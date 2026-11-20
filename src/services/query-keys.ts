import type { ListarRefugiosQuery } from '@/types/refugio';
import type { DataApi } from '@/utils/date';

export const queryKeys = {
  perfil: ['perfil'] as const,
  guiaDoCalor: ['guia-do-calor'] as const,
  refugios: {
    todos: ['refugios'] as const,
    listas: ['refugios', 'lista'] as const,
    lista: (filtros: Omit<ListarRefugiosQuery, 'pagina'>) => ['refugios', 'lista', filtros] as const,
    detalhe: (id: number, data: DataApi) => ['refugios', 'detalhe', id, data] as const,
  },
  reservas: {
    todas: ['reservas'] as const,
    minhas: ['reservas', 'minhas'] as const,
    detalhe: (id: number) => ['reservas', 'detalhe', id] as const,
  },
};
