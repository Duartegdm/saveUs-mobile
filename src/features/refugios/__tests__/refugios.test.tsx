import { act, renderHook, waitFor } from '@testing-library/react-native';
import { calcularDisponibilidade } from '@/features/refugios/disponibilidade';
import { useRefugios } from '@/features/refugios/hooks/use-refugios';
import { refugiosDoIdoso } from '@/features/refugios/refugio.service';
import { requisicoes, simularApi, simularResposta } from '@/test-utils/api-falsa';
import { umaPagina, umRefugio } from '@/test-utils/fabricas';
import { comQueryClient } from '@/test-utils/providers';

describe('calcularDisponibilidade', () => {
  const vagas = (capacidade: number, vagasDisponiveis: number) => calcularDisponibilidade({ capacidade, vagasDisponiveis });

  it('livre com folga', () => {
    expect(vagas(40, 40)).toEqual({ situacao: 'livre', rotulo: '40 vagas livres', ocupacao: 0 });
    expect(vagas(40, 12)).toMatchObject({ situacao: 'livre', ocupacao: 0.7 });
  });

  it('poucas vagas: até 10% da capacidade, mínimo 3', () => {
    expect(vagas(40, 4)).toMatchObject({ situacao: 'poucas', rotulo: 'Só 4 vagas' });
    expect(vagas(40, 5).situacao).toBe('livre');
    expect(vagas(10, 3).situacao).toBe('poucas');
    expect(vagas(100, 10).situacao).toBe('poucas');
    expect(vagas(100, 11).situacao).toBe('livre');
    expect(vagas(40, 1).rotulo).toBe('Última vaga');
  });

  it('sem vagas, inclusive capacidade zero', () => {
    expect(vagas(40, 0)).toEqual({ situacao: 'lotado', rotulo: 'Sem vagas', ocupacao: 1 });
    expect(vagas(0, 0).situacao).toBe('lotado');
  });
});

describe('listar refúgios do idoso', () => {
  it('envia só os filtros informados', async () => {
    simularResposta({ data: umaPagina([umRefugio()]) });
    await refugiosDoIdoso.listar({ data: '2026-11-27', ativo: true, tamanho: 10, pagina: 1, bairro: undefined });
    expect(requisicoes[0].baseURL).toBe('http://api.teste');
    expect(requisicoes[0].params).toEqual({ data: '2026-11-27', ativo: true, tamanho: 10, pagina: 1, bairro: undefined });
  });

  it('recusa resposta fora do contrato', async () => {
    simularResposta({ data: umaPagina([{ id: 1 }]) });
    await expect(refugiosDoIdoso.listar({})).rejects.toThrow();
  });
});

describe('useRefugios', () => {
  it('carrega página por página e para na última', async () => {
    simularApi((config) => {
      const pagina = Number(config.params.pagina);
      const quantidade = pagina === 3 ? 3 : 10;
      const itens = Array.from({ length: quantidade }, (_, i) => umRefugio({ id: (pagina - 1) * 10 + i + 1 }));
      return { data: umaPagina(itens, pagina, 3, 23) };
    });

    const { result } = await renderHook(() => useRefugios({ ativo: true }), { wrapper: comQueryClient().wrapper });
    await waitFor(() => expect(result.current.refugios).toHaveLength(10));
    expect(result.current.total).toBe(23);

    await act(() => result.current.fetchNextPage());
    await act(() => result.current.fetchNextPage());

    expect(result.current.refugios).toHaveLength(23);
    expect(new Set(result.current.refugios.map((refugio) => refugio.id)).size).toBe(23);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('não busca enquanto estiver desabilitado', async () => {
    simularResposta({ data: umaPagina([]) });
    await renderHook(() => useRefugios({}, { enabled: false }), { wrapper: comQueryClient().wrapper });
    expect(requisicoes).toHaveLength(0);
  });
});
