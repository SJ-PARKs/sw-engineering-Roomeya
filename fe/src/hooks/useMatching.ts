import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  runMatching,
  getMatchingResults,
  deleteMatchingResults,
} from '../api/admin';
import type { MatchingResultResponse } from '../types';

// Query Keys
export const matchingKeys = {
  all: ['matching'] as const,
  results: (surveyId: string) => [...matchingKeys.all, 'results', surveyId] as const,
};

/**
 * 매칭 실행
 */
export function useRunMatching() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (surveyId: string) => runMatching(surveyId),
    onSuccess: (_, surveyId) => {
      // 매칭 결과 캐시 무효화
      queryClient.invalidateQueries({ queryKey: matchingKeys.results(surveyId) });
    },
  });
}

/**
 * 매칭 결과 조회
 */
export function useMatchingResults(surveyId: string | null) {
  return useQuery({
    queryKey: matchingKeys.results(surveyId || ''),
    queryFn: () => getMatchingResults(surveyId!),
    enabled: !!surveyId,
  });
}

/**
 * 매칭 결과 삭제
 */
export function useDeleteMatchingResults() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (surveyId: string) => deleteMatchingResults(surveyId),
    onSuccess: (_, surveyId) => {
      // 매칭 결과 캐시 무효화
      queryClient.invalidateQueries({ queryKey: matchingKeys.results(surveyId) });
    },
  });
}

