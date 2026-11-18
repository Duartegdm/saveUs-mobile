import { umaPagina, umaReserva, umRefugio, umUsuario } from '@/test-utils/fabricas';
import { cadastroFormSchema, loginResponseSchema, REGRAS_SENHA, registrarRequestSchema } from '@/types/auth';
import { paginaRefugioSchema, refugioRequestSchema, refugioSchema } from '@/types/refugio';
import { reservaSchema } from '@/types/reserva';
import { atualizarUsuarioRequestSchema, usuarioSchema } from '@/types/usuario';

const mensagensDe = (resultado: { success: boolean; error?: { issues: { message: string }[] } }) =>
  resultado.error?.issues.map((issue) => issue.message) ?? [];

describe('respostas da API', () => {
  it('aceita os objetos no formato dos DTOs', () => {
    expect(refugioSchema.safeParse(umRefugio()).success).toBe(true);
    expect(paginaRefugioSchema.safeParse(umaPagina([umRefugio()])).success).toBe(true);
    expect(reservaSchema.safeParse(umaReserva()).success).toBe(true);
    expect(usuarioSchema.safeParse(umUsuario({ bairro: null, telefone: null })).success).toBe(true);
    expect(
      loginResponseSchema.safeParse({ token: 'x', expiraEm: '2026-11-16T20:00:00Z', usuario: umUsuario() }).success,
    ).toBe(true);
  });

  it('recusa enum fora do contrato', () => {
    expect(refugioSchema.safeParse({ ...umRefugio(), tipo: 'Biblioteca' }).success).toBe(false);
  });
});

describe('senha do cadastro (mesma regra do backend)', () => {
  const cadastro = (senha: string) => registrarRequestSchema.safeParse({ nome: 'Ana', email: 'ana@email.com', senha });

  it('aceita Senha@123', () => {
    expect(cadastro('Senha@123').success).toBe(true);
  });

  it('lista cada regra que falta', () => {
    expect(mensagensDe(cadastro('abc'))).toEqual([
      'A senha deve ter entre 8 e 100 caracteres.',
      'A senha deve ter uma letra maiúscula.',
      'A senha deve ter um número.',
    ]);
  });

  it('recusa mais de 100 caracteres', () => {
    expect(cadastro(`Aa1${'x'.repeat(98)}`).success).toBe(false);
  });

  it('a checklist da tela usa as mesmas 4 regras', () => {
    expect(REGRAS_SENHA).toHaveLength(4);
    expect(REGRAS_SENHA.every((regra) => regra.atende('Senha123'))).toBe(true);
  });

  it('confirmação diferente marca o campo confirmarSenha', () => {
    const resultado = cadastroFormSchema.safeParse({
      nome: 'Ana',
      email: 'ana@email.com',
      senha: 'Senha123',
      confirmarSenha: 'Senha124',
    });
    expect(resultado.error?.issues[0]).toMatchObject({ path: ['confirmarSenha'], message: 'As senhas não conferem.' });
  });
});

describe('perfil', () => {
  it('campos opcionais vazios viram null e o bairro recebe trim', () => {
    const saida = atualizarUsuarioRequestSchema.parse({
      nome: 'Maria',
      bairro: '  Penha ',
      telefone: '',
      contatoEmergenciaNome: 'João',
      contatoEmergenciaTelefone: '',
    });
    expect(saida).toEqual({
      nome: 'Maria',
      bairro: 'Penha',
      telefone: null,
      contatoEmergenciaNome: 'João',
      contatoEmergenciaTelefone: null,
    });
  });

  it('recusa telefone inválido', () => {
    const resultado = atualizarUsuarioRequestSchema.safeParse({
      nome: 'Maria',
      bairro: '',
      telefone: 'abc',
      contatoEmergenciaNome: '',
      contatoEmergenciaTelefone: '',
    });
    expect(resultado.success).toBe(false);
  });
});

it('refúgio: fechamento antes da abertura aponta o campo fecha', () => {
  const { id: _id, vagasDisponiveis: _vagas, ...campos } = umRefugio();
  const resultado = refugioRequestSchema.safeParse({ ...campos, abre: '20:00', fecha: '08:00' });
  expect(resultado.error?.issues[0].path).toEqual(['fecha']);
});
