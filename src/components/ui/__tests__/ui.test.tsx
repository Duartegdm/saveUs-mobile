import { fireEvent, render, screen } from '@testing-library/react-native';
import { Ticket } from 'lucide-react-native';
import { EstadoDaLista } from '@/components/estado-da-lista';
import { Button, Input } from '@/components/ui';

describe('Button', () => {
  it('dispara o toque', async () => {
    const onPress = jest.fn();
    await render(<Button label="Entrar" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('desabilitado não dispara e anuncia o estado', async () => {
    const onPress = jest.fn();
    await render(<Button label="Entrar" disabled onPress={onPress} />);
    const botao = screen.getByRole('button', { name: 'Entrar' });
    expect(botao).toBeDisabled();
    await fireEvent.press(botao);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('carregando fica ocupado e não dispara', async () => {
    const onPress = jest.fn();
    await render(<Button label="Entrar" loading onPress={onPress} />);
    const botao = screen.getByRole('button', { name: 'Entrar' });
    expect(botao).toBeBusy();
    await fireEvent.press(botao);
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('Input', () => {
  it('mostra o erro e anuncia que é obrigatório', async () => {
    await render(<Input label="E-mail" required error="Informe o e-mail." value="" onChangeText={jest.fn()} />);
    expect(screen.getByLabelText('E-mail, obrigatório')).toBeOnTheScreen();
    expect(screen.getByText('Informe o e-mail.')).toBeOnTheScreen();
  });

  it('esconde só o texto do erro com hideErrorMessage', async () => {
    await render(<Input label="Senha" error="Fraca" hideErrorMessage value="" onChangeText={jest.fn()} />);
    expect(screen.queryByText('Fraca')).not.toBeOnTheScreen();
  });

  it('alterna mostrar e ocultar senha', async () => {
    await render(<Input label="Senha" password value="abc" onChangeText={jest.fn()} />);
    expect(screen.getByLabelText('Senha')).toHaveProp('secureTextEntry', true);

    await fireEvent.press(screen.getByRole('button', { name: 'Mostrar senha' }));
    expect(screen.getByLabelText('Senha')).toHaveProp('secureTextEntry', false);
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toBeOnTheScreen();
  });
});

describe('EstadoDaLista', () => {
  it('erro oferece tentar de novo', async () => {
    const tentar = jest.fn();
    await render(<EstadoDaLista tipo="erro" mensagem="Sem conexão" onTentarDeNovo={tentar} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(tentar).toHaveBeenCalled();
  });

  it('vazio mostra a ação', async () => {
    const acao = jest.fn();
    await render(
      <EstadoDaLista
        tipo="vazio"
        icone={Ticket}
        titulo="Nenhuma reserva ativa"
        mensagem="..."
        acao={{ rotulo: 'Encontrar um refúgio', onPress: acao }}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Encontrar um refúgio' }));
    expect(acao).toHaveBeenCalled();
  });
});
