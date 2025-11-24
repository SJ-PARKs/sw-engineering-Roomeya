import { apiGet, apiPost, apiPut, apiDelete } from './config/api';
import { apiClient } from './config/axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import type {
    SurveyResponse,
    SurveySubmissionResponse,
    MatchingResultResponse,
    MatchingResultItemResponse,
    SurveyStudentResponse,
    CreateSurveyRequest,
    UpdateSurveyRequest,
    AddStudentToSurveyRequest,
    GetUploadUrlRequest,
    UploadUrlResponse,
    SuccessResponse,
    SurveyListWithStatsResponse,
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
        // 404 오류인 경우 더 명확한 메시지 출력
        if (response.error.statusCode === 404) {
            console.error('⚠️ GET /admin/forms 엔드포인트가 서버에 존재하지 않습니다.');
            console.error('서버에 GET /admin/forms 엔드포인트를 구현했는지 확인해주세요.');
        }
        // CORS 오류인 경우
        if (response.error.code === 'ERR_NETWORK' || response.error.message?.includes('CORS')) {
            console.error('⚠️ CORS 오류가 발생했습니다. 서버에서 CORS 헤더를 설정했는지 확인해주세요.');
        }
        return [];
    }
    return response.data || [];
}

/**
 * 설문 목록 조회 (통계 정보 포함)
 * @returns 설문 목록과 참여자 통계 정보
 */
export async function getSurveysWithStats(): Promise<SurveyListWithStatsResponse[]> {
    const response = await apiGet<SurveyListWithStatsResponse[]>('/admin/forms');
    if (response.error) {
        console.error('설문 목록 조회 실패:', response.error);
        // 404 오류인 경우 더 명확한 메시지 출력
        if (response.error.statusCode === 404) {
            console.error('⚠️ GET /admin/forms 엔드포인트가 서버에 존재하지 않습니다.');
            console.error('서버에 GET /admin/forms 엔드포인트를 구현했는지 확인해주세요.');
        }
        // CORS 오류인 경우
        if (response.error.code === 'ERR_NETWORK' || response.error.message?.includes('CORS')) {
            console.error('⚠️ CORS 오류가 발생했습니다. 서버에서 CORS 헤더를 설정했는지 확인해주세요.');
        }
        return [];
    }
    return response.data || [];
}

/**
 * 매칭 실행 결과 조회 (설문 목록과 통계 정보 포함)
 * @returns 매칭이 실행된 설문 목록과 참여자 통계 정보
 */
export async function getMatchingResultsWithStats(): Promise<SurveyListWithStatsResponse[]> {
    // 인증 토큰 가져오기
    let jwtToken: string | null = null;
    try {
        const session = await fetchAuthSession();
        jwtToken = session.tokens?.idToken?.toString() || null;

        if (!jwtToken) {
            console.error('인증 토큰이 없습니다. 로그인이 필요합니다.');
            return [];
        }
    } catch (error) {
        console.error('인증 토큰을 가져올 수 없습니다:', error);
        return [];
    }

    // 명시적으로 인증 헤더를 포함하여 요청
    const response = await apiClient.get<SurveyListWithStatsResponse[]>(
        '/admin/forms',
        {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (response.error) {
        console.error('매칭 실행 결과 조회 실패:', response.error);
        // 404 오류인 경우 더 명확한 메시지 출력
        if (response.error.statusCode === 404) {
            console.error('⚠️ GET /admin/forms 엔드포인트가 서버에 존재하지 않습니다.');
            console.error('서버에 GET /admin/forms 엔드포인트를 구현했는지 확인해주세요.');
        }
        // CORS 오류인 경우
        if (response.error.code === 'ERR_NETWORK' || response.error.message?.includes('CORS')) {
            console.error('⚠️ CORS 오류가 발생했습니다. 서버에서 CORS 헤더를 설정했는지 확인해주세요.');
        }
        // 인증 관련 에러인지 확인
        if (response.error.statusCode === 401 || response.error.code === 'UNAUTHORIZED') {
            console.error('인증이 필요합니다. 로그인해주세요.');
        }
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
 * 학생 인증 (학번과 이름으로 실존하는 학생인지 확인)
 */
export async function identifyStudent(
    studentId: string,
    name: string
): Promise<{ isValid: boolean; student?: SurveyStudentResponse }> {
    const response = await apiPost<{ isValid: boolean; student?: SurveyStudentResponse }>(
        '/student/identify',
        {
            studentId,
            name,
        }
    );
    if (response.error) {
        console.error('학생 인증 실패:', response.error);
        return { isValid: false };
    }
    return response.data || { isValid: false };
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

/**
 * 설문 응답 제출 (학생용)
 */
export async function submitSurveyResponse(
    formId: string,
    studentId: string,
    name: string,
    answers: Record<string, unknown>
): Promise<SurveySubmissionResponse | null> {
    const response = await apiPost<SurveySubmissionResponse>(
        '/student/submit',
        {
            formId,
            studentId,
            name,
            answers,
        }
    );
    console.log("response", response);
    if (response.error) {
        console.error('설문 응답 제출 실패:', response.error);
        return null;
    }
    return response.data || null;
}

// ========== 매칭 관리 ==========

/**
 * 매칭 실행
 */
export async function runMatching(formId: string): Promise<MatchingResultResponse | null> {
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

    // 명시적으로 인증 헤더를 포함하여 요청
    const response = await apiClient.post<MatchingResultResponse>(
        '/admin/matching/start',
        {
            formId,
        },
        {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (response.error) {
        console.error('매칭 실행 실패:', response.error);
        // 인증 관련 에러인지 확인
        if (response.error.statusCode === 401 || response.error.code === 'UNAUTHORIZED') {
            console.error('인증이 필요합니다. 로그인해주세요.');
        }
        return null;
    }
    return response.data || null;
}

/**
 * 매칭 결과 조회
 */
export async function getMatchingResults(
    formId: string
): Promise<MatchingResultItemResponse[]> {
    // 인증 토큰 가져오기
    let jwtToken: string | null = null;
    try {
        const session = await fetchAuthSession();
        jwtToken = session.tokens?.idToken?.toString() || null;

        if (!jwtToken) {
            console.error('인증 토큰이 없습니다. 로그인이 필요합니다.');
            return [];
        }
    } catch (error) {
        console.error('인증 토큰을 가져올 수 없습니다:', error);
        return [];
    }

    // 명시적으로 인증 헤더를 포함하여 요청
    const response = await apiClient.get<MatchingResultItemResponse[]>(
        `/matching/result/${formId}`,
        {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (response.error) {
        console.error('매칭 결과 조회 실패:', response.error);
        // 인증 관련 에러인지 확인
        if (response.error.statusCode === 401 || response.error.code === 'UNAUTHORIZED') {
            console.error('인증이 필요합니다. 로그인해주세요.');
        }
        return [];
    }
    return response.data || [];
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

