import { apiGet, apiPost, apiPut, apiDelete } from './config/api';
import type {
    SurveyResponse,
    SurveySubmissionResponse,
    MatchingResultResponse,
    SurveyStudentResponse,
    CreateSurveyRequest,
    UpdateSurveyRequest,
    AddStudentToSurveyRequest,
    SuccessResponse,
} from '../types';

/**
 * 관리자 API 함수들
 */

// ========== 설문 관리 ==========

/**
 * 모든 설문 목록 조회
 */
export async function getSurveys(): Promise<SurveyResponse[]> {
    const response = await apiGet<SurveyResponse[]>('/admin/forms');
    if (response.error) {
        console.error('설문 목록 조회 실패:', response.error);
        return [];
    }
    return response.data || [];
}

/**
 * 특정 설문 조회
 */
export async function getSurvey(surveyId: string): Promise<SurveyResponse | null> {
    const response = await apiGet<SurveyResponse>(`/admin/forms/${surveyId}`);
    if (response.error) {
        console.error('설문 조회 실패:', response.error);
        return null;
    }
    return response.data || null;
}

/**
 * 새 설문 생성
 */
export async function createSurvey(
    survey: CreateSurveyRequest
): Promise<SurveyResponse | null> {
    const response = await apiPost<SurveyResponse>('/admin/forms', survey);
    if (response.error) {
        console.error('설문 생성 실패:', response.error);
        return null;
    }
    return response.data || null;
}

/**
 * 설문 수정
 */
export async function updateSurvey(
    surveyId: string,
    survey: UpdateSurveyRequest
): Promise<SurveyResponse | null> {
    const response = await apiPut<SurveyResponse>(`/admin/forms/${surveyId}`, survey);
    if (response.error) {
        console.error('설문 수정 실패:', response.error);
        return null;
    }
    return response.data || null;
}

/**
 * 설문 삭제
 */
export async function deleteSurvey(surveyId: string): Promise<boolean> {
    const response = await apiDelete<SuccessResponse>(`/admin/forms/${surveyId}`);
    if (response.error) {
        console.error('설문 삭제 실패:', response.error);
        return false;
    }
    return response.data?.success || false;
}

/**
 * 설문 배포/발행
 */
export async function publishSurvey(surveyId: string): Promise<SurveyResponse | null> {
    const response = await apiPost<SurveyResponse>(`/admin/forms/${surveyId}/publish`);
    if (response.error) {
        console.error('설문 배포 실패:', response.error);
        return null;
    }
    return response.data || null;
}

// ========== 학생 관리 ==========

/**
 * 설문에 학생 추가
 */
export async function addStudentToSurvey(
    surveyId: string,
    student: AddStudentToSurveyRequest
): Promise<boolean> {
    const response = await apiPost<SuccessResponse>(
        `/admin/forms/${surveyId}/students`,
        student
    );
    if (response.error) {
        console.error('학생 추가 실패:', response.error);
        return false;
    }
    return response.data?.success || false;
}

/**
 * 설문에서 학생 삭제
 */
export async function removeStudentFromSurvey(
    surveyId: string,
    studentId: string
): Promise<boolean> {
    const response = await apiDelete<SuccessResponse>(
        `/admin/forms/${surveyId}/students/${studentId}`
    );
    if (response.error) {
        console.error('학생 삭제 실패:', response.error);
        return false;
    }
    return response.data?.success || false;
}

/**
 * 설문의 학생 목록 조회
 */
export async function getSurveyStudents(surveyId: string): Promise<SurveyStudentResponse[]> {
    const response = await apiGet<SurveyStudentResponse[]>(
        `/admin/forms/${surveyId}/students`
    );
    if (response.error) {
        console.error('학생 목록 조회 실패:', response.error);
        return [];
    }
    return response.data || [];
}

// ========== 설문 응답 관리 ==========

/**
 * 설문 응답 목록 조회
 */
export async function getSurveyResponses(
    surveyId: string
): Promise<SurveySubmissionResponse[]> {
    const response = await apiGet<SurveySubmissionResponse[]>(
        `/admin/forms/${surveyId}/responses`
    );
    if (response.error) {
        console.error('응답 목록 조회 실패:', response.error);
        return [];
    }
    return response.data || [];
}

/**
 * 특정 학생의 설문 응답 조회
 */
export async function getStudentResponse(
    surveyId: string,
    studentId: string
): Promise<SurveySubmissionResponse | null> {
    const response = await apiGet<SurveySubmissionResponse>(
        `/admin/forms/${surveyId}/responses/${studentId}`
    );
    if (response.error) {
        console.error('응답 조회 실패:', response.error);
        return null;
    }
    return response.data || null;
}

// ========== 매칭 관리 ==========

/**
 * 매칭 실행
 */
export async function runMatching(surveyId: string): Promise<MatchingResultResponse | null> {
    const response = await apiPost<MatchingResultResponse>(
        `/admin/forms/${surveyId}/matching`
    );
    if (response.error) {
        console.error('매칭 실행 실패:', response.error);
        return null;
    }
    return response.data || null;
}

/**
 * 매칭 결과 조회
 */
export async function getMatchingResults(
    surveyId: string
): Promise<MatchingResultResponse | null> {
    const response = await apiGet<MatchingResultResponse>(
        `/admin/forms/${surveyId}/matching`
    );
    if (response.error) {
        console.error('매칭 결과 조회 실패:', response.error);
        return null;
    }
    return response.data || null;
}

/**
 * 매칭 결과 삭제
 */
export async function deleteMatchingResults(surveyId: string): Promise<boolean> {
    const response = await apiDelete<SuccessResponse>(
        `/admin/forms/${surveyId}/matching`
    );
    if (response.error) {
        console.error('매칭 결과 삭제 실패:', response.error);
        return false;
    }
    return response.data?.success || false;
}

