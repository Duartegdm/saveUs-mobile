import { act, renderHook } from '@testing-library/react-native';
import { agruparReservas } from '@/features/reservas/agrupar-reservas';
import { criarChavesDeIdempotencia } from '@/features/reservas/chaves-de-idempotencia';
import { useCriarReserva } from '@/features/reservas/hooks/use-criar-reserva';
import { podeReservar } from '@/features/reservas/pode-reservar';
import { cancelarReserva, listarMinhasReservas, obterReserva } from '@/features/reservas/reserva.service';
import { ApiError } from '@/services/api';
import { requisicoes, simularApi, simularErro, simularResposta } from '@/test-utils/api-falsa';
import { umaReserva } from '@/test-utils/fabricas';
import { comQueryClient } from '@/test-utils/providers';

describe('chaves de idempotência', () => {
  it('reaproveita a chave da mesma tentativa e troca depois do sucesso', () => {
    let contador = 0;
    const chaves = criarChavesDeIdempotencia(() => `uuid-${++contador}`);
    const primeira = chaves.obter(1, '2026-11-27');

    expect(chaves.obter(1, '2026-11-27')).toBe(primeira);
    expect(chaves.obter(1, '2026-11-28')).not.toBe(primeira);
    expect(chaves.obter(2, '2026-11-27')).not.toBe(primeira);

    chaves.descartar(1, '2026-11-27');
    expect(chaves.obter(1, '2026-11-27')).not.toBe(primeira);
  });
});

describe('useCriarReserva', () => {
  function simularBackendIdempotente() {
    const reservasPorChave = new Map<string, number>();
    let proximoId = 100;
    simularApi((config) => {
      const chave = String(config.headers['Idempotency-Key']);
      if (!reservasPorChave.has(chave)) reservasPorChave.set(chave, ++proximoId);
      const corpo = JSON.parse(String(config.data));
      return { status: 201, data: umaReserva({ id: reservasPorChave.get(chave), ...corpo }) };
    });
    return reservasPorChave;
  }

  it('toque duplo usa a mesma chave e cria uma única reserva', async () => {
    const reservas = simularBackendIdempotente();
    const { result } = await renderHook(() => useCriarReserva(), { wrapper: comQueryClient().wrapper });

    await act(async () => {
      await Promise.all([
        result.current.mutateAsync({ refugioId: 1, dataReserva: '2026-11-27' }),
        result.current.mutateAsync({ refugioId: 1, dataReserva: '2026-11-27' }),
      ]);
    });

    expect(requisicoes).toHaveLength(2);
    expect(requisicoes[0].headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/);
    expect(requisicoes[0].headers['Idempotency-Key']).toBe(requisicoes[1].headers['Idempotency-Key']);
    expect(reservas.size).toBe(1);
  });

  it('depois do sucesso, a próxima reserva usa outra chave', async () => {
    simularBackendIdempotente();
    const { result } = await renderHook(() => useCriarReserva(), { wrapper: comQueryClient().wrapper });

    await act(() => result.current.mutateAsync({ refugioId: 1, dataReserva: '2026-11-27' }));
    await act(() => result.current.mutateAsync({ refugioId: 1, dataReserva: '2026-11-27' }));

    expect(requisicoes[0].headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/);
    expect(requisicoes[0].headers['Idempotency-Key']).not.toBe(requisicoes[1].headers['Idempotency-Key']);
  });

  it('nova tentativa depois de um erro reaproveita a chave', async () => {
    simularErro(409, { title: 'Sem vaga', detail: 'Este refúgio não tem mais vagas para 27/11.' });
    const { result } = await renderHook(() => useCriarReserva(), { wrapper: comQueryClient().wrapper });

    await act(async () => {
      await result.current.mutateAsync({ refugioId: 1, dataReserva: '2026-11-27' }).catch(() => undefined);
    });
    const primeiraChave = requisicoes[0].headers['Idempotency-Key'];
    expect(primeiraChave).toMatch(/^[0-9a-f-]{36}$/);

    simularResposta({ status: 201, data: umaReserva() });
    await act(() => result.current.mutateAsync({ refugioId: 1, dataReserva: '2026-11-27' }));
    expect(requisicoes[0].headers['Idempotency-Key']).toBe(primeiraChave);
  });
});

describe('podeReservar', () => {
  it('permite com vagas e explica quando não pode', () => {
    expect(podeReservar({ ativo: true, vagasDisponiveis: 3 })).toEqual({ permitida: true });
    expect(podeReservar({ ativo: false, vagasDisponiveis: 10 })).toEqual({
      permitida: false,
      motivo: 'Este refúgio está fechado.',
    });
    expect(podeReservar({ ativo: true, vagasDisponiveis: 0 })).toMatchObject({ permitida: false });
  });
});

describe('agruparReservas', () => {
  const hoje = '2026-11-17';

  it('separa em Hoje e Próximas, em ordem, sem canceladas nem passadas', () => {
    const secoes = agruparReservas(
      [
        umaReserva({ id: 3, dataReserva: '2026-11-20' }),
        umaReserva({ id: 1, dataReserva: hoje }),
        umaReserva({ id: 2, dataReserva: '2026-11-18' }),
        umaReserva({ id: 4, dataReserva: '2026-11-19', status: 'CANCELADA' }),
        umaReserva({ id: 5, dataReserva: '2026-11-16' }),
      ],
      hoje,
    );
    expect(secoes.map((secao) => [secao.titulo, secao.data.map((reserva) => reserva.id)])).toEqual([
      ['Hoje', [1]],
      ['Próximas', [2, 3]],
    ]);
  });

  it('esconde seções vazias', () => {
    expect(agruparReservas([umaReserva({ dataReserva: '2026-11-18' })], hoje).map((secao) => secao.titulo)).toEqual([
      'Próximas',
    ]);
    expect(agruparReservas([], hoje)).toEqual([]);
  });
});

describe('serviço de reservas', () => {
  it('lista, obtém e cancela nas rotas certas', async () => {
    simularResposta({ data: [umaReserva()] });
    await listarMinhasReservas();
    simularResposta({ data: umaReserva({ id: 7, status: 'CANCELADA' }) });
    expect((await obterReserva(7)).status).toBe('CANCELADA');
    simularResposta({ status: 204, data: '' });
    await cancelarReserva(7);
    expect([requisicoes[0].method, requisicoes[0].url]).toEqual(['delete', '/api/v1/reservas/7']);
  });

  it('cancelar reserva passada devolve o 422 da API', async () => {
    simularErro(422, { title: 'Reserva encerrada', detail: 'Não é possível cancelar uma reserva de data passada.' });
    const erro = await cancelarReserva(7).catch((e: unknown) => e);
    expect(erro).toBeInstanceOf(ApiError);
    expect(erro).toMatchObject({ status: 422, title: 'Reserva encerrada' });
  });
});
