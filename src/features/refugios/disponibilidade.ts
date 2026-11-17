import type { Refugio } from '@/types/refugio';

export type SituacaoDeVagas = 'livre' | 'poucas' | 'lotado';

export type Disponibilidade = {
  situacao: SituacaoDeVagas;
  rotulo: string;
  ocupacao: number;
};

const MINIMO_PARA_POUCAS_VAGAS = 3;
const PROPORCAO_PARA_POUCAS_VAGAS = 0.1;

export function calcularDisponibilidade({
  capacidade,
  vagasDisponiveis,
}: Pick<Refugio, 'capacidade' | 'vagasDisponiveis'>): Disponibilidade {
  if (vagasDisponiveis <= 0 || capacidade <= 0) {
    return { situacao: 'lotado', rotulo: 'Sem vagas', ocupacao: 1 };
  }

  const ocupacao = (capacidade - vagasDisponiveis) / capacidade;
  const limiteDePoucasVagas = Math.max(MINIMO_PARA_POUCAS_VAGAS, Math.ceil(capacidade * PROPORCAO_PARA_POUCAS_VAGAS));

  if (vagasDisponiveis <= limiteDePoucasVagas) {
    const rotulo = vagasDisponiveis === 1 ? 'Última vaga' : `Só ${vagasDisponiveis} vagas`;
    return { situacao: 'poucas', rotulo, ocupacao };
  }

  return { situacao: 'livre', rotulo: `${vagasDisponiveis} vagas livres`, ocupacao };
}
