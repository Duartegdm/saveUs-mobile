import type { Href } from 'expo-router';
import type { Papel } from '@/types/usuario';

export function rotaInicial(papel: Papel | null): Href {
  if (papel === 'GESTOR') return '/gestor';
  if (papel === 'IDOSO') return '/';
  return '/login';
}
