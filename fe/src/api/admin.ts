import { apiGet, apiPost, apiPut, apiDelete } from './config/api';
import { apiClient } from './config/axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import type {
    SurveyResponse,
    SurveySubmissionResponse,
    MatchingResultResponse,
    SurveyStudentResponse,
    CreateSurveyRequest,
    UpdateSurveyRequest,
    AddStudentToSurveyRequest,
    GetUploadUrlRequest,
    UploadUrlResponse,
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

/**
 * 학생 목록 엑셀 업로드를 위한 S3 presigned URL 요청
 * @param fileName 업로드할 파일명 (예: 'students.xlsx')
 * @param fileType 파일 MIME 타입 (선택사항, 기본값: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
 * @returns S3 presigned URL과 파일 키
 */
export async function getStudentUploadUrl(
    fileName: string,
    fileType?: string
): Promise<UploadUrlResponse | null> {
    // 인증 토큰 가져오기
    let jwtToken: string | null = null;
    try {
        const session = await fetchAuthSession();
        jwtToken = session.tokens?.idToken?.toString() || null;

        if (!jwtToken) {
            console.error('인증 토큰이 없습니다. 로그인이 필요합니다.');
            return null;
        }
    } catch (error) {
        console.error('인증 토큰을 가져올 수 없습니다:', error);
        return null;
    }

    const request: GetUploadUrlRequest = {
        fileName,
        fileType: fileType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    // 명시적으로 인증 헤더를 포함하여 요청
    const response = await apiClient.post<UploadUrlResponse>(
        '/admin/students/upload-url',
        request,
        {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (response.error) {
        console.error('업로드 URL 요청 실패:', response.error);
        // 인증 관련 에러인지 확인
        if (response.error.statusCode === 401 || response.error.code === 'UNAUTHORIZED') {
            console.error('인증이 필요합니다. 로그인해주세요.');
        }
        return null;
    }

    return response.data || null;
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

