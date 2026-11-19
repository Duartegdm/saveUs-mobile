// Cada backend assina o próprio JWT, então cada cliente envia o token que o seu backend emitiu.
export type Backend = 'net' | 'java';

const tokens: Record<Backend, string | null> = { net: null, java: null };
let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null, backend: Backend = 'net') {
  tokens[backend] = token;
}

export function getAuthToken(backend: Backend = 'net') {
  return tokens[backend];
}

export function setOnUnauthorized(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized() {
  unauthorizedHandler?.();
}
