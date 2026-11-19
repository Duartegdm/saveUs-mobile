import { render, screen } from '@testing-library/react-native';
import { SeuGuiaDeHoje } from '@/features/guia-calor/components/seu-guia-de-hoje';
import { obterGuiaPersonalizado } from '@/features/guia-calor/guia.service';
import { requisicoes, simularErro, simularResposta } from '@/test-utils/api-falsa';
import { comQueryClient } from '@/test-utils/providers';
import type { GuiaDoCalor } from '@/types/guia';

const guiaComIa: GuiaDoCalor = {
  resumo: 'Amanhã o calor continua forte. Sua vaga na Biblioteca Municipal da Penha está garantida das 9h às 18h.',
  dicas: [
    { titulo: 'Saia cedo', descricao: 'Vá até o refúgio antes das 11h.' },
    { titulo: 'Leve água', descricao: 'Beba um copo a cada hora, mesmo sem sede.' },
    { titulo: 'Roupa leve', descricao: 'Use roupas claras e um chapéu no caminho.' },
  ],
  refugio: {
    id: 1,
    nome: 'Biblioteca Municipal da Penha',
    endereco: 'Rua Padre Benedito de Camargo, 400 — Penha',
    data: '2026-11-27',
    abre: '09:00',
    fecha: '18:00',
    acessivel: true,
  },
  sinaisDeAlerta: ['Tontura ou confusão'],
  emergencia: 'Se sentir algum desses sinais, ligue 192 (SAMU).',
  geradoPorIa: true,
};

describe('serviço do guia', () => {
  it('chama o refugio-service do Java com tempo maior para a IA', async () => {
    simularResposta({ data: guiaComIa });
    await obterGuiaPersonalizado();
    expect(requisicoes[0]).toMatchObject({
      baseURL: 'http://java.teste',
      method: 'post',
      url: '/api/v1/ia/guia-do-calor',
      timeout: 60_000,
    });
  });

  it('aceita o guia padrão sem reserva', async () => {
    simularResposta({ data: { ...guiaComIa, refugio: null, geradoPorIa: false } });
    await expect(obterGuiaPersonalizado()).resolves.toMatchObject({ refugio: null, geradoPorIa: false });
  });
});

describe('SeuGuiaDeHoje', () => {
  it('mostra o resumo, a reserva e as dicas geradas', async () => {
    simularResposta({ data: guiaComIa });
    await render(<SeuGuiaDeHoje />, { wrapper: comQueryClient().wrapper });

    expect(await screen.findByText(guiaComIa.resumo)).toBeOnTheScreen();
    expect(screen.getByText('Feito para você')).toBeOnTheScreen();
    expect(screen.getByText('Sexta, 27 de novembro, das 9h às 18h')).toBeOnTheScreen();
    expect(screen.getByText('Saia cedo')).toBeOnTheScreen();
  });

  it('guia padrão não diz que foi feito pela IA', async () => {
    simularResposta({ data: { ...guiaComIa, refugio: null, geradoPorIa: false } });
    await render(<SeuGuiaDeHoje />, { wrapper: comQueryClient().wrapper });

    expect(await screen.findByText(guiaComIa.resumo)).toBeOnTheScreen();
    expect(screen.queryByText('Feito para você')).not.toBeOnTheScreen();
  });

  it('se falhar, avisa e deixa tentar de novo', async () => {
    simularErro(503, { title: 'Serviço indisponível' });
    await render(<SeuGuiaDeHoje />, { wrapper: comQueryClient().wrapper });

    expect(await screen.findByText(/Não foi possível preparar seu guia agora/)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeOnTheScreen();
  });
});
