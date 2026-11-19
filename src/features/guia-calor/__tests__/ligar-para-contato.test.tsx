import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert, Linking } from 'react-native';
import { LigarParaContato } from '@/features/guia-calor/components/ligar-para-contato';
import { simularResposta } from '@/test-utils/api-falsa';
import { umUsuario } from '@/test-utils/fabricas';
import { comQueryClient } from '@/test-utils/providers';
import { ligarPara } from '@/utils/ligar';

jest.mock('expo-router', () => ({ router: { navigate: jest.fn() } }));

const { router } = jest.requireMock<{ router: { navigate: jest.Mock } }>('expo-router');
const abrirUrl = jest.spyOn(Linking, 'openURL');

beforeEach(() => {
  jest.clearAllMocks();
  abrirUrl.mockResolvedValue(undefined);
});

describe('ligarPara', () => {
  it('disca só os dígitos', async () => {
    ligarPara('(11) 97777-0000');
    expect(abrirUrl).toHaveBeenCalledWith('tel:11977770000');
  });

  it('avisa quando o aparelho não consegue ligar', async () => {
    const alerta = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    abrirUrl.mockRejectedValue(new Error('sem discador'));
    ligarPara('192');
    await waitFor(() => expect(alerta).toHaveBeenCalledWith('Não foi possível ligar', 'Disque 192 no seu telefone.'));
  });
});

describe('LigarParaContato', () => {
  async function abrir() {
    await render(<LigarParaContato />, { wrapper: comQueryClient().wrapper });
  }

  it('com contato cadastrado, mostra quem é e liga para o número', async () => {
    simularResposta({ data: umUsuario() });
    await abrir();

    expect(await screen.findByText(/João Souza \(filho\), \(11\) 97777-0000/)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Ligar para meu contato' }));
    expect(abrirUrl).toHaveBeenCalledWith('tel:11977770000');
  });

  it('sem contato, leva ao Perfil para cadastrar', async () => {
    simularResposta({ data: umUsuario({ contatoEmergenciaNome: null, contatoEmergenciaTelefone: null }) });
    await abrir();

    await fireEvent.press(await screen.findByRole('button', { name: 'Cadastrar contato' }));
    expect(router.navigate).toHaveBeenCalledWith('/perfil');
  });

  it('contato sem nome usa um texto genérico', async () => {
    simularResposta({ data: umUsuario({ contatoEmergenciaNome: null }) });
    await abrir();
    expect(await screen.findByText(/seu contato de emergência, \(11\) 97777-0000/)).toBeOnTheScreen();
  });

  it('não mostra nada enquanto o perfil carrega', async () => {
    simularResposta({ data: umUsuario() });
    await abrir();
    expect(screen.queryByRole('button', { name: 'Ligar para meu contato' })).not.toBeOnTheScreen();
  });
});
