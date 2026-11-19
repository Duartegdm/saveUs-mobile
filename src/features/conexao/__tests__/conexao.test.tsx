import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react-native';
import type { InternalAxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { TelaDeConexao } from '@/features/conexao/components/tela-de-conexao';
import { clienteSemSessao, verificarServidores } from '@/features/conexao/conexao.service';
import { useConexaoComServidores } from '@/features/conexao/hooks/use-conexao-com-servidores';
import { useAposAtraso } from '@/hooks/use-apos-atraso';
import { setAuthToken } from '@/services/api';
import { comQueryClient } from '@/test-utils/providers';

const chamadas: InternalAxiosRequestConfig[] = [];

function simularServidores(responder: (url: string) => number) {
  chamadas.length = 0;
  clienteSemSessao.defaults.adapter = async (config) => {
    chamadas.push(config);
    const status = responder(String(config.url));
    const resposta = { status, data: {}, headers: {}, statusText: '', config };
    if (status >= 400) throw new AxiosError('fora do ar', 'ERR_BAD_RESPONSE', config, {}, resposta);
    return resposta;
  };
}

afterEach(() => setAuthToken(null));

describe('verificarServidores', () => {
  it('consulta a saúde dos dois backends com tempo para acordar', async () => {
    simularServidores(() => 200);
    await verificarServidores();
    expect(chamadas.map((chamada) => chamada.url).sort()).toEqual([
      'http://api.teste/health/live',
      'http://java.teste/actuator/health',
    ]);
    expect(chamadas.every((chamada) => chamada.timeout === 90_000)).toBe(true);
  });

  it('não envia o token, mesmo com sessão ativa', async () => {
    setAuthToken('token-de-outro-backend');
    simularServidores(() => 200);
    await verificarServidores();
    expect(chamadas.some((chamada) => chamada.headers.Authorization)).toBe(false);
  });

  it('falha se um dos backends estiver fora do ar', async () => {
    simularServidores((url) => (url.includes('java') ? 503 : 200));
    await expect(verificarServidores()).rejects.toThrow();
  });
});

describe('useConexaoComServidores', () => {
  it('fica pronto quando os dois respondem', async () => {
    simularServidores(() => 200);
    const { result } = await renderHook(() => useConexaoComServidores(), { wrapper: comQueryClient().wrapper });
    expect(result.current.estado).toBe('conectando');
    await waitFor(() => expect(result.current.estado).toBe('pronto'));
  });

  it('falha depois de tentar de novo uma vez, e permite continuar', async () => {
    simularServidores(() => 503);
    const { result } = await renderHook(() => useConexaoComServidores(), { wrapper: comQueryClient().wrapper });

    await waitFor(() => expect(result.current.estado).toBe('falhou'), { timeout: 5000 });
    expect(chamadas).toHaveLength(4);

    await act(() => result.current.continuarMesmoAssim());
    expect(result.current.estado).toBe('pronto');
  });
});

describe('TelaDeConexao', () => {
  it('explica a espera enquanto conecta', async () => {
    await render(<TelaDeConexao estado="conectando" />);
    expect(screen.getByText('Conectando ao SaveUs')).toBeOnTheScreen();
    expect(screen.getByText(/pode levar até 1 minuto/)).toBeOnTheScreen();
  });

  it('na falha, oferece tentar de novo e continuar', async () => {
    const tentar = jest.fn();
    const continuar = jest.fn();
    await render(<TelaDeConexao estado="falhou" onTentarDeNovo={tentar} onContinuar={continuar} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Tentar de novo' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Continuar mesmo assim' }));
    expect(tentar).toHaveBeenCalled();
    expect(continuar).toHaveBeenCalled();
  });
});

it('useAposAtraso só libera depois do tempo', async () => {
  jest.useFakeTimers();
  const { result } = await renderHook(() => useAposAtraso(1200));
  expect(result.current).toBe(false);
  await act(() => jest.advanceTimersByTime(1200));
  expect(result.current).toBe(true);
  jest.useRealTimers();
});
