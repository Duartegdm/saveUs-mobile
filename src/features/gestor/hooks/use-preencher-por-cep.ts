import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { type UseFormReturn, useWatch } from 'react-hook-form';
import { ApiError } from '@/services/api';
import type { RefugioRequest } from '@/types/refugio';
import { cepCompleto } from '@/utils/mascaras';
import { consultarCep } from '../cep.service';
import type { RefugioForm } from '../refugio-form';

const MENSAGEM_SEM_CONSULTA = 'Não foi possível buscar o endereço agora. Preencha os campos abaixo.';

export function usePreencherPorCep(form: UseFormReturn<RefugioForm, unknown, RefugioRequest>) {
  const cep = useWatch({ control: form.control, name: 'cep' });
  const ultimoConsultado = useRef(form.getValues('cep'));

  const consulta = useMutation({
    mutationFn: consultarCep,
    onSuccess: (endereco) => {
      const opcoes = { shouldDirty: true, shouldValidate: true };
      form.setValue('endereco', endereco.endereco, opcoes);
      form.setValue('bairro', endereco.bairro, opcoes);
    },
    onError: (erro) => {
      if (erro instanceof ApiError && (erro.status === 404 || erro.status === 400)) {
        form.setError('cep', { type: 'server', message: erro.message });
      }
    },
  });

  const consultar = consulta.mutate;

  useEffect(() => {
    if (!cepCompleto(cep) || cep === ultimoConsultado.current) return;
    ultimoConsultado.current = cep;
    consultar(cep);
  }, [cep, consultar]);

  const falhouSemResposta =
    consulta.error instanceof ApiError && consulta.error.status !== 404 && consulta.error.status !== 400;

  return {
    buscando: consulta.isPending,
    aviso: falhouSemResposta ? MENSAGEM_SEM_CONSULTA : undefined,
  };
}
