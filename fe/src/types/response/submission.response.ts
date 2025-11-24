/**
 * 설문 응답 관련 Response DTOs
 */

export interface SurveySubmissionResponse {
    surveyId: string;
    studentId: string;
    answers: Record<string, unknown>;
    submittedAt: string;
}

export interface SurveySubmissionListResponse {
    submissions: SurveySubmissionResponse[];
    total: number;
}

export interface SurveySubmissionDetailResponse extends SurveySubmissionResponse { }

