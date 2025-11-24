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

/**
 * S3 presigned URL 응답
 */
export interface UploadUrlResponse {
    uploadUrl: string; // S3 presigned URL
    fileKey: string; // S3에 저장될 파일 키
    expiresIn?: number; // URL 만료 시간 (초)
}

