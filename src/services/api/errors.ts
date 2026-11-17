import { isAxiosError } from 'axios';

type ProblemDetails = {
  status?: number;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

type ApiErrorParams = {
  status: number;
  title: string;
  detail: string;
  fieldErrors?: Record<string, string>;
  retryAfter?: number | null;
};

export class ApiError extends Error {
  readonly status: number;
  readonly title: string;
  readonly fieldErrors: Record<string, string>;
  readonly retryAfter: number | null;

  constructor({ status, title, detail, fieldErrors = {}, retryAfter = null }: ApiErrorParams) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.title = title;
    this.fieldErrors = fieldErrors;
    this.retryAfter = retryAfter;
  }
}

const MENSAGEM_PADRAO_5XX = 'O serviço está indisponível no momento. Tente de novo em instantes.';
const MENSAGEM_PADRAO_4XX = 'Não foi possível concluir a operação.';

function semResposta(code: string | undefined): ApiError {
  const timeout = code === 'ECONNABORTED' || code === 'ETIMEDOUT';
  return new ApiError({
    status: 0,
    title: timeout ? 'O servidor demorou para responder' : 'Sem conexão',
    detail: timeout
      ? 'Tente de novo em alguns instantes.'
      : 'Não foi possível falar com o servidor. Verifique sua internet e tente de novo.',
  });
}

function primeiraMensagemPorCampo(errors: ProblemDetails['errors']): Record<string, string> {
  return Object.fromEntries(
    Object.entries(errors ?? {}).map(([campo, mensagens]) => [campo, mensagens[0] ?? '']),
  );
}

export function toApiError(error: unknown): ApiError {
  if (!isAxiosError(error)) {
    return new ApiError({ status: 0, title: 'Erro inesperado', detail: 'Algo deu errado. Tente de novo.' });
  }

  if (!error.response) return semResposta(error.code);

  const { status, data, headers } = error.response;
  const problema: ProblemDetails = data && typeof data === 'object' ? data : {};
  const fieldErrors = primeiraMensagemPorCampo(problema.errors);
  const retryAfter = Number(headers['retry-after']);

  return new ApiError({
    status,
    title: problema.title ?? 'Erro no servidor',
    detail:
      problema.detail ??
      Object.values(fieldErrors)[0] ??
      (status >= 500 ? MENSAGEM_PADRAO_5XX : MENSAGEM_PADRAO_4XX),
    fieldErrors,
    retryAfter: Number.isFinite(retryAfter) ? retryAfter : null,
  });
}
