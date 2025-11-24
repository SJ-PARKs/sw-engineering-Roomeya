import { useState, useEffect } from "react";
import AdminLayout from "../components/common/AdminLayout";
import ResultsSurveySelector from "../components/Results/ResultsSurveySelector";
import SummaryCards from "../components/Results/SummaryCards";
import ResultsTable from "../components/Results/ResultsTable";
import Pagination from "../components/common/Pagination";
import "../styles/common.css";
import "../styles/results.css";
import "../styles/dashboard.css";

interface Survey {
  id: number;
  title: string;
  deadline: string;
  status: "active" | "inactive";
}

interface MatchResult {
  id: number;
  roomNumber: string;
  studentA: string;
  studentB: string;
  matchScore: number;
}

interface MatchedPair {
  studentA: string;
  studentAId: string;
  studentB: string;
  studentBId: string;
  score: number;
}

export default function Results() {
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);

  // 설문 목록 가져오기 (매칭 결과가 있는 설문만)
  const getSurveysWithResults = (): Survey[] => {
    const stored = localStorage.getItem("surveys");
    if (!stored) return [];

    try {
      const allSurveys: Survey[] = JSON.parse(stored);
      // 매칭 결과가 있는 설문만 필터링
      return allSurveys.filter((survey) => {
        const matchingResults = localStorage.getItem(
          `matchingResults_${survey.id}`
        );
        return matchingResults !== null;
      });
    } catch {
      return [];
    }
  };

  // 선택한 설문의 매칭 결과 가져오기
  const getMatchingResults = (surveyId: number): MatchResult[] => {
    const stored = localStorage.getItem(`matchingResults_${surveyId}`);
    if (!stored) return [];

    try {
      const matchedPairs: MatchedPair[] = JSON.parse(stored);
      return matchedPairs.map((pair, index) => ({
        id: index + 1,
        roomNumber: `A${String(index + 1).padStart(3, "0")}`,
        studentA: `${pair.studentAId} ${pair.studentA}`,
        studentB: `${pair.studentBId} ${pair.studentB}`,
        matchScore: pair.score,
      }));
    } catch {
      return [];
    }
  };

  // 설문 목록 로드
  useEffect(() => {
    const surveysWithResults = getSurveysWithResults();
    setSurveys(surveysWithResults);

    // URL 파라미터에서 설문 ID 가져오기 (선택사항)
    const urlParams = new URLSearchParams(window.location.search);
    const surveyIdParam = urlParams.get("surveyId");
    if (surveyIdParam) {
      const surveyId = parseInt(surveyIdParam, 10);
      if (!isNaN(surveyId)) {
        setSelectedSurveyId(surveyId);
      }
    }
  }, []);

  // 선택한 설문이 변경되면 결과 업데이트
  useEffect(() => {
    if (selectedSurveyId) {
      const matchingResults = getMatchingResults(selectedSurveyId);
      setResults(matchingResults);
    } else {
      setResults([]);
    }
  }, [selectedSurveyId]);

  const handleEditMatch = (matchId: number) => {
    alert(`매칭 ${matchId} 수정 기능 (구현 예정)`);
  };

  const handleDownloadResults = () => {
    if (!selectedSurveyId) {
      alert("먼저 설문을 선택해주세요.");
      return;
    }
    alert("엑셀 다운로드 기능 (구현 예정)");
  };

  // 통계 계산
  const totalMatched = results.length * 2;
  const successfulPairs = results.length;
  const successRate =
    totalMatched > 0
      ? Math.round((successfulPairs / (totalMatched / 2)) * 100)
      : 0;
  const unmatched = 0; // 실제로는 전체 학생 수에서 매칭된 학생 수를 빼야 함

  return (
    <AdminLayout>
      <div className="page-title">매칭 결과 검토</div>

      <div className="matching-info-section">
        <ResultsSurveySelector
          surveys={surveys}
          selectedSurveyId={selectedSurveyId}
          onSelectChange={setSelectedSurveyId}
        />
      </div>

      {selectedSurveyId && results.length > 0 && (
        <>
          <SummaryCards
            totalMatched={totalMatched}
            successfulPairs={successfulPairs}
            successRate={successRate}
            unmatched={unmatched}
          />

          <div className="results-actions">
            <button
              className="btn-success"
              id="download-results"
              onClick={handleDownloadResults}
            >
              엑셀로 결과 다운로드
            </button>
          </div>

          <ResultsTable results={results} onEdit={handleEditMatch} />

          <Pagination />
        </>
      )}

      {selectedSurveyId && results.length === 0 && (
        <div className="alert alert-info">
          선택한 설문에 매칭 결과가 없습니다.
        </div>
      )}

      {!selectedSurveyId && (
        <div className="alert alert-info">
          매칭 결과를 보려면 위에서 설문을 선택해주세요.
        </div>
      )}
    </AdminLayout>
  );
}
