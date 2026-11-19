import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import type { ReactNode } from 'react';
import LoginScreen from '@/app/(auth)/login';
import { simularErro, simularResposta } from '@/test-utils/api-falsa';
import { umUsuario } from '@/test-utils/fabricas';
import { comAutenticacao } from '@/test-utils/providers';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: ReactNode }) => children,
}));

const memoria = (SecureStore as unknown as { __memoria: Map<string, string> }).__memoria;

async function abrirLogin() {
  await render(<LoginScreen />, { wrapper: comAutenticacao().wrapper });
}

async function preencherEEntrar(email = 'maria@email.com', senha = 'Senha@123') {
  await fireEvent.changeText(screen.getByLabelText('E-mail'), email);
  await fireEvent.changeText(screen.getByLabelText('Senha'), senha);
  await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
}

beforeEach(() => memoria.clear());

it('campos vazios mostram as mensagens de validação', async () => {
  await abrirLogin();
  await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  expect(await screen.findByText('Informe o e-mail.')).toBeOnTheScreen();
  expect(screen.getByText('Informe a senha.')).toBeOnTheScreen();
});

it('senha errada mostra a mensagem da API', async () => {
  simularErro(401, { title: 'Credenciais inválidas', detail: 'E-mail ou senha incorretos.' });
  await abrirLogin();
  await preencherEEntrar();
  expect(await screen.findByText('E-mail ou senha incorretos.')).toBeOnTheScreen();
});

it('excesso de tentativas bloqueia o botão com contagem', async () => {
  simularErro(429, { title: 'Muitas requisições' }, { 'retry-after': '30' });
  await abrirLogin();
  await preencherEEntrar();
  expect(await screen.findByText('Muitas tentativas seguidas')).toBeOnTheScreen();
  expect(screen.getByText(/aguarde 30 segundos/)).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Entrar' })).toBeDisabled();
});

it('login certo salva a sessão', async () => {
  const { id, nome, email, papel } = umUsuario();
  simularResposta({
    data: {
      token: 'jwt.abc',
      expiraEm: new Date(Date.now() + 3_600_000).toISOString(),
      usuario: { id, nome, email, papel },
    },
  });
  await abrirLogin();
  await preencherEEntrar();
  await waitFor(() => expect(memoria.has('saveus.sessao')).toBe(true));
});
