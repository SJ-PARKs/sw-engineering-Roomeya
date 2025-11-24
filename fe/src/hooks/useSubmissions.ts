import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSurveyResponses,
  getStudentResponse,
  submitSurveyResponse,
} from '../api/admin';
import type { SurveySubmissionResponse } from '../types';

// Query Keys
export const submissionKeys = {
  all: ['submissions'] as const,
  lists: () => [...submissionKeys.all, 'list'] as const,
  list: (surveyId: string) => [...submissionKeys.lists(), surveyId] as const,
  details: () => [...submissionKeys.all, 'detail'] as const,
  detail: (surveyId: string, studentId: string) =>
    [...submissionKeys.details(), surveyId, studentId] as const,
};

/**
 * 설문 응답 목록 조회
 */
export function useSurveyResponses(surveyId: string | null) {
  return useQuery({
    queryKey: submissionKeys.list(surveyId || ''),
    queryFn: () => getSurveyResponses(surveyId!),
    enabled: !!surveyId,
  });
}

/**
 * 특정 학생의 설문 응답 조회
 */
export function useStudentResponse(surveyId: string | null, studentId: string | null) {
  return useQuery({
    queryKey: submissionKeys.detail(surveyId || '', studentId || ''),
    queryFn: () => getStudentResponse(surveyId!, studentId!),
    enabled: !!surveyId && !!studentId,
  });
}

/**
 * 설문 응답 제출
 */
export function useSubmitSurveyResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      formId,
      studentId,
      name,
      answers,
    }: {
      formId: string;
      studentId: string;
      name: string;
      answers: Record<string, unknown>;
    }) => submitSurveyResponse(formId, studentId, name, answers),
    onSuccess: (_, variables) => {
      // 해당 설문의 응답 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: submissionKeys.list(variables.formId) });
      queryClient.invalidateQueries({
        queryKey: submissionKeys.detail(variables.formId, variables.studentId),
      });
    },
  });
}

