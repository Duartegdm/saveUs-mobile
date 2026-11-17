import { useState } from 'react';
import { usePerfil } from '@/features/perfil/hooks/use-perfil';
import { adicionarDias, type DataApi, hojeEmSaoPaulo } from '@/utils/date';

const DIAS_NO_FILTRO = 3;

export function useFiltrosDoInicio() {
  const perfil = usePerfil();
  const hoje = hojeEmSaoPaulo();
  const datas = Array.from({ length: DIAS_NO_FILTRO }, (_, dias) => adicionarDias(hoje, dias));

  const [data, setData] = useState<DataApi>(hoje);
  const [bairroEscolhido, setBairroEscolhido] = useState<{ bairro: string | null } | null>(null);

  const bairro = bairroEscolhido ? bairroEscolhido.bairro : (perfil.data?.bairro ?? null);

  return {
    hoje,
    datas,
    data,
    setData,
    bairro,
    escolherBairro: (novo: string | null) => setBairroEscolhido({ bairro: novo?.trim() || null }),
    pronto: !perfil.isPending,
  };
}
