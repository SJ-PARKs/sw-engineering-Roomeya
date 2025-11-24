import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { ApiError, ApiResponse } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

/**
 * Axios Instance 생성
 */
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor: JWT 토큰 자동 추가
 */
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const session = await fetchAuthSession();
            const jwtToken = session.tokens?.idToken?.toString();

            if (jwtToken && config.headers) {
                config.headers.Authorization = `Bearer ${jwtToken}`;
            }
        } catch (error) {
            // 로그인하지 않은 상태일 수 있음 (일부 API는 인증 불필요)
            console.log('인증 토큰을 가져올 수 없습니다:', error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor: 에러 처리 및 응답 변환
 */
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // 성공 응답은 그대로 반환
        return response;
    },
    (error) => {
        // 에러 응답 처리
        const apiError: ApiError = {
            message: error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.',
            code: error.response?.data?.code,
            statusCode: error.response?.status,
        };

        // 401 Unauthorized - 인증 필요
        if (error.response?.status === 401) {
            apiError.message = '인증이 필요합니다. 로그인해주세요.';
            apiError.code = 'UNAUTHORIZED';
        }

        // 403 Forbidden - 권한 없음
        if (error.response?.status === 403) {
            apiError.message = '접근 권한이 없습니다.';
            apiError.code = 'FORBIDDEN';
        }

        // 404 Not Found
        if (error.response?.status === 404) {
            apiError.message = '요청한 리소스를 찾을 수 없습니다.';
            apiError.code = 'NOT_FOUND';
        }

        // 500 Internal Server Error
        if (error.response?.status >= 500) {
            apiError.message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            apiError.code = 'SERVER_ERROR';
        }

        return Promise.reject({
            error: apiError,
        });
    }
);

/**
 * API 요청 래퍼 함수들
 */
export const apiClient = {
    /**
     * GET 요청
     */
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await axiosInstance.get<T>(url, config);
            return { data: response.data };
        } catch (error: unknown) {
            // interceptor에서 처리된 에러는 { error: ApiError } 형태
            if (error && typeof error === 'object' && 'error' in error) {
                return error as ApiResponse<T>;
            }
            // 예상치 못한 에러
            return {
                error: {
                    message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
                    code: 'UNKNOWN_ERROR',
                },
            };
        }
    },

    /**
     * POST 요청
     */
    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await axiosInstance.post<T>(url, data, config);
            return { data: response.data };
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'error' in error) {
                return error as ApiResponse<T>;
            }
            return {
                error: {
                    message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
                    code: 'UNKNOWN_ERROR',
                },
            };
        }
    },

    /**
     * PUT 요청
     */
    async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await axiosInstance.put<T>(url, data, config);
            return { data: response.data };
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'error' in error) {
                return error as ApiResponse<T>;
            }
            return {
                error: {
                    message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
                    code: 'UNKNOWN_ERROR',
                },
            };
        }
    },

    /**
     * DELETE 요청
     */
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await axiosInstance.delete<T>(url, config);
            return { data: response.data };
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'error' in error) {
                return error as ApiResponse<T>;
            }
            return {
                error: {
                    message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
                    code: 'UNKNOWN_ERROR',
                },
            };
        }
    },

    /**
     * PATCH 요청
     */
    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await axiosInstance.patch<T>(url, data, config);
            return { data: response.data };
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'error' in error) {
                return error as ApiResponse<T>;
            }
            return {
                error: {
                    message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
                    code: 'UNKNOWN_ERROR',
                },
            };
        }
    },
};

export default axiosInstance;

