import { paraFormulario } from '@/features/perfil/hooks/use-formulario-do-perfil';
import { atualizarPerfil, obterPerfil } from '@/features/perfil/perfil.service';
import { corpoDaUltimaRequisicao, requisicoes, simularResposta } from '@/test-utils/api-falsa';
import { umUsuario } from '@/test-utils/fabricas';
import { atualizarUsuarioRequestSchema } from '@/types/usuario';

it('perfil com campos nulos vira formulário com textos vazios', () => {
  expect(paraFormulario(umUsuario({ bairro: null, contatoEmergenciaNome: null }))).toMatchObject({
    bairro: '',
    contatoEmergenciaNome: '',
  });
});

it('salvar envia null explícito nos campos vazios', async () => {
  const dados = atualizarUsuarioRequestSchema.parse({
    ...paraFormulario(umUsuario({ contatoEmergenciaNome: null })),
    bairro: 'Penha',
  });
  simularResposta({ data: umUsuario() });
  await atualizarPerfil(dados);

  expect([requisicoes[0].method, requisicoes[0].url]).toEqual(['put', '/api/v1/usuarios/me']);
  expect(corpoDaUltimaRequisicao()).toMatchObject({ contatoEmergenciaNome: null, bairro: 'Penha' });
});

it('obterPerfil valida a resposta', async () => {
  simularResposta({ data: umUsuario() });
  await expect(obterPerfil()).resolves.toMatchObject({ email: 'maria@email.com' });
});
