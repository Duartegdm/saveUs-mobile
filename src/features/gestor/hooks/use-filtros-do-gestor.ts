import { useState } from 'react';
import type { Segmento } from '@/components/ui';

export type Situacao = 'todos' | 'ativos' | 'pausados';

export const SEGMENTOS_DE_SITUACAO: Segmento<Situacao>[] = [
  { valor: 'todos', rotulo: 'Todos', rotuloAcessivel: 'Todos os refúgios' },
  { valor: 'ativos', rotulo: 'Recebendo', rotuloAcessivel: 'Recebendo reservas' },
  { valor: 'pausados', rotulo: 'Pausados', rotuloAcessivel: 'Reservas pausadas' },
];

const ATIVO_POR_SITUACAO: Record<Situacao, boolean | undefined> = {
  todos: undefined,
  ativos: true,
  pausados: false,
};

const DESCRICAO_POR_SITUACAO: Record<Situacao, [singular: string, plural: string]> = {
  todos: ['cadastrado', 'cadastrados'],
  ativos: ['recebendo reservas', 'recebendo reservas'],
  pausados: ['pausado', 'pausados'],
};

export function descreverResultado(total: number, situacao: Situacao, bairro: string | null) {
  const [singular, plural] = DESCRICAO_POR_SITUACAO[situacao];
  const frase = total === 1 ? `1 refúgio ${singular}` : `${total} refúgios ${plural}`;
  return bairro ? `${frase} em ${bairro}` : frase;
}

export function useFiltrosDoGestor() {
  const [situacao, setSituacao] = useState<Situacao>('todos');
  const [bairro, setBairro] = useState<string | null>(null);

  return {
    situacao,
    setSituacao,
    bairro,
    escolherBairro: (novo: string | null) => setBairro(novo?.trim() || null),
    filtros: { ativo: ATIVO_POR_SITUACAO[situacao], bairro: bairro ?? undefined },
    temFiltro: situacao !== 'todos' || bairro !== null,
    limpar: () => {
      setSituacao('todos');
      setBairro(null);
    },
  };
}
