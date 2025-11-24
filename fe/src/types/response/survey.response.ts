/**
 * 설문 관련 Response DTOs
 */

import type { SurveyStudentResponse } from './student.response';
import type { QuestionResponse } from './question.response';

export interface SurveyResponse {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    updatedAt?: string;
    status?: 'draft' | 'published' | 'closed';
    students?: SurveyStudentResponse[];
    questions?: QuestionResponse[];
}

export interface SurveyListResponse {
    surveys: SurveyResponse[];
    total: number;
}

export interface SurveyDetailResponse extends SurveyResponse { }

/**
 * 설문 목록 조회 응답 (통계 정보 포함)
 */
export interface SurveyListWithStatsResponse {
    formId: string;
    title: string;
    deadline: string;
    createdAt: string;
    totalParticipants: number;
    completedCount: number;
    notCompletedCount: number;
}

