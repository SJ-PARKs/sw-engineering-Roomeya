/**
 * 인증 관련 Response DTOs
 */

export interface SignInResponse {
    user: CognitoUser;
    accessToken: string;
    idToken: string;
    refreshToken: string;
}

export interface CognitoUser {
    username: string;
    email?: string;
    attributes?: Record<string, string>;
}

