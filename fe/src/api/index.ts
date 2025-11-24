/**
 * API 모듈 통합 export
 */

// 설정
export { default as Amplify } from './config/amplify';
export { getJwtToken } from './config/api';

// Axios 클라이언트
export { apiClient, default as axiosInstance } from './config/axios';

// 인증
export {
    signIn,
    signOut,
    getCurrentUser,
    checkAuthSession,
    forgotPassword,
    forgotPasswordSubmit,
} from './auth';

// 관리자 API
export {
    getSurveys,
    getSurvey,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    publishSurvey,
    addStudentToSurvey,
    removeStudentFromSurvey,
    getSurveyStudents,
    getSurveyResponses,
    getStudentResponse,
    runMatching,
    getMatchingResults,
    deleteMatchingResults,
} from './admin';

// 타입은 types 폴더에서 import
export type * from '../types';

