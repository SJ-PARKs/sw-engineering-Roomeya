/**
 * 설문 응답 관련 Request DTOs
 */

export interface CreateSurveyResponseRequest {
    surveyId: string;
    studentId: string;
    answers: Record<string, unknown>;
}

