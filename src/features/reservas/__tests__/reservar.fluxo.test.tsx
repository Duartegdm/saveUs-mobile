import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import RefugioScreen from '@/app/(idoso)/refugio/[id]';
import { requisicoes, simularApi } from '@/test-utils/api-falsa';
import { umaReserva, umRefugio } from '@/test-utils/fabricas';
import { comQueryClient } from '@/test-utils/providers';
import type { Refugio } from '@/types/refugio';

jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn(), navigate: jest.fn() },
  useLocalSearchParams: () => ({ id: '1', data: '2026-11-27' }),
}));

const { router: mockRouter } = jest.requireMock<{ router: { replace: jest.Mock } }>('expo-router');

function simularBackend(refugio: Refugio, reservar: () => { status: number; data: unknown }) {
  simularApi((config) => (config.method === 'get' ? { data: refugio } : reservar()));
}

async function abrirDetalhe() {
  await render(<RefugioScreen />, { wrapper: comQueryClient().wrapper });
  return screen.findByRole('button', { name: 'Reservar vaga' });
}

beforeEach(() => jest.clearAllMocks());

it('reserva e abre o comprovante', async () => {
  simularBackend(umRefugio(), () => ({ status: 201, data: umaReserva({ id: 101 }) }));
  await fireEvent.press(await abrirDetalhe());

  await waitFor(() =>
    expect(mockRouter.replace).toHaveBeenCalledWith({ pathname: '/reserva/[id]', params: { id: '101' } }),
  );
  const pedido = requisicoes.find((requisicao) => requisicao.method === 'post');
  expect(JSON.parse(String(pedido?.data))).toEqual({ refugioId: 1, dataReserva: '2026-11-27' });
  expect(pedido?.headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/);
});

it('sem vaga no envio mostra o motivo vindo da API', async () => {
  simularBackend(umRefugio(), () => ({
    status: 409,
    data: { title: 'Sem vaga', detail: 'Este refúgio não tem mais vagas para 27/11.' },
  }));
  await fireEvent.press(await abrirDetalhe());

  expect(await screen.findByText('Este refúgio não tem mais vagas para 27/11.')).toBeOnTheScreen();
  expect(mockRouter.replace).not.toHaveBeenCalled();
});

it('refúgio lotado desabilita o botão e explica o motivo', async () => {
  simularBackend(umRefugio({ vagasDisponiveis: 0 }), () => ({ status: 500, data: {} }));
  expect(await abrirDetalhe()).toBeDisabled();
  expect(screen.getByText('Não há vagas para esta data. Escolha outro dia ou refúgio.')).toBeOnTheScreen();
});
