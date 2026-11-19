import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import GestorRefugiosScreen from '@/app/gestor/index';
import { descreverResultado } from '@/features/gestor/hooks/use-filtros-do-gestor';
import { requisicoes, simularApi } from '@/test-utils/api-falsa';
import { umaPagina, umRefugio } from '@/test-utils/fabricas';
import { comAutenticacao } from '@/test-utils/providers';
import { adicionarDias, formatarDataLonga, hojeEmSaoPaulo } from '@/utils/date';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

describe('descreverResultado', () => {
  it.each([
    [5, 'todos', null, '5 refúgios cadastrados'],
    [1, 'todos', null, '1 refúgio cadastrado'],
    [3, 'ativos', 'Penha', '3 refúgios recebendo reservas em Penha'],
    [1, 'pausados', null, '1 refúgio pausado'],
    [2, 'pausados', 'Mooca', '2 refúgios pausados em Mooca'],
  ] as const)('%i, %s, %s → %s', (total, situacao, bairro, esperado) => {
    expect(descreverResultado(total, situacao, bairro)).toBe(esperado);
  });
});

describe('filtros da lista do gestor', () => {
  const ultimosParametros = () => requisicoes.filter((r) => r.url === '/api/v1/refugios').at(-1)?.params;

  beforeEach(() => {
    simularApi((config) => {
      if (config.url !== '/api/v1/refugios') return { data: {} };
      const vazio = config.params.bairro === 'Nenhum';
      return { data: umaPagina(vazio ? [] : [umRefugio()]) };
    });
  });

  async function abrir() {
    await render(<GestorRefugiosScreen />, { wrapper: comAutenticacao().wrapper });
    await screen.findByText('Biblioteca Municipal da Penha');
  }

  it('começa mostrando todos, sem filtro', async () => {
    await abrir();
    expect(ultimosParametros()).toMatchObject({ ativo: undefined, bairro: undefined, data: hojeEmSaoPaulo() });
    expect(screen.getByText('Vagas hoje')).toBeOnTheScreen();
    expect(screen.getByRole('tab', { name: 'Todos os refúgios' })).toBeSelected();
  });

  it('"Pausados" pede ao Java só os refúgios inativos', async () => {
    await abrir();
    await fireEvent.press(screen.getByRole('tab', { name: 'Reservas pausadas' }));
    await waitFor(() => expect(ultimosParametros()).toMatchObject({ ativo: false }));
    expect(requisicoes.at(-1)?.baseURL).toBe('http://java.teste');
  });

  it('escolher amanhã pede ao Java as vagas daquele dia', async () => {
    const amanha = adicionarDias(hojeEmSaoPaulo(), 1);
    await abrir();
    await fireEvent.press(screen.getByRole('tab', { name: formatarDataLonga(amanha) }));

    await waitFor(() => expect(ultimosParametros()).toMatchObject({ data: amanha }));
    expect(await screen.findByText('Vagas amanhã')).toBeOnTheScreen();
    expect(screen.getByLabelText(`12 de 40 vagas livres para ${formatarDataLonga(amanha).toLowerCase()}`)).toBeOnTheScreen();
  });

  it('filtra por bairro e, sem resultado, permite limpar os filtros', async () => {
    await abrir();
    await fireEvent.press(screen.getByRole('button', { name: 'Alterar bairro' }));
    await fireEvent.changeText(screen.getByLabelText('Bairro'), 'Nenhum');
    await fireEvent.press(screen.getByRole('button', { name: 'Ver refúgios deste bairro' }));

    await waitFor(() => expect(ultimosParametros()).toMatchObject({ bairro: 'Nenhum' }));
    await fireEvent.press(await screen.findByRole('button', { name: 'Limpar filtros' }));
    await waitFor(() => expect(ultimosParametros()).toMatchObject({ ativo: undefined, bairro: undefined }));
  });
});
