import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  private handleError(error: AxiosError): ApiError {
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
  }

  get<T = any>(url: string, config?: any) {
    return this.instance.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.instance.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.instance.put<T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: any) {
    return this.instance.patch<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: any) {
    return this.instance.delete<T>(url, config);
  }
}

export const apiService = new ApiService();
