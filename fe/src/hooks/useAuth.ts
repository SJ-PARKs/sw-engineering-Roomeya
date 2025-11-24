import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  signIn,
  signOut,
  getCurrentUser,
  checkAuthSession,
  forgotPassword,
  forgotPasswordSubmit,
  signUpAdmin,
  confirmSignUpAdmin,
} from '../api/auth';
import type { CognitoUser } from '../types';

/**
 * 로그인
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: () => {
      // 인증 상태 변경 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

/**
 * 로그아웃
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // 모든 쿼리 캐시 클리어
      queryClient.clear();
    },
  });
}

/**
 * 현재 사용자 정보 조회
 */
export function useCurrentUser() {
  return useMutation({
    mutationFn: getCurrentUser,
  });
}

/**
 * 세션 확인
 */
export function useCheckAuthSession() {
  return useMutation({
    mutationFn: checkAuthSession,
  });
}

/**
 * 비밀번호 찾기 (인증 코드 이메일 발송)
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}

/**
 * 비밀번호 찾기 (코드와 새 비밀번호로 변경)
 */
export function useForgotPasswordSubmit() {
  return useMutation({
    mutationFn: ({ email, code, newPassword }: { email: string; code: string; newPassword: string }) =>
      forgotPasswordSubmit(email, code, newPassword),
  });
}

/**
 * 관리자 회원가입
 */
export function useSignUpAdmin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signUpAdmin(email, password),
  });
}

/**
 * 이메일 인증 코드 확인
 */
export function useConfirmSignUpAdmin() {
  return useMutation({
    mutationFn: ({ email, confirmationCode }: { email: string; confirmationCode: string }) =>
      confirmSignUpAdmin(email, confirmationCode),
  });
}

