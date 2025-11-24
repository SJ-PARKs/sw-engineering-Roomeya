/**
 * API 클라이언트 (axios 기반)
 * 
 * @deprecated 이 파일은 axios.ts로 통합되었습니다.
 * 새로운 코드는 apiClient를 직접 사용하거나 axios.ts에서 import하세요.
 */

import { apiClient } from './axios';
import type { ApiResponse } from '../../types';

/**
 * GET 요청
 * @deprecated apiClient.get()을 직접 사용하세요.
 */
export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
    return apiClient.get<T>(endpoint);
}

/**
 * POST 요청
 * @deprecated apiClient.post()을 직접 사용하세요.
 */
export async function apiPost<T>(
    endpoint: string,
    body?: unknown
): Promise<ApiResponse<T>> {
    return apiClient.post<T>(endpoint, body);
}

/**
 * PUT 요청
 * @deprecated apiClient.put()을 직접 사용하세요.
 */
export async function apiPut<T>(
    endpoint: string,
    body?: unknown
): Promise<ApiResponse<T>> {
    return apiClient.put<T>(endpoint, body);
}

/**
 * DELETE 요청
 * @deprecated apiClient.delete()을 직접 사용하세요.
 */
export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return apiClient.delete<T>(endpoint);
}

/**
 * JWT 토큰을 가져옵니다.
 * @deprecated axios interceptor에서 자동 처리됩니다.
 */
export async function getJwtToken(): Promise<string | null> {
    try {
        const { fetchAuthSession } = await import('aws-amplify/auth');
        const session = await fetchAuthSession();
        const jwtToken = session.tokens?.idToken?.toString();
        return jwtToken || null;
    } catch (error) {
        console.log('로그인 상태가 아님:', error);
        return null;
    }
}

