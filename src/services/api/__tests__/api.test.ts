import { api, ApiError, apiJava, setAuthToken, setOnUnauthorized } from '@/services/api';
import { requisicoes, simularErro, simularResposta, simularSemRede } from '@/test-utils/api-falsa';

async function falhar(): Promise<ApiError> {
  try {
    await api.get('/qualquer');
  } catch (erro) {
    if (erro instanceof ApiError) return erro;
  }
  throw new Error('a requisição deveria ter falhado com ApiError');
}

afterEach(() => {
  setAuthToken(null, 'net');
  setAuthToken(null, 'java');
  setOnUnauthorized(null);
});

describe('normalização de erros', () => {
  it('400 traz o primeiro erro de cada campo e usa-o como mensagem', async () => {
    simularErro(400, {
      title: 'Dados inválidos',
      errors: { dataReserva: ['A data da reserva não pode estar no passado.'] },
    });
    const erro = await falhar();
    expect(erro.status).toBe(400);
    expect(erro.fieldErrors).toEqual({ dataReserva: 'A data da reserva não pode estar no passado.' });
    expect(erro.message).toBe('A data da reserva não pode estar no passado.');
  });

  it('409 traz title e detail da API', async () => {
    simularErro(409, { title: 'Sem vaga', detail: 'Este refúgio não tem mais vagas para 27/11.' });
    const erro = await falhar();
    expect(erro.title).toBe('Sem vaga');
    expect(erro.message).toBe('Este refúgio não tem mais vagas para 27/11.');
  });

  it('429 lê o Retry-After', async () => {
    simularErro(429, { title: 'Muitas requisições' }, { 'retry-after': '42' });
    expect((await falhar()).retryAfter).toBe(42);
  });

  it('502 em HTML vira mensagem amigável', async () => {
    simularResposta({ status: 502, data: '<html>Bad Gateway</html>' });
    const erro = await falhar();
    expect(erro.status).toBe(502);
    expect(erro.message).toMatch(/^O serviço está indisponível/);
  });

  it('sem rede vira status 0', async () => {
    simularSemRede();
    const erro = await falhar();
    expect(erro.status).toBe(0);
    expect(erro.title).toBe('Sem conexão');
  });

  it('timeout tem mensagem própria', async () => {
    simularSemRede('ECONNABORTED');
    expect((await falhar()).title).toBe('O servidor demorou para responder');
  });
});

describe('sessão', () => {
  it('envia o token como Bearer', async () => {
    simularResposta({ data: {} });
    setAuthToken('tok123');
    await api.get('/qualquer');
    expect(requisicoes[0].headers.Authorization).toBe('Bearer tok123');
  });

  it('cada backend recebe o token que ele emitiu', async () => {
    simularResposta({ data: {} });
    setAuthToken('tok-net', 'net');
    setAuthToken('tok-java', 'java');
    await api.get('/qualquer');
    await apiJava.get('/qualquer');
    expect(requisicoes.map((r) => r.headers.Authorization)).toEqual(['Bearer tok-net', 'Bearer tok-java']);
  });

  it('401 do Java sem token do Java não derruba a sessão do .NET', async () => {
    const deslogar = jest.fn();
    setOnUnauthorized(deslogar);
    setAuthToken('tok-net', 'net');
    simularErro(401, { title: 'Não autenticado' });
    await expect(apiJava.get('/qualquer')).rejects.toBeInstanceOf(ApiError);
    expect(requisicoes[0].headers.Authorization).toBeUndefined();
    expect(deslogar).not.toHaveBeenCalled();
  });

  it('401 de requisição sem token (login errado) não derruba a sessão', async () => {
    const deslogar = jest.fn();
    setOnUnauthorized(deslogar);
    simularErro(401, { title: 'Credenciais inválidas', detail: 'E-mail ou senha incorretos.' });
    await falhar();
    expect(deslogar).not.toHaveBeenCalled();
  });

  it('401 de requisição autenticada derruba a sessão', async () => {
    const deslogar = jest.fn();
    setOnUnauthorized(deslogar);
    setAuthToken('expirado');
    simularErro(401, { title: 'Não autenticado' });
    await falhar();
    expect(deslogar).toHaveBeenCalledTimes(1);
  });
});
