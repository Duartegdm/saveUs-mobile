import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { api } from '@/services/api';

type Resposta = { status?: number; data?: unknown; headers?: Record<string, string> };
type Responder = (config: InternalAxiosRequestConfig) => Resposta | Promise<Resposta>;

export const requisicoes: InternalAxiosRequestConfig[] = [];

function respostaHttp(config: InternalAxiosRequestConfig, { status = 200, data = {}, headers = {} }: Resposta): AxiosResponse {
  return { status, data, headers, statusText: '', config };
}

export function simularApi(responder: Responder) {
  requisicoes.length = 0;
  api.defaults.adapter = async (config) => {
    requisicoes.push(config);
    const resposta = respostaHttp(config, await responder(config));
    if (resposta.status >= 400) throw new AxiosError('erro', 'ERR_BAD_RESPONSE', config, {}, resposta);
    return resposta;
  };
}

export function simularResposta(resposta: Resposta) {
  simularApi(() => resposta);
}

export function simularErro(status: number, problema: Record<string, unknown> = {}, headers: Record<string, string> = {}) {
  simularApi(() => ({ status, data: { status, ...problema }, headers }));
}

export function simularSemRede(codigo = 'ERR_NETWORK') {
  requisicoes.length = 0;
  api.defaults.adapter = async (config) => {
    requisicoes.push(config);
    throw new AxiosError('falha de rede', codigo, config);
  };
}

export function corpoDaUltimaRequisicao(): unknown {
  const ultima = requisicoes.at(-1);
  return typeof ultima?.data === 'string' ? JSON.parse(ultima.data) : ultima?.data;
}
