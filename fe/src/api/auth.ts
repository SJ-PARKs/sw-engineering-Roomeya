import { signIn as amplifySignIn, signOut as amplifySignOut, getCurrentUser as amplifyGetCurrentUser, fetchAuthSession, resetPassword, confirmResetPassword, signUp, confirmSignUp } from 'aws-amplify/auth';
import type { CognitoUser } from '../types';


/**
 * 이메일과 비밀번호로 로그인
 */
export async function signIn(
    email: string,
    password: string
): Promise<{ user: CognitoUser | null; error: string | null }> {
    try {
        await amplifySignIn({ username: email, password });

        // 로그인 성공 후 사용자 정보 가져오기
        const user = await amplifyGetCurrentUser();
        const session = await fetchAuthSession();

        return {
            user: {
                username: user.username,
                email: session.tokens?.idToken?.payload?.email as string | undefined,
                attributes: {},
            },
            error: null,
        };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : '로그인에 실패했습니다.';
        console.error('로그인 실패:', error);
        return { user: null, error: errorMessage };
    }
}

/**
 * 로그아웃
 */
export async function signOut(): Promise<void> {
    try {
        await amplifySignOut();
    } catch (error) {
        console.error('로그아웃 실패:', error);
        throw error;
    }
}

/**
 * 현재 로그인된 사용자 정보 가져오기
 */
export async function getCurrentUser(): Promise<CognitoUser | null> {
    try {
        const user = await amplifyGetCurrentUser();
        const session = await fetchAuthSession();

        return {
            username: user.username,
            email: session.tokens?.idToken?.payload?.email as string | undefined,
            attributes: {},
        };
    } catch (error) {
        console.log('로그인 상태가 아님:', error);
        return null;
    }
}

/**
 * 현재 세션 확인
 */
export async function checkAuthSession(): Promise<boolean> {
    try {
        const session = await fetchAuthSession();
        return session.tokens !== undefined;
    } catch {
        return false;
    }
}

/**
 * 비밀번호 찾기 - 1단계: 인증 코드 이메일 발송
 */
export async function forgotPassword(email: string): Promise<{ error: string | null }> {
    try {
        await resetPassword({ username: email });
        return { error: null };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : '비밀번호 찾기 요청에 실패했습니다.';
        console.error('비밀번호 찾기 실패:', error);
        return { error: errorMessage };
    }
}

/**
 * 비밀번호 찾기 - 2단계: 코드와 새 비밀번호로 변경 완료
 */
export async function forgotPasswordSubmit(
    email: string,
    code: string,
    newPassword: string
): Promise<{ error: string | null }> {
    try {
        await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
        return { error: null };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.';
        console.error('비밀번호 변경 실패:', error);
        return { error: errorMessage };
    }
}

/**
 * 관리자 회원가입
 */
export async function signUpAdmin(
    email: string,
    password: string
): Promise<{ userId: string | null; error: string | null }> {
    try {
        const { userId, nextStep } = await signUp({
            username: email,
            password,
            options: {
                userAttributes: {
                    email: email,
                },
            },
        });

        // 회원가입 성공 시 userId 반환 (이메일 인증 필요)
        return { userId, error: null };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : '회원가입에 실패했습니다.';
        console.error('회원가입 실패:', error);
        return { userId: null, error: errorMessage };
    }
}

/**
 * 이메일 인증 코드 확인
 */
export async function confirmSignUpAdmin(
    email: string,
    confirmationCode: string
): Promise<{ error: string | null }> {
    try {
        await confirmSignUp({
            username: email,
            confirmationCode,
        });
        return { error: null };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : '인증 코드 확인에 실패했습니다.';
        console.error('인증 코드 확인 실패:', error);
        return { error: errorMessage };
    }
}

