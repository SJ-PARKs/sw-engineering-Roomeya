/**
 * 공통 타입 정의
 */

// 설문 상태
export type SurveyStatus = 'draft' | 'published' | 'closed';

// 성별
export type Gender = 'M' | 'F';

// 질문 타입
export type QuestionType =
    | 'text'
    | 'number'
    | 'select'
    | 'multiple'
    | 'radio'
    | 'checkbox'
    | 'textarea';

