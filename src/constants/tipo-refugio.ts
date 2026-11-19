import { Building2, Church, Library, type LucideIcon, MapPin, School, Stethoscope, Users } from 'lucide-react-native';

import type { TipoRefugio } from '@/types/refugio';

export const TIPO_REFUGIO: Record<TipoRefugio, { rotulo: string; Icone: LucideIcon }> = {
  BIBLIOTECA: { rotulo: 'Biblioteca', Icone: Library },
  CENTRO_COMUNITARIO: { rotulo: 'Centro comunitário', Icone: Users },
  CEU: { rotulo: 'CEU', Icone: Building2 },
  UBS: { rotulo: 'UBS', Icone: Stethoscope },
  ESCOLA: { rotulo: 'Escola', Icone: School },
  IGREJA: { rotulo: 'Igreja', Icone: Church },
  OUTRO: { rotulo: 'Outro', Icone: MapPin },
};
