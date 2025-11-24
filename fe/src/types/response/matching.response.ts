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

