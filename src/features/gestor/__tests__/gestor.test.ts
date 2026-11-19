import { consultarCep } from '@/features/gestor/cep.service';
import { FORMULARIO_VAZIO, paraFormulario, paraRequest, refugioFormSchema } from '@/features/gestor/refugio-form';
import { refugiosDoGestor } from '@/features/refugios/refugio.service';
import { corpoDaUltimaRequisicao, requisicoes, simularErro, simularResposta } from '@/test-utils/api-falsa';
import { umRefugio } from '@/test-utils/fabricas';
import { refugioRequestSchema } from '@/types/refugio';

const valido = {
  ...FORMULARIO_VAZIO,
  nome: ' Biblioteca ',
  tipo: 'BIBLIOTECA',
  cep: '03601-000',
  endereco: 'Rua A, 1',
  bairro: 'Penha',
  capacidade: '40',
};

function mensagemDoCampo(campos: Partial<typeof valido>, campo: string) {
  const resultado = refugioFormSchema.safeParse({ ...valido, ...campos });
  return resultado.error?.issues.find((issue) => issue.path[0] === campo)?.message;
}

describe('formulário do refúgio', () => {
  it('converte a capacidade em número e o resultado passa no schema da API', () => {
    const saida = refugioFormSchema.parse(valido);
    expect(saida.capacidade).toBe(40);
    expect(saida.nome).toBe('Biblioteca');
    expect(refugioRequestSchema.safeParse(saida).success).toBe(true);
  });

  it.each([
    [{ tipo: '' }, 'tipo', 'Escolha o tipo do refúgio.'],
    [{ capacidade: '' }, 'capacidade', 'Informe a capacidade.'],
    [{ capacidade: '4a' }, 'capacidade', 'Use apenas números.'],
    [{ capacidade: '0' }, 'capacidade', 'A capacidade deve ser maior que zero.'],
    [{ capacidade: '10001' }, 'capacidade', 'A capacidade deve ser de no máximo 10.000 pessoas.'],
    [{ abre: '18:00', fecha: '08:00' }, 'fecha', 'O horário de fechamento deve ser depois da abertura.'],
    [{ abre: '08:0' }, 'abre', 'Use o formato HH:mm.'],
    [{ cep: '0360' }, 'cep', 'O CEP deve ter 8 dígitos, como 03601-000.'],
  ])('%o dá erro em %s', (campos, campo, mensagem) => {
    expect(mensagemDoCampo(campos, campo)).toBe(mensagem);
  });

  it('ida e volta entre refúgio e formulário mantém os dados', () => {
    const refugio = umRefugio({ tipo: 'UBS', capacidade: 20, fecha: '17:30', ativo: false });
    expect(refugioFormSchema.parse(paraFormulario(refugio))).toEqual(paraRequest(refugio));
    expect(paraRequest(refugio)).not.toHaveProperty('id');
    expect(paraRequest(refugio)).not.toHaveProperty('vagasDisponiveis');
  });
});

describe('serviços do gestor (backend Java)', () => {
  it('cria, atualiza e exclui nas rotas certas', async () => {
    const dados = paraRequest(umRefugio());
    simularResposta({ status: 201, data: umRefugio() });
    await refugiosDoGestor.criar(dados);
    expect([requisicoes[0].baseURL, requisicoes[0].method, requisicoes[0].url]).toEqual([
      'http://java.teste',
      'post',
      '/api/v1/refugios',
    ]);

    simularResposta({ data: umRefugio({ ativo: false }) });
    await refugiosDoGestor.atualizar(5, { ...dados, ativo: false });
    expect([requisicoes[0].method, requisicoes[0].url]).toEqual(['put', '/api/v1/refugios/5']);
    expect(corpoDaUltimaRequisicao()).toMatchObject({ ativo: false });
  });

  it('excluir refúgio com reservas futuras devolve o 409 com a orientação da API', async () => {
    simularErro(409, {
      title: 'Refúgio com reservas',
      detail: 'Este refúgio tem reservas ativas para hoje ou datas futuras. Desative-o em vez de excluir.',
    });
    await expect(refugiosDoGestor.excluir(5)).rejects.toMatchObject({ status: 409, title: 'Refúgio com reservas' });
  });

  it('consulta o CEP só com os dígitos', async () => {
    simularResposta({
      data: {
        cep: '03601-000',
        endereco: 'Rua Padre Benedito de Camargo',
        bairro: 'Penha',
        cidade: 'São Paulo',
        uf: 'SP',
      },
    });
    const endereco = await consultarCep('03601-000');
    expect([requisicoes[0].baseURL, requisicoes[0].url]).toEqual(['http://java.teste', '/api/v1/cep/03601000']);
    expect(endereco.bairro).toBe('Penha');
  });
});
