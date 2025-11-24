/**
 * 학생 관련 Request DTOs
 */

export interface CreateStudentRequest {
    id: string;
    name: string;
    gender: 'M' | 'F';
}

export interface AddStudentToSurveyRequest {
    id: string;
    name: string;
    gender: 'M' | 'F';
}

export interface RemoveStudentFromSurveyRequest {
    surveyId: string;
    studentId: string;
}

