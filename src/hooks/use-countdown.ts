import { useCallback, useEffect, useState } from 'react';

export function useCountdown() {
  const [termino, setTermino] = useState<number | null>(null);
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    if (termino === null) return;

    const intervalo = setInterval(() => {
      const instante = Date.now();
      setAgora(instante);
      if (instante >= termino) setTermino(null);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [termino]);

  const iniciar = useCallback((segundos: number) => {
    const instante = Date.now();
    setAgora(instante);
    setTermino(instante + segundos * 1000);
  }, []);

  const segundosRestantes = termino === null ? 0 : Math.max(0, Math.ceil((termino - agora) / 1000));

  return { segundosRestantes, iniciar };
}
