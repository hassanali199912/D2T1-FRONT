
import type { AxiosRequestConfig } from 'axios';

export interface HttpClient {
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
    getWithParams<T = unknown>(url: string, params: Record<string, unknown>): Promise<T>;
    postFormData<T = unknown>(url: string, formData: FormData): Promise<T>;
}