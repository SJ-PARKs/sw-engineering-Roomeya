/**
 * 질문 관련 Request DTOs
 */

export interface CreateQuestionRequest {
    id?: string;
    type: string;
    text: string;
    options?: string[];
    required?: boolean;
}

