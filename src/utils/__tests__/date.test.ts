import {
  adicionarDias,
  formatarDataCurta,
  formatarDataHora,
  formatarDataLonga,
  formatarHora,
  formatarRotuloDoDia,
  hojeEmSaoPaulo,
  paraDataApi,
} from '@/utils/date';

describe('paraDataApi', () => {
  it('ainda é o mesmo dia às 23:59 em São Paulo', () => {
    expect(paraDataApi(new Date('2026-11-17T02:59:59Z'))).toBe('2026-11-16');
  });

  it('já é o dia seguinte à 00:00 em São Paulo', () => {
    expect(paraDataApi(new Date('2026-11-17T03:00:00Z'))).toBe('2026-11-17');
  });

  it('vira o ano pelo horário de São Paulo', () => {
    expect(paraDataApi(new Date('2027-01-01T02:00:00Z'))).toBe('2026-12-31');
  });
});

it('hojeEmSaoPaulo devolve o formato da API', () => {
  expect(hojeEmSaoPaulo()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

describe('adicionarDias', () => {
  it.each([
    ['2026-11-30', 1, '2026-12-01'],
    ['2026-12-31', 1, '2027-01-01'],
    ['2028-02-28', 1, '2028-02-29'],
    ['2027-02-28', 1, '2027-03-01'],
    ['2026-03-01', -1, '2026-02-28'],
    ['2026-11-10', 0, '2026-11-10'],
  ])('%s + %i = %s', (data, dias, esperado) => {
    expect(adicionarDias(data, dias)).toBe(esperado);
  });

  it('recusa data fora do formato com mensagem clara', () => {
    expect(() => adicionarDias('10/11/2026', 1)).toThrow('yyyy-MM-dd');
  });
});

describe('formatação', () => {
  it('data longa', () => {
    expect(formatarDataLonga('2026-11-10')).toBe('Terça, 10 de novembro');
    expect(formatarDataLonga('2026-03-07')).toBe('Sábado, 7 de março');
  });

  it('rótulo do dia', () => {
    expect(formatarRotuloDoDia('2026-11-12', '2026-11-12')).toBe('Hoje');
    expect(formatarRotuloDoDia('2026-11-13', '2026-11-12')).toBe('Amanhã');
    expect(formatarRotuloDoDia('2026-11-14', '2026-11-12')).toBe('Sáb, 14');
    expect(formatarRotuloDoDia('2026-12-01', '2026-11-30')).toBe('Amanhã');
  });

  it.each([
    ['09:00', '9h'],
    ['09:30', '9h30'],
    ['00:00', '0h'],
    ['18:00', '18h'],
  ])('hora %s vira %s', (hora, esperado) => {
    expect(formatarHora(hora)).toBe(esperado);
  });

  it('data curta', () => {
    expect(formatarDataCurta('2026-11-27')).toBe('27/11/2026');
    expect(formatarDataCurta('2027-01-05')).toBe('05/01/2027');
  });

  it.each([
    ['2026-11-16T08:32:11-03:00', '16/11/2026 às 08:32'],
    ['2026-11-16T11:32:11Z', '16/11/2026 às 08:32'],
    ['2026-11-17T02:05:00Z', '16/11/2026 às 23:05'],
    ['2027-01-01T01:00:00+00:00', '31/12/2026 às 22:00'],
  ])('data e hora %s em São Paulo é %s', (instante, esperado) => {
    expect(formatarDataHora(instante)).toBe(esperado);
  });

  it('recusa data e hora inválidas', () => {
    expect(() => formatarDataHora('lixo')).toThrow('inválidas');
  });
});
