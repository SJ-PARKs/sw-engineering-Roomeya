/**
 * 인증 관련 Request DTOs
 */

export interface SignInRequest {
    email: string;
    password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordSubmitRequest {
    email: string;
    code: string;
    newPassword: string;
}

