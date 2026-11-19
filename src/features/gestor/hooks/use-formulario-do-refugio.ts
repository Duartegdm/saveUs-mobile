import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { Refugio, RefugioRequest } from '@/types/refugio';
import { applyApiErrors } from '@/utils/apply-api-errors';
import { FORMULARIO_VAZIO, paraFormulario, type RefugioForm, refugioFormSchema } from '../refugio-form';
import { useSalvarRefugio } from './use-acoes-do-refugio';
import { usePreencherPorCep } from './use-preencher-por-cep';

type Opcoes = {
  refugio?: Refugio;
  onSalvo: (refugio: Refugio) => void;
};

export function useFormularioDoRefugio({ refugio, onSalvo }: Opcoes) {
  const form = useForm<RefugioForm, unknown, RefugioRequest>({
    resolver: zodResolver(refugioFormSchema),
    defaultValues: refugio ? paraFormulario(refugio) : FORMULARIO_VAZIO,
  });
  const cep = usePreencherPorCep(form);
  const salvar = useSalvarRefugio();

  const submeter = form.handleSubmit((dados) =>
    salvar.mutate({ id: refugio?.id, dados }, { onSuccess: onSalvo, onError: (erro) => applyApiErrors(erro, form) }),
  );

  return { form, cep, enviar: () => void submeter(), salvando: salvar.isPending };
}
