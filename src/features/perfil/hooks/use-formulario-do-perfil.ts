import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useForm } from 'react-hook-form';
import { queryKeys } from '@/services/query-keys';
import {
  type AtualizarUsuarioForm,
  type AtualizarUsuarioRequest,
  atualizarUsuarioRequestSchema,
  type Usuario,
} from '@/types/usuario';
import { applyApiErrors } from '@/utils/apply-api-errors';
import { atualizarPerfil } from '../perfil.service';
import { usePerfil } from './use-perfil';

const FORMULARIO_VAZIO: AtualizarUsuarioForm = {
  nome: '',
  bairro: '',
  telefone: '',
  contatoEmergenciaNome: '',
  contatoEmergenciaTelefone: '',
};

export function paraFormulario(usuario: Usuario): AtualizarUsuarioForm {
  return {
    nome: usuario.nome,
    bairro: usuario.bairro ?? '',
    telefone: usuario.telefone ?? '',
    contatoEmergenciaNome: usuario.contatoEmergenciaNome ?? '',
    contatoEmergenciaTelefone: usuario.contatoEmergenciaTelefone ?? '',
  };
}

export function useFormularioDoPerfil() {
  const perfil = usePerfil();
  const queryClient = useQueryClient();

  const form = useForm<AtualizarUsuarioForm, unknown, AtualizarUsuarioRequest>({
    resolver: zodResolver(atualizarUsuarioRequestSchema),
    defaultValues: FORMULARIO_VAZIO,
    values: perfil.data ? paraFormulario(perfil.data) : undefined,
    resetOptions: { keepDirtyValues: true },
  });

  const salvar = useMutation({
    mutationFn: atualizarPerfil,
    onSuccess: (atualizado) => {
      queryClient.setQueryData(queryKeys.perfil, atualizado);
      form.reset(paraFormulario(atualizado));
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    onError: (erro) => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      applyApiErrors(erro, form);
    },
  });

  const submeter = form.handleSubmit((dados) => salvar.mutate(dados));

  return {
    perfil,
    form,
    enviar: () => void submeter(),
    salvando: salvar.isPending,
    salvo: salvar.isSuccess && !form.formState.isDirty,
  };
}
