import { comInicialMinuscula } from './texto';

export type DataApi = string;

const OFFSET_SAO_PAULO_MS = -3 * 60 * 60 * 1000;
const UM_DIA_MS = 24 * 60 * 60 * 1000;

const DIAS_DA_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DIAS_DA_SEMANA_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

const DATA_API_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

function paraUtc(data: DataApi): Date {
  const partes = DATA_API_REGEX.exec(data);
  if (!partes) throw new Error(`Data fora do formato yyyy-MM-dd: "${data}"`);

  const [, ano, mes, dia] = partes;
  return new Date(Date.UTC(Number(ano), Number(mes) - 1, Number(dia)));
}

function deUtc(data: Date): DataApi {
  return data.toISOString().slice(0, 10);
}

export function paraDataApi(instante: Date): DataApi {
  return deUtc(new Date(instante.getTime() + OFFSET_SAO_PAULO_MS));
}

export function hojeEmSaoPaulo(): DataApi {
  return paraDataApi(new Date());
}

export function adicionarDias(data: DataApi, dias: number): DataApi {
  return deUtc(new Date(paraUtc(data).getTime() + dias * UM_DIA_MS));
}

export function formatarDataLonga(data: DataApi): string {
  const utc = paraUtc(data);
  return `${DIAS_DA_SEMANA[utc.getUTCDay()]}, ${utc.getUTCDate()} de ${MESES[utc.getUTCMonth()]}`;
}

export function formatarRotuloDoDia(data: DataApi, hoje: DataApi = hojeEmSaoPaulo()): string {
  if (data === hoje) return 'Hoje';
  if (data === adicionarDias(hoje, 1)) return 'Amanhã';

  const utc = paraUtc(data);
  return `${DIAS_DA_SEMANA_CURTOS[utc.getUTCDay()]}, ${utc.getUTCDate()}`;
}

export function formatarDiaNaFrase(data: DataApi, hoje: DataApi = hojeEmSaoPaulo()): string {
  const rotulo = comInicialMinuscula(formatarRotuloDoDia(data, hoje));
  return data === hoje || data === adicionarDias(hoje, 1) ? rotulo : `em ${rotulo}`;
}

const doisDigitos = (valor: number) => String(valor).padStart(2, '0');

export function formatarDataCurta(data: DataApi): string {
  const utc = paraUtc(data);
  return `${doisDigitos(utc.getUTCDate())}/${doisDigitos(utc.getUTCMonth() + 1)}/${utc.getUTCFullYear()}`;
}

export function formatarDataHora(instante: string): string {
  const milissegundos = Date.parse(instante);
  if (Number.isNaN(milissegundos)) throw new Error(`Data e hora inválidas: "${instante}"`);

  const emSaoPaulo = new Date(milissegundos + OFFSET_SAO_PAULO_MS);
  const data = formatarDataCurta(deUtc(emSaoPaulo));
  return `${data} às ${doisDigitos(emSaoPaulo.getUTCHours())}:${doisDigitos(emSaoPaulo.getUTCMinutes())}`;
}

export function formatarHora(hora: string): string {
  const [horas, minutos] = hora.split(':');
  const h = Number(horas);
  return minutos === '00' ? `${h}h` : `${h}h${minutos}`;
}
