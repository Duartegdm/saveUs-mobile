import { useState } from 'react';
import { usePerfil } from '@/features/perfil/hooks/use-perfil';
import { useEscolhaDeDia } from '@/hooks/use-escolha-de-dia';

export function useFiltrosDoInicio() {
  const perfil = usePerfil();
  const dia = useEscolhaDeDia();
  const [bairroEscolhido, setBairroEscolhido] = useState<{ bairro: string | null } | null>(null);

  const bairro = bairroEscolhido ? bairroEscolhido.bairro : (perfil.data?.bairro ?? null);

  return {
    ...dia,
    bairro,
    escolherBairro: (novo: string | null) => setBairroEscolhido({ bairro: novo?.trim() || null }),
    pronto: !perfil.isPending,
  };
}
