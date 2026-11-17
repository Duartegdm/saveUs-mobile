import type { BadgeTone } from '@/components/ui';
import type { SituacaoDeVagas } from './disponibilidade';

type Estilo = {
  tom: 'secondary' | 'default' | 'error';
  barra: 'success' | 'warning' | 'danger';
  selo: BadgeTone;
  rotuloDoSelo: string;
};

export const ESTILO_DA_SITUACAO: Record<SituacaoDeVagas, Estilo> = {
  livre: { tom: 'secondary', barra: 'success', selo: 'success', rotuloDoSelo: 'Vagas disponíveis' },
  poucas: { tom: 'default', barra: 'warning', selo: 'warning', rotuloDoSelo: 'Poucas vagas' },
  lotado: { tom: 'error', barra: 'danger', selo: 'danger', rotuloDoSelo: 'Lotado' },
};
