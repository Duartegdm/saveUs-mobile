import { type AxiosInstance, create, isAxiosError } from 'axios';
import { toApiError } from './errors';
import { getAuthToken, notifyUnauthorized } from './session';

const TIMEOUT_PADRAO_MS = 15_000;

const urlDotNet = process.env.EXPO_PUBLIC_API_URL;
const urlJava = process.env.EXPO_PUBLIC_JAVA_API_URL;

if (!urlDotNet) {
  throw new Error('Defina EXPO_PUBLIC_API_URL no arquivo .env.');
}

export function criarCliente(baseURL: string): AxiosInstance {
  const cliente = create({ baseURL, timeout: TIMEOUT_PADRAO_MS });

  cliente.interceptors.request.use((config) => {
    const token = getAuthToken();
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

/** Backend .NET: login, área do idoso (refúgios, reservas e perfil). */
export const api = criarCliente(urlDotNet);

/** O Guia do Calor com IA só existe no backend Java. */
export const javaConfigurado = Boolean(urlJava);

/**
 * Backend Java: área do gestor e Guia do Calor. Os dois backends usam o mesmo banco, JWT e contrato,
 * então sem EXPO_PUBLIC_JAVA_API_URL o gestor continua funcionando pelo .NET.
 */
export const apiJava = urlJava ? criarCliente(urlJava) : api;
