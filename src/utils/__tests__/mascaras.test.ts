import { cepCompleto, mascararCep, mascararHora, mascararTelefone } from '@/utils/mascaras';

const regexDeTelefoneDoBackend = /^[0-9()+\-\s]{8,20}$/;

describe('mascararTelefone', () => {
  it.each([
    ['', ''],
    ['11', '(11'],
    ['119876', '(11) 9876'],
    ['1198765', '(11) 9876-5'],
    ['1132654321', '(11) 3265-4321'],
    ['11987654321', '(11) 98765-4321'],
    ['(11) 9a8765-4321!', '(11) 98765-4321'],
    ['119876543219999', '(11) 98765-4321'],
    ['(11) 98765-4321', '(11) 98765-4321'],
  ])('%s vira %s', (texto, esperado) => {
    expect(mascararTelefone(texto)).toBe(esperado);
  });

  it('backspace no fim continua apagando', () => {
    expect(mascararTelefone('(11) 9876-')).toBe('(11) 9876');
  });

  it('o resultado passa na validação do backend', () => {
    expect(mascararTelefone('11987654321')).toMatch(regexDeTelefoneDoBackend);
    expect(mascararTelefone('1132654321')).toMatch(regexDeTelefoneDoBackend);
  });
});

describe('mascararCep', () => {
  it.each([
    ['0360', '0360'],
    ['03601000', '03601-000'],
    ['03601-000', '03601-000'],
    ['036010009', '03601-000'],
  ])('%s vira %s', (texto, esperado) => {
    expect(mascararCep(texto)).toBe(esperado);
  });

  it('cepCompleto exige 8 dígitos', () => {
    expect(cepCompleto('03601-000')).toBe(true);
    expect(cepCompleto('0360100')).toBe(false);
  });
});

describe('mascararHora', () => {
  it.each([
    ['8', '8'],
    ['080', '08:0'],
    ['0830', '08:30'],
    ['083045', '08:30'],
  ])('%s vira %s', (texto, esperado) => {
    expect(mascararHora(texto)).toBe(esperado);
  });
});
