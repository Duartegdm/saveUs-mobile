import { create, isAxiosError } from 'axios';
import { toApiError } from './errors';
import { getAuthToken, notifyUnauthorized } from './session';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error('Defina EXPO_PUBLIC_API_URL no arquivo .env.');
}

export const api = create({ baseURL, timeout: 15_000 });

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);

    const tinhaToken = isAxiosError(error) && Boolean(error.config?.headers?.Authorization);
    if (apiError.status === 401 && tinhaToken) notifyUnauthorized();

    return Promise.reject(apiError);
  },
);
