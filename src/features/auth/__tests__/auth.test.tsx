import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { login, registrar } from '@/features/auth/auth.service';
import { rotaInicial } from '@/features/auth/rota-inicial';
import { apagarSessao, lerSessao, salvarSessao, sessaoExpirada } from '@/features/auth/session-storage';
import { useAuth } from '@/features/auth/use-auth';
import { ApiError } from '@/services/api';
import { corpoDaUltimaRequisicao, requisicoes, simularErro, simularResposta } from '@/test-utils/api-falsa';
import { umUsuario } from '@/test-utils/fabricas';
import { comAutenticacao } from '@/test-utils/providers';

const CHAVE = 'saveus.sessao';
const memoria = (SecureStore as unknown as { __memoria: Map<string, string> }).__memoria;
const { id, nome, email, papel } = umUsuario();
const usuario = { id, nome, email, papel };
const daquiAUmaHora = () => new Date(Date.now() + 3_600_000).toISOString();
const umaSessao = (expiraEm = daquiAUmaHora()) => ({ token: 'jwt.abc', expiraEm, usuario });

beforeEach(() => memoria.clear());

describe('armazenamento da sessão', () => {
  it('salva e lê a mesma sessão', async () => {
    const sessao = umaSessao();
    await salvarSessao(sessao);
    expect(await lerSessao()).toEqual(sessao);
  });

  it('JSON corrompido ou fora do formato vira null', async () => {
    memoria.set(CHAVE, '{quebrado');
    expect(await lerSessao()).toBeNull();
    memoria.set(CHAVE, JSON.stringify({ token: 'x' }));
    expect(await lerSessao()).toBeNull();
  });

  it('apagar sem sessão não lança erro', async () => {
    await expect(apagarSessao()).resolves.toBeUndefined();
  });

  it('detecta expiração, inclusive data inválida', () => {
    expect(sessaoExpirada(umaSessao())).toBe(false);
    expect(sessaoExpirada(umaSessao(new Date(Date.now() - 1000).toISOString()))).toBe(true);
    expect(sessaoExpirada(umaSessao('lixo'))).toBe(true);
    expect(sessaoExpirada(umaSessao('2099-01-01T10:00:00-03:00'))).toBe(false);
  });
});

describe('serviço de autenticação', () => {
  it('login envia as credenciais e valida a resposta', async () => {
    simularResposta({ data: umaSessao() });
    const sessao = await login({ email: 'maria@email.com', senha: 'Senha@123' });
    expect(requisicoes[0].url).toBe('/auth/login');
    expect(corpoDaUltimaRequisicao()).toEqual({ email: 'maria@email.com', senha: 'Senha@123' });
    expect(sessao.usuario.papel).toBe('IDOSO');
  });

  it('login com resposta fora do contrato falha', async () => {
    simularResposta({ data: { token: 'x' } });
    await expect(login({ email: 'a', senha: 'b' })).rejects.not.toBeInstanceOf(ApiError);
  });

  it('cadastro chama /auth/registrar', async () => {
    simularResposta({ status: 201, data: usuario });
    await registrar({ nome: 'Ana', email: 'ana@email.com', senha: 'Senha@123' });
    expect(requisicoes[0].url).toBe('/auth/registrar');
  });
});

it.each([
  [null, '/login'],
  ['IDOSO', '/'],
  ['GESTOR', '/gestor'],
] as const)('rota inicial de %s é %s', (papelDoUsuario, rota) => {
  expect(rotaInicial(papelDoUsuario)).toBe(rota);
});

describe('AuthProvider', () => {
  it('sem sessão salva começa anônimo', async () => {
    const { result } = await renderHook(() => useAuth(), { wrapper: comAutenticacao().wrapper });
    await waitFor(() => expect(result.current.status).toBe('anonimo'));
  });

  it('restaura uma sessão válida ao abrir o app', async () => {
    await salvarSessao(umaSessao());
    const { result } = await renderHook(() => useAuth(), { wrapper: comAutenticacao().wrapper });
    await waitFor(() => expect(result.current.status).toBe('autenticado'));
  });

  it('descarta uma sessão expirada', async () => {
    await salvarSessao(umaSessao(new Date(Date.now() - 1000).toISOString()));
    const { result } = await renderHook(() => useAuth(), { wrapper: comAutenticacao().wrapper });
    await waitFor(() => expect(result.current.status).toBe('anonimo'));
    expect(memoria.has(CHAVE)).toBe(false);
  });

  it('entrar salva a sessão e sair apaga', async () => {
    simularResposta({ data: umaSessao() });
    const { result } = await renderHook(() => useAuth(), { wrapper: comAutenticacao().wrapper });
    await waitFor(() => expect(result.current.status).toBe('anonimo'));

    await act(() => result.current.entrar({ email: 'maria@email.com', senha: 'Senha@123' }));
    expect(result.current.status).toBe('autenticado');
    expect(memoria.has(CHAVE)).toBe(true);

    await act(() => result.current.sair());
    expect(result.current.status).toBe('anonimo');
    expect(memoria.has(CHAVE)).toBe(false);
  });

  it('um 401 durante o uso encerra a sessão', async () => {
    await salvarSessao(umaSessao());
    const { result } = await renderHook(() => useAuth(), { wrapper: comAutenticacao().wrapper });
    await waitFor(() => expect(result.current.status).toBe('autenticado'));

    simularErro(401, { title: 'Não autenticado' });
    await act(async () => {
      await login({ email: 'x', senha: 'y' }).catch(() => undefined);
    });
    await waitFor(() => expect(result.current.status).toBe('anonimo'));
  });
});
