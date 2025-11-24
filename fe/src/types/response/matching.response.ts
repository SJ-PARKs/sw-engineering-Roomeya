/**
 * 매칭 관련 Response DTOs
 */

export interface MatchingPairResponse {
    student1: string;
    student2: string;
    score: number;
}

export interface MatchingResultResponse {
    surveyId: string;
    pairs: MatchingPairResponse[];
    createdAt: string;
    totalPairs: number;
}

/**
 * 매칭 결과 응답 (새 형식)
 */
export interface MatchingResultItemResponse {
    roomId: string;
    score: number;
    memberA: string;
    memberB: string;
}

