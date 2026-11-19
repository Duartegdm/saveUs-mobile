import { useState } from 'react';
import { adicionarDias, type DataApi, hojeEmSaoPaulo } from '@/utils/date';

const DIAS_PARA_ESCOLHER = 3;

export function useEscolhaDeDia() {
  const hoje = hojeEmSaoPaulo();
  const [data, setData] = useState<DataApi>(hoje);

  return {
    hoje,
    datas: Array.from({ length: DIAS_PARA_ESCOLHER }, (_, dias) => adicionarDias(hoje, dias)),
    data,
    setData,
  };
}
