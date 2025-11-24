/**
 * 설문 관련 Request DTOs
 */

import type { CreateStudentRequest } from './student.request';
import type { CreateQuestionRequest } from './question.request';

export interface CreateSurveyRequest {
    title: string;
    description?: string;
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

