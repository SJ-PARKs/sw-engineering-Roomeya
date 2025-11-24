/**
 * 질문 관련 Response DTOs
 */

export interface QuestionResponse {
    id: string;
    type: string;
    text: string;
    options?: string[];
    required?: boolean;
}

export interface QuestionListResponse {
    questions: QuestionResponse[];
    total: number;
}

