import type { Refugio } from '@/types/refugio';

export type PermissaoDeReserva = { permitida: true } | { permitida: false; motivo: string };

export function podeReservar({
  ativo,
  vagasDisponiveis,
}: Pick<Refugio, 'ativo' | 'vagasDisponiveis'>): PermissaoDeReserva {
  if (!ativo) return { permitida: false, motivo: 'Este refúgio está fechado.' };
  if (vagasDisponiveis <= 0)
    return { permitida: false, motivo: 'Não há vagas para esta data. Escolha outro dia ou refúgio.' };
  return { permitida: true };
}
