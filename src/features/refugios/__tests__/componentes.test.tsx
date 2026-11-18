import { fireEvent, render, screen } from '@testing-library/react-native';
import { FiltroData } from '@/features/refugios/components/filtro-data';
import { PainelDeVagas } from '@/features/refugios/components/painel-de-vagas';
import { RefugioCard } from '@/features/refugios/components/refugio-card';
import { ReservaCard } from '@/features/reservas/components/reserva-card';
import { umaReserva, umRefugio } from '@/test-utils/fabricas';

describe('FiltroData', () => {
  it('marca o dia selecionado e avisa a troca', async () => {
    const onSelecionar = jest.fn();
    await render(
      <FiltroData
        hoje="2026-11-17"
        datas={['2026-11-17', '2026-11-18', '2026-11-19']}
        selecionada="2026-11-17"
        onSelecionar={onSelecionar}
      />,
    );

    expect(screen.getByRole('tab', { name: 'Terça, 17 de novembro' })).toBeSelected();
    expect(screen.getByText('Amanhã')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('tab', { name: 'Quinta, 19 de novembro' }));
    expect(onSelecionar).toHaveBeenCalledWith('2026-11-19');
  });
});

describe('RefugioCard', () => {
  it('mostra horário, acessibilidade e vagas', async () => {
    await render(<RefugioCard refugio={umRefugio()} onVerDetalhes={jest.fn()} />);
    expect(screen.getByText('Aberto das 9h às 18h')).toBeOnTheScreen();
    expect(screen.getByText('Acessível')).toBeOnTheScreen();
    expect(screen.getByText('12 vagas livres')).toBeOnTheScreen();
  });

  it('lotado mostra o texto, não só a cor', async () => {
    await render(<RefugioCard refugio={umRefugio({ vagasDisponiveis: 0 })} onVerDetalhes={jest.fn()} />);
    expect(screen.getByText('Sem vagas')).toBeOnTheScreen();
  });
});

describe('PainelDeVagas', () => {
  it('mostra vagas e quantas pessoas reservaram', async () => {
    await render(<PainelDeVagas refugio={umRefugio()} data="2026-11-27" />);
    expect(screen.getByLabelText('12 de 40 vagas livres para sexta, 27 de novembro')).toBeOnTheScreen();
    expect(screen.getByText('28 pessoas já reservaram')).toBeOnTheScreen();
  });

  it('refúgio inativo aparece como fechado', async () => {
    await render(<PainelDeVagas refugio={umRefugio({ ativo: false, vagasDisponiveis: 0 })} data="2026-11-27" />);
    expect(screen.getByText('Refúgio fechado')).toBeOnTheScreen();
  });
});

describe('ReservaCard', () => {
  it('cada botão diz de qual refúgio está falando', async () => {
    const onCancelar = jest.fn();
    const onVerComprovante = jest.fn();
    await render(
      <ReservaCard
        reserva={umaReserva({ dataReserva: '2026-11-17' })}
        hoje="2026-11-17"
        onCancelar={onCancelar}
        onVerComprovante={onVerComprovante}
      />,
    );

    expect(screen.getByText('Hoje')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Cancelar a reserva em Biblioteca Municipal da Penha' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Ver comprovante da reserva em Biblioteca Municipal da Penha' }));
    expect(onCancelar).toHaveBeenCalled();
    expect(onVerComprovante).toHaveBeenCalled();
  });
});
