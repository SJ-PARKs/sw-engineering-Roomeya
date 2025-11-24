import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSurveys,
  getSurvey,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  publishSurvey,
} from '../api/admin';
import type {
  SurveyResponse,
  CreateSurveyRequest,
  UpdateSurveyRequest,
} from '../types';

// Query Keys
export const surveyKeys = {
  all: ['surveys'] as const,
  lists: () => [...surveyKeys.all, 'list'] as const,
  list: (filters: string) => [...surveyKeys.lists(), { filters }] as const,
  details: () => [...surveyKeys.all, 'detail'] as const,
  detail: (id: string) => [...surveyKeys.details(), id] as const,
};

/**
 * 모든 설문 목록 조회
 */
export function useSurveys() {
  return useQuery({
    queryKey: surveyKeys.lists(),
    queryFn: getSurveys,
  });
}

/**
 * 특정 설문 조회
 */
export function useSurvey(surveyId: string | null) {
  return useQuery({
    queryKey: surveyKeys.detail(surveyId || ''),
    queryFn: () => getSurvey(surveyId!),
    enabled: !!surveyId,
  });
}

/**
 * 설문 생성
 */
export function useCreateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (survey: CreateSurveyRequest) => createSurvey(survey),
    onSuccess: () => {
      // 설문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
    },
  });
}

/**
 * 설문 수정
 */
export function useUpdateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ surveyId, survey }: { surveyId: string; survey: UpdateSurveyRequest }) =>
      updateSurvey(surveyId, survey),
    onSuccess: (_, variables) => {
      // 설문 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(variables.surveyId) });
    },
  });
}

/**
 * 설문 삭제
 */
export function useDeleteSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (surveyId: string) => deleteSurvey(surveyId),
    onSuccess: () => {
      // 설문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
    },
  });
}

/**
 * 설문 배포/발행
 */
export function usePublishSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (surveyId: string) => publishSurvey(surveyId),
    onSuccess: (_, surveyId) => {
      // 설문 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(surveyId) });
    },
  });
}

