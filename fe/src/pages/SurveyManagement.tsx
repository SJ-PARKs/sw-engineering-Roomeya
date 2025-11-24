import { useState } from "react";
import AdminLayout from "../components/common/AdminLayout";
import SurveyListTable from "../components/SurveyManagement/SurveyListTable";
import SurveyForm from "../components/SurveyManagement/SurveyForm";
import "../styles/survey-management.css";

interface Survey {
  id: number;
  title: string;
  createdDate: string;
  deadline: string;
  status: "active" | "inactive";
  studentIds: string[]; // 설문에 참여할 학생 ID 목록
  students: SurveyStudent[]; // 설문별 학생 상세 정보
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

export default function SurveyManagement() {
  // localStorage에서 설문 목록 가져오기
  const getSurveys = (): Survey[] => {
    const stored = localStorage.getItem("surveys");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  };

  // 고정된 질문 목록
  const fixedQuestions: Question[] = [
    { id: 1, text: "기상 시간은 언제인가요?", type: "multiple-choice" },
    { id: 2, text: "취침 시간은 언제인가요?", type: "multiple-choice" },
    { id: 3, text: "흡연 여부", type: "multiple-choice" },
    { id: 4, text: "수면 습관 (코골이, 이갈이 등)", type: "multiple-choice" },
    { id: 5, text: "MBTI", type: "text-input" },
    { id: 6, text: "전공", type: "text-input" },
    { id: 7, text: "특이사항 또는 요청사항", type: "text-input" },
  ];

  // 예시 데이터 초기화 함수
  const handleInitializeExampleData = () => {
    if (
      !confirm(
        "예시 데이터를 초기화하시겠습니까? 기존 예시 설문(ID: 1)이 있으면 삭제되고 새로 생성됩니다."
      )
    ) {
      return;
    }

    const surveyId = 1;
    const existingSurveys = getSurveys();

    // 기존 예시 설문(ID: 1) 삭제
    const filteredSurveys = existingSurveys.filter((s) => s.id !== surveyId);

    // 예시 설문 관련 응답 데이터도 삭제
    const studentIds = [
      "2021112018",
      "2021112019",
      "2021112020",
      "2021112021",
      "2021112022",
    ];
    studentIds.forEach((studentId) => {
      localStorage.removeItem(`survey_${surveyId}_${studentId}`);
      localStorage.removeItem(`survey_submitted_${surveyId}_${studentId}`);
    });

    // 매칭 결과도 삭제
    localStorage.removeItem(`matchingResults_${surveyId}`);
    localStorage.removeItem(`matchingExecuted_${surveyId}`);

    // 새 예시 설문 생성
    const exampleSurvey: Survey = {
      id: surveyId,
      title: "2025년 봄학기 신입생 룸메이트 매칭 설문",
      createdDate: "2024-11-17",
      deadline: "2024-12-31",
      status: "active",
      studentIds: [
        "2021112018",
        "2021112019",
        "2021112020",
        "2021112021",
        "2021112022",
      ],
      students: [
        { id: "2021112018", name: "박지현", gender: "여" },
        { id: "2021112019", name: "김민수", gender: "남" },
        { id: "2021112020", name: "이서연", gender: "여" },
        { id: "2021112021", name: "최동현", gender: "남" },
        { id: "2021112022", name: "정수진", gender: "여" },
      ],
      questions: fixedQuestions,
    };

    const updatedSurveys = [...filteredSurveys, exampleSurvey];
    setSurveys(updatedSurveys);
    localStorage.setItem("surveys", JSON.stringify(updatedSurveys));

    // 설문 응답 데이터 추가 (4명 완료)
    const exampleResponses = [
      {
        studentId: "2021112018",
        studentName: "박지현",
        wakeup: "6to8",
        bedtime: "10to12",
        smoking: "no",
        sleepHabits: "no",
        mbti: "ENFP",
        major: "컴퓨터공학과",
        specialNotes: "조용한 환경을 선호합니다.",
        submittedAt: new Date().toISOString(),
      },
      {
        studentId: "2021112019",
        studentName: "김민수",
        wakeup: "before6",
        bedtime: "before10",
        smoking: "no",
        sleepHabits: "yes",
        mbti: "ISTJ",
        major: "전기전자공학과",
        specialNotes: "규칙적인 생활을 좋아합니다.",
        submittedAt: new Date().toISOString(),
      },
      {
        studentId: "2021112020",
        studentName: "이서연",
        wakeup: "8to10",
        bedtime: "12to2",
        smoking: "no",
        sleepHabits: "no",
        mbti: "ISFP",
        major: "디자인학과",
        specialNotes: "밤에 공부하는 편입니다.",
        submittedAt: new Date().toISOString(),
      },
      {
        studentId: "2021112021",
        studentName: "최동현",
        wakeup: "6to8",
        bedtime: "10to12",
        smoking: "no",
        sleepHabits: "no",
        mbti: "ENTP",
        major: "경영학과",
        specialNotes: "활발한 대화를 좋아합니다.",
        submittedAt: new Date().toISOString(),
      },
    ];

    // 각 응답을 localStorage에 저장
    exampleResponses.forEach((response) => {
      localStorage.setItem(
        `survey_${surveyId}_${response.studentId}`,
        JSON.stringify(response)
      );
      localStorage.setItem(
        `survey_submitted_${surveyId}_${response.studentId}`,
        "true"
      );
    });

    // 설문 목록 새로고침
    const refreshedSurveys = getSurveys();
    setSurveys(refreshedSurveys);

    alert(
      "예시 데이터가 추가되었습니다!\n- 설문 1개 (학생 5명)\n- 설문 완료: 4명"
    );
  };

  const [surveys, setSurveys] = useState<Survey[]>(getSurveys());
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDeadline, setSurveyDeadline] = useState("");
  const [surveyStudents, setSurveyStudents] = useState<SurveyStudent[]>([]);
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGender, setNewStudentGender] = useState("");

  const handleEditSurvey = (surveyId: number) => {
    alert(`설문 ${surveyId} 수정 기능 (구현 예정)`);
  };

  const handleDeleteSurvey = (surveyId: number) => {
    if (confirm(`설문 ${surveyId}를 삭제하시겠습니까?`)) {
      alert("삭제 완료 (구현 예정)");
    }
  };

  const handleAddStudent = () => {
    if (!newStudentId || !newStudentName || !newStudentGender) {
      alert("학번, 이름, 성별을 모두 입력해주세요.");
      return;
    }

    // 중복 확인
    if (surveyStudents.some((s) => s.id === newStudentId)) {
      alert("이미 추가된 학번입니다.");
      return;
    }

    const newStudent: SurveyStudent = {
      id: newStudentId,
      name: newStudentName,
      gender: newStudentGender,
    };

    setSurveyStudents([...surveyStudents, newStudent]);

    // 입력 필드 초기화
    setNewStudentId("");
    setNewStudentName("");
    setNewStudentGender("");
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm("이 학생을 목록에서 제거하시겠습니까?")) {
      setSurveyStudents(surveyStudents.filter((s) => s.id !== studentId));
    }
  };

  const handleUploadExcel = () => {
    alert(
      "엑셀 업로드 기능 (구현 예정)\n엑셀 파일 형식: 학번, 이름, 성별, 이메일, 생년월일"
    );
  };

  const handleSaveSurvey = () => {
    if (!surveyTitle || !surveyDeadline) {
      alert("설문 제목과 마감일을 입력해주세요.");
      return;
    }
    if (surveyStudents.length === 0) {
      alert("최소 1명 이상의 학생을 추가해주세요.");
      return;
    }

    const newSurvey: Survey = {
      id: surveys.length > 0 ? Math.max(...surveys.map((s) => s.id)) + 1 : 1,
      title: surveyTitle,
      createdDate: new Date().toISOString().split("T")[0],
      deadline: surveyDeadline,
      status: "inactive",
      studentIds: surveyStudents.map((s) => s.id),
      students: surveyStudents,
      questions: fixedQuestions,
    };

    const updatedSurveys = [...surveys, newSurvey];
    setSurveys(updatedSurveys);
    localStorage.setItem("surveys", JSON.stringify(updatedSurveys));

    // 폼 초기화
    setSurveyTitle("");
    setSurveyDeadline("");
    setSurveyStudents([]);

    alert("설문이 저장되었습니다.");
  };

  const handleDeploySurvey = () => {
    if (!surveyTitle || !surveyDeadline) {
      alert("설문 제목과 마감일을 입력해주세요.");
      return;
    }
    if (surveyStudents.length === 0) {
      alert("최소 1명 이상의 학생을 추가해주세요.");
      return;
    }

    const newSurvey: Survey = {
      id: surveys.length > 0 ? Math.max(...surveys.map((s) => s.id)) + 1 : 1,
      title: surveyTitle,
      createdDate: new Date().toISOString().split("T")[0],
      deadline: surveyDeadline,
      status: "active",
      studentIds: surveyStudents.map((s) => s.id),
      students: surveyStudents,
      questions: fixedQuestions,
    };

    const updatedSurveys = [...surveys, newSurvey];
    setSurveys(updatedSurveys);
    localStorage.setItem("surveys", JSON.stringify(updatedSurveys));

    const surveyLink = `${window.location.origin}/survey/${newSurvey.id}`;
    alert(`설문 배포 완료! 링크: ${surveyLink}`);

    // 폼 초기화
    setSurveyTitle("");
    setSurveyDeadline("");
    setSurveyStudents([]);
  };

  return (
    <AdminLayout>
      <div className="page-title">매칭 설문 관리</div>

      <div style={{ marginBottom: "20px" }}>
        <button
          className="btn-success"
          onClick={handleInitializeExampleData}
          style={{ fontSize: "14px", padding: "10px 20px" }}
        >
          예시 데이터 초기화 (학생 5명, 설문 완료 4명)
        </button>
      </div>

      <SurveyListTable
        surveys={surveys}
        onEdit={handleEditSurvey}
        onDelete={handleDeleteSurvey}
      />

      <SurveyForm
        title={surveyTitle}
        deadline={surveyDeadline}
        students={surveyStudents}
        questions={fixedQuestions}
        newStudentId={newStudentId}
        newStudentName={newStudentName}
        newStudentGender={newStudentGender}
        onTitleChange={setSurveyTitle}
        onDeadlineChange={setSurveyDeadline}
        onStudentIdChange={setNewStudentId}
        onStudentNameChange={setNewStudentName}
        onStudentGenderChange={setNewStudentGender}
        onAddStudent={handleAddStudent}
        onDeleteStudent={handleDeleteStudent}
        onUploadExcel={handleUploadExcel}
        onSave={handleSaveSurvey}
        onDeploy={handleDeploySurvey}
      />
    </AdminLayout>
  );
}
