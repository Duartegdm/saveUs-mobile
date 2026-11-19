import { useEffect, useState } from 'react';

export function useAposAtraso(milissegundos: number) {
  const [passou, setPassou] = useState(false);

  useEffect(() => {
    const temporizador = setTimeout(() => setPassou(true), milissegundos);
    return () => clearTimeout(temporizador);
  }, [milissegundos]);

  return passou;
}
