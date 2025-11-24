import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSurveyStudents,
  addStudentToSurvey,
  removeStudentFromSurvey,
  getStudentUploadUrl,
  identifyStudent,
} from '../api/admin';
import type {
  SurveyStudentResponse,
  AddStudentToSurveyRequest,
} from '../types';

// Query Keys
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (surveyId: string) => [...studentKeys.lists(), surveyId] as const,
};

/**
 * 설문의 학생 목록 조회
 */
export function useSurveyStudents(surveyId: string | null) {
  return useQuery({
    queryKey: studentKeys.list(surveyId || ''),
    queryFn: () => getSurveyStudents(surveyId!),
    enabled: !!surveyId,
  });
}

/**
 * 설문에 학생 추가
 */
export function useAddStudentToSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ surveyId, student }: { surveyId: string; student: AddStudentToSurveyRequest }) =>
      addStudentToSurvey(surveyId, student),
    onSuccess: (_, variables) => {
      // 해당 설문의 학생 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: studentKeys.list(variables.surveyId) });
      // 설문 상세 정보도 업데이트될 수 있으므로 무효화
      queryClient.invalidateQueries({ queryKey: ['surveys', 'detail', variables.surveyId] });
    },
  });
}

/**
 * 설문에서 학생 삭제
 */
export function useRemoveStudentFromSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ surveyId, studentId }: { surveyId: string; studentId: string }) =>
      removeStudentFromSurvey(surveyId, studentId),
    onSuccess: (_, variables) => {
      // 해당 설문의 학생 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: studentKeys.list(variables.surveyId) });
      // 설문 상세 정보도 업데이트될 수 있으므로 무효화
      queryClient.invalidateQueries({ queryKey: ['surveys', 'detail', variables.surveyId] });
    },
  });
}

/**
 * 학생 목록 엑셀 업로드를 위한 S3 presigned URL 요청
 */
export function useGetStudentUploadUrl() {
  return useMutation({
    mutationFn: ({ fileName, fileType }: { fileName: string; fileType?: string }) =>
      getStudentUploadUrl(fileName, fileType),
  });
}

/**
 * 학생 인증 (학번과 이름으로 실존하는 학생인지 확인)
 */
export function useIdentifyStudent() {
  return useMutation({
    mutationFn: ({ studentId, name }: { studentId: string; name: string }) =>
      identifyStudent(studentId, name),
  });
}

