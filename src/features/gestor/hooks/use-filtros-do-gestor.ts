import { useState } from 'react';
import type { Segmento } from '@/components/ui';
import { adicionarDias, type DataApi, hojeEmSaoPaulo } from '@/utils/date';

const DIAS_NO_FILTRO = 3;

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
  const hoje = hojeEmSaoPaulo();
  const [data, setData] = useState<DataApi>(hoje);

  return {
    situacao,
    setSituacao,
    bairro,
    hoje,
    datas: Array.from({ length: DIAS_NO_FILTRO }, (_, dias) => adicionarDias(hoje, dias)),
    data,
    setData,
    escolherBairro: (novo: string | null) => setBairro(novo?.trim() || null),
    filtros: { ativo: ATIVO_POR_SITUACAO[situacao], bairro: bairro ?? undefined, data },
    temFiltro: situacao !== 'todos' || bairro !== null,
    limpar: () => {
      setSituacao('todos');
      setBairro(null);
    },
  };
}
