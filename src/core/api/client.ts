import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../storage/tokenStorage';

/**
 * Determina la URL base de la API según variables de entorno o el host actual del navegador.
 */
export const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:5125/api`;
  }
  
  return 'http://localhost:5125/api';
};

/**
 * Instancia centralizada de Axios para la plataforma Firmeza.
 */
export const httpClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Interceptor de Petición:
 * Inyecta el Token JWT en el encabezado Authorization de forma automática si existe sesión activa.
 */
httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!config.baseURL || config.baseURL.includes('localhost:5125')) {
      config.baseURL = getApiBaseUrl();
    }
    const token = await tokenStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Respuesta:
 * Manejo centralizado de códigos de estado HTTP (401 sesión expirada, 403, 500).
 */
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Sesión expirada o no autorizada (401). Limpiando credenciales locales...');
      await tokenStorage.clearSession();
    }

    const backendMessage =
      (error.response?.data as { message?: string; title?: string })?.message ||
      (error.response?.data as { title?: string })?.title ||
      error.message;

    (error as any).friendlyMessage = backendMessage;
    return Promise.reject(error);
  }
);

export default httpClient;
