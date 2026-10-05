// src/api/apiClient.ts
import axiosInstance from './apis';
import type { AxiosRequestConfig } from 'axios';
import type { HttpClient } from './httpClient';

class ApiClient implements HttpClient {
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const res = await axiosInstance.get(url, config);
        return res.data;
    }

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const res = await axiosInstance.post(url, data, config);
        return res.data;
    }

    async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const res = await axiosInstance.put(url, data, config);
        return res.data;
    }

    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const res = await axiosInstance.patch(url, data, config);
        return res.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const res = await axiosInstance.delete(url, config);
        return res.data;
    }

    async getWithParams<T>(url: string, params: Record<string, unknown>): Promise<T> {
        const res = await axiosInstance.get(url, { params });
        return res.data;
    }

    async postFormData<T>(url: string, formData: FormData): Promise<T> {
        const res = await axiosInstance.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    }
}

export const api: HttpClient = new ApiClient();