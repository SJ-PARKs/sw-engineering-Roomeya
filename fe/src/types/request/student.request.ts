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

/**
 * S3 presigned URL 요청
 */
export interface GetUploadUrlRequest {
    fileName: string;
    fileType?: string; // MIME type (예: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
}

