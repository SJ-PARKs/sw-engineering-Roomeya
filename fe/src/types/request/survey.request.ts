/**
 * 설문 관련 Request DTOs
 */

import type { CreateStudentRequest } from './student.request';
import type { CreateQuestionRequest } from './question.request';

/**
 * 설문 참여자 (서버 API 형식)
 */
export interface SurveyParticipant {
    studentId: string;
    name: string;
    gender: '남' | '여';
}

/**
 * 설문 필드 (서버 API 형식)
 */
export interface SurveyField {
    id: string;
    title: string;
    type: 'multiple-choice' | 'boolean' | 'text';
    options?: string[];
}

/**
 * 설문 생성 요청 (서버 API 형식)
 */
export interface CreateSurveyRequest {
    title: string;
    deadline: string; // ISO 형식: "2025-11-17T23:59:59"
    participants: SurveyParticipant[];
    fields: SurveyField[];
}

/**
 * 기존 설문 생성 요청 (로컬 사용)
 */
export interface CreateSurveyRequestLegacy {
    id?: string; // 설문 ID (프론트엔드에서 생성한 난수)
    title: string;
    description?: string;
    deadline?: string; // 마감일
    status?: 'draft' | 'published' | 'closed';
    students?: CreateStudentRequest[];
    questions?: CreateQuestionRequest[];
}

export interface UpdateSurveyRequest {
    title?: string;
    description?: string;
    status?: 'draft' | 'published' | 'closed';
    students?: CreateStudentRequest[];
    questions?: CreateQuestionRequest[];
}

export interface PublishSurveyRequest {
    surveyId: string;
}

