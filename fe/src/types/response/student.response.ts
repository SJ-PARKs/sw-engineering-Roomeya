/**
 * 학생 관련 Response DTOs
 */

export interface SurveyStudentResponse {
    id: string;
    name: string;
    gender: 'M' | 'F';
}

export interface StudentListResponse {
    students: SurveyStudentResponse[];
    total: number;
}

