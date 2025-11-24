/**
 * 공통 Response DTOs
 */

export interface ApiError {
    message: string;
    code?: string;
    statusCode?: number;
}

export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
}

export interface SuccessResponse {
    success: boolean;
    message?: string;
}

