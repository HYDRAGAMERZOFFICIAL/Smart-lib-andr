import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';

import { API_CONFIG, STORAGE_KEYS } from '@constants/index';
import { ApiError } from '@types/index';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.instance.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
              const response = await this.instance.post('/auth/refresh-token', {
                refresh_token: refreshToken,
              });
              const newToken = response.data.data.token;
              await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data, config);
  }

  delete<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }
}

export const apiClient = new ApiClient();

export const handleApiError = (error: AxiosError): ApiError => {
  if (!error.response) {
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      code: 'NETWORK_ERROR',
    };
  }

  const data = error.response.data as any;
  return {
    message: data?.message || error.message,
    status: error.response.status,
    code: data?.code,
    errors: data?.errors,
  };
};
