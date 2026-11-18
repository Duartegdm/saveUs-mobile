import type { Refugio } from '@/types/refugio';
import type { Reserva } from '@/types/reserva';
import type { Usuario } from '@/types/usuario';

export function umRefugio(campos: Partial<Refugio> = {}): Refugio {
  return {
    id: 1,
    nome: 'Biblioteca Municipal da Penha',
    tipo: 'BIBLIOTECA',
    cep: '03601-000',
    endereco: 'Rua Padre Benedito de Camargo, 400',
    bairro: 'Penha',
    capacidade: 40,
    vagasDisponiveis: 12,
    abre: '09:00',
    fecha: '18:00',
    acessivel: true,
    ativo: true,
    ...campos,
  };
}

export function umaReserva(campos: Partial<Reserva> = {}): Reserva {
  return {
    id: 100,
    refugioId: 1,
    refugioNome: 'Biblioteca Municipal da Penha',
    refugioEndereco: 'Rua Padre Benedito de Camargo, 400 — Penha',
    dataReserva: '2026-11-27',
    status: 'ATIVA',
    criadoEm: '2026-11-16T08:32:11-03:00',
    ...campos,
  };
}

export function umUsuario(campos: Partial<Usuario> = {}): Usuario {
  return {
    id: 2,
    nome: 'Maria Souza',
    email: 'maria@email.com',
    papel: 'IDOSO',
    bairro: 'Penha',
    telefone: '(11) 98888-0000',
    contatoEmergenciaNome: 'João Souza (filho)',
    contatoEmergenciaTelefone: '(11) 97777-0000',
    ...campos,
  };
}

export function umaPagina<T>(itens: T[], pagina = 1, totalPaginas = 1, totalItens = itens.length) {
  return { itens, pagina, tamanho: 10, totalItens, totalPaginas };
}
