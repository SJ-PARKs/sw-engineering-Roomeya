import { useState } from "react";
import AdminLayout from "../components/common/AdminLayout";
import SurveySelector from "../components/Matching/SurveySelector";
import MatchingStats from "../components/Matching/MatchingStats";
import MatchingAction from "../components/Matching/MatchingAction";
import {
  useSurveysWithStats,
  useSurveyResponses,
  useRunMatching,
} from "../hooks";
import "../styles/dashboard.css";
import "../styles/survey.css";

interface Survey {
  id: number;
  title: string;
  createdDate: string;
  deadline: string;
  status: "active" | "inactive";
  studentIds: string[];
  students?: SurveyStudent[];
  questions: Question[];
}

interface SurveyStudent {
  id: string;
  name: string;
  gender: string;
}

interface Question {
  id: number;
  text: string;
  type: "multiple-choice" | "text-input";
}

interface SurveyResponse {
  studentId: string;
  studentName: string;
  wakeup: string;
  bedtime: string;
  smoking: string;
  sleepHabits: string;
  mbti?: string;
  major?: string;
  specialNotes?: string;
}

export default function Matching() {
  const [matchingStatus, setMatchingStatus] = useState<string>("");
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);

  // 설문 목록 조회 (통계 정보 포함)
  const { data: surveysWithStatsData = [] } = useSurveysWithStats();
  const runMatchingMutation = useRunMatching();

  // 설문 목록을 로컬 형식으로 변환
  const surveys: Survey[] = surveysWithStatsData.map((survey) => {
    return {
      id: parseInt(survey.formId) || 0,
      title: survey.title,
      createdDate: survey.createdAt
        ? new Date(survey.createdAt).toISOString().split("T")[0]
        : "",
      deadline: survey.deadline
        ? new Date(survey.deadline).toISOString().split("T")[0]
        : "",
      status: "active", // 서버에서 받은 설문은 모두 활성화된 것으로 간주
      studentIds: [],
      students: [],
      questions: [],
    };
  });

  // 선택된 설문의 formId 찾기
  const selectedSurveyWithStats = selectedSurveyId
    ? surveysWithStatsData.find((s) => parseInt(s.formId) === selectedSurveyId)
    : null;

  // 선택된 설문의 응답 데이터 조회
  const { data: responsesData = [] } = useSurveyResponses(
    selectedSurveyWithStats?.formId || null
  );

  // 응답 데이터를 로컬 형식으로 변환
  const getSurveyResponses = (): SurveyResponse[] => {
    return responsesData.map((response) => {
      // 설문 학생 목록에서 학생 이름 찾기
      const survey = surveys.find((s) => s.id === selectedSurveyId);
      const student = survey?.students?.find(
        (s) => s.id === response.studentId
      );

      return {
        studentId: response.studentId || "",
        studentName: student?.name || "",
        wakeup:
          ((response.answers as Record<string, unknown>)?.wakeup as string) ||
          "",
        bedtime:
          ((response.answers as Record<string, unknown>)?.bedtime as string) ||
          "",
        smoking:
          ((response.answers as Record<string, unknown>)?.smoking as string) ||
          "",
        sleepHabits:
          ((response.answers as Record<string, unknown>)
            ?.sleepHabits as string) || "",
        mbti:
          ((response.answers as Record<string, unknown>)?.mbti as string) || "",
        major:
          ((response.answers as Record<string, unknown>)?.major as string) ||
          "",
        specialNotes:
          ((response.answers as Record<string, unknown>)
            ?.specialNotes as string) || "",
      };
    });
  };

  const handleRunMatching = async () => {
    if (!selectedSurveyId) {
      alert("매칭할 설문을 선택해주세요.");
      return;
    }

    const surveyWithStats = surveysWithStatsData.find(
      (s) => parseInt(s.formId) === selectedSurveyId
    );
    if (!surveyWithStats) {
      alert("선택한 설문을 찾을 수 없습니다.");
      return;
    }

    const totalParticipants = surveyWithStats.totalParticipants;
    const completedCount = surveyWithStats.completedCount;

    if (totalParticipants < 2) {
      alert(
        "매칭을 실행하려면 최소 2명 이상의 학생이 설문에 포함되어야 합니다."
      );
      return;
    }

    if (completedCount < 2) {
      alert("매칭을 실행하려면 최소 2명 이상의 학생이 설문을 완료해야 합니다.");
      return;
    }

    setMatchingStatus("매칭 알고리즘 실행 중...");

    try {
      const result = await runMatchingMutation.mutateAsync(
        surveyWithStats.formId
      );

      if (result) {
        setMatchingStatus(
          `매칭 완료! ${result.pairs?.length || 0}개의 쌍이 매칭되었습니다.`
        );

        setTimeout(() => {
          window.location.href = `/results?surveyId=${selectedSurveyId}`;
        }, 2000);
      } else {
        setMatchingStatus("매칭 실행에 실패했습니다.");
      }
    } catch (error) {
      console.error("매칭 실행 실패:", error);
      setMatchingStatus("매칭 실행에 실패했습니다.");
    }
  };

  const activeSurveys = surveys.filter((s) => s.status === "active");

  // 선택된 설문의 통계 정보 (서버에서 받은 데이터 사용)
  const getSurveyStats = (surveyId: number) => {
    const surveyWithStats = surveysWithStatsData.find(
      (s) => parseInt(s.formId) === surveyId
    );
    if (!surveyWithStats) return { total: 0, completed: 0, rate: 0 };

    const total = surveyWithStats.totalParticipants;
    const completed = surveyWithStats.completedCount;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, rate };
  };

  const stats = selectedSurveyId
    ? getSurveyStats(selectedSurveyId)
    : { total: 0, completed: 0, rate: 0 };

  return (
    <AdminLayout>
      <div className="page-title">매칭 실행</div>

      <div className="matching-info-section">
        <SurveySelector
          surveys={activeSurveys}
          selectedSurveyId={selectedSurveyId}
          onSelectChange={setSelectedSurveyId}
        />

        {selectedSurveyId && (
          <>
            <MatchingStats
              total={stats.total}
              completed={stats.completed}
              rate={stats.rate}
            />

            {stats.completed < 2 && (
              <div className="alert alert-error">
                매칭을 실행하려면 최소 2명 이상의 학생이 설문을 완료해야 합니다.
              </div>
            )}

            {stats.completed >= 2 && (
              <MatchingAction
                isRunning={runMatchingMutation.isPending}
                status={matchingStatus}
                onRun={handleRunMatching}
              />
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
