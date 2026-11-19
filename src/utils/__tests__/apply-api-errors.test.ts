import { createFormControl } from 'react-hook-form';
import { ApiError } from '@/services/api';
import { applyApiErrors } from '@/utils/apply-api-errors';

type Cadastro = { nome: string; email: string; senha: string };

function novoFormulario() {
  const { formControl, control } = createFormControl<Cadastro>({ defaultValues: { nome: '', email: '', senha: '' } });
  const mensagens = () =>
    Object.fromEntries(
      Object.entries(control._formState.errors).map(([campo, erro]) => [
        campo,
        (erro as { message?: string })?.message,
      ]),
    );
  return { form: formControl, mensagens };
}

const erro = (status: number, detail: string, fieldErrors: Record<string, string> = {}) =>
  new ApiError({ status, title: 'Erro', detail, fieldErrors });

describe('applyApiErrors', () => {
  it('marca cada campo do formulário com a mensagem da API', () => {
    const { form, mensagens } = novoFormulario();
    applyApiErrors(erro(400, 'x', { email: 'Informe um e-mail válido.', senha: 'A senha deve ter um número.' }), form);
    expect(mensagens()).toEqual({ email: 'Informe um e-mail válido.', senha: 'A senha deve ter um número.' });
  });

  it('manda para root o erro de um campo que não existe na tela', () => {
    const { form, mensagens } = novoFormulario();
    applyApiErrors(erro(400, 'x', { 'Idempotency-Key': 'Envie o header Idempotency-Key.' }), form);
    expect(mensagens()).toEqual({ root: 'Envie o header Idempotency-Key.' });
  });

  it('separa campos conhecidos e desconhecidos', () => {
    const { form, mensagens } = novoFormulario();
    applyApiErrors(erro(400, 'x', { nome: 'Informe o nome.', corpo: 'Envie o corpo.' }), form);
    expect(mensagens()).toEqual({ nome: 'Informe o nome.', root: 'Envie o corpo.' });
  });

  it('erro sem campo vai para root com a mensagem da API', () => {
    const { form, mensagens } = novoFormulario();
    applyApiErrors(erro(409, 'Este refúgio não tem mais vagas para 27/11.'), form);
    expect(mensagens()).toEqual({ root: 'Este refúgio não tem mais vagas para 27/11.' });
  });

  it('usa fieldByStatus para levar o erro a um campo', () => {
    const { form, mensagens } = novoFormulario();
    applyApiErrors(erro(409, 'Este e-mail já está cadastrado.'), form, { fieldByStatus: { 409: 'email' } });
    expect(mensagens()).toEqual({ email: 'Este e-mail já está cadastrado.' });
  });

  it('erro que não veio da API vira mensagem genérica', () => {
    const { form, mensagens } = novoFormulario();
    applyApiErrors(new TypeError('boom'), form);
    expect(mensagens()).toEqual({ root: 'Algo deu errado. Tente de novo.' });
  });
});
