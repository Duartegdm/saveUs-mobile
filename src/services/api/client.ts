import { type AxiosInstance, create, isAxiosError } from 'axios';
import { toApiError } from './errors';
import { type Backend, getAuthToken, notifyUnauthorized } from './session';

function urlObrigatoria(nome: string, valor: string | undefined) {
  if (!valor) throw new Error(`Defina ${nome} no arquivo .env.`);
  return valor;
}

function criarCliente(baseURL: string, backend: Backend): AxiosInstance {
  const cliente = create({ baseURL, timeout: 15_000 });

  cliente.interceptors.request.use((config) => {
    const token = getAuthToken(backend);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  cliente.interceptors.response.use(
    (response) => response,
    (error) => {
      const apiError = toApiError(error);

      const tinhaToken = isAxiosError(error) && Boolean(error.config?.headers?.Authorization);
      if (apiError.status === 401 && tinhaToken) notifyUnauthorized();

      return Promise.reject(apiError);
    },
  );

  return cliente;
}

export const api = criarCliente(urlObrigatoria('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL), 'net');
export const apiJava = criarCliente(
  urlObrigatoria('EXPO_PUBLIC_JAVA_API_URL', process.env.EXPO_PUBLIC_JAVA_API_URL),
  'java',
);
