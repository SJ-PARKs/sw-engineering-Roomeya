import { useState, useRef } from "react";
import AdminLayout from "../components/common/AdminLayout";
import SurveyListTable from "../components/SurveyManagement/SurveyListTable";
import SurveyForm from "../components/SurveyManagement/SurveyForm";
import StudentMatchingPopup from "../components/Matching/StudentMatchingPopup";
import { useSurveys, useCreateSurvey } from "../hooks";
import { parseExcelFile } from "../utils/excelParser";
import "../styles/survey-management.css";

import { type Survey, type SurveyStudent, type Question } from "../types/survey";

export default function SurveyManagement() {
  // 설문 목록 조회
  const { data: surveysData = [] } = useSurveys();
  const createSurveyMutation = useCreateSurvey();

  // 설문 목록을 로컬 형식으로 변환
  const surveys: Survey[] = surveysData.map((survey) => {
    // API 응답에 추가 필드가 있을 수 있으므로 타입 단언 사용
    const surveyWithExtras = survey as typeof survey & {
      formId?: string;
      deadline?: string;
      participants?: Array<{ studentId: string; name: string; gender: string }>;
      fields?: Array<{
        id: string;
        title: string;
        type: string;
        options?: string[];
      }>;
    };

    // formId가 있으면 formId를 사용하고, 없으면 id를 사용
    const surveyId = surveyWithExtras.formId || survey.id;

    return {
      id: parseInt(surveyId) || 0,
      title: survey.title,
      createdDate: survey.createdAt
        ? new Date(survey.createdAt).toISOString().split("T")[0]
        : "",
      deadline: surveyWithExtras.deadline
        ? new Date(surveyWithExtras.deadline).toISOString().split("T")[0]
        : "",
      status: survey.status === "published" ? "active" : "inactive",
      studentIds: surveyWithExtras.participants?.map((p) => p.studentId) || [],
      students:
        surveyWithExtras.participants?.map((p) => ({
          id: p.studentId,
          name: p.name,
          gender: p.gender,
        })) || [],
      questions:
        surveyWithExtras.fields?.map((f, index) => ({
          id: index + 1,
          text: f.title,
          type: f.type === "multiple-choice" ? "multiple-choice" : "text-input",
        })) || [],
    };
  });

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

  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDeadline, setSurveyDeadline] = useState("");
  const [surveyStudents, setSurveyStudents] = useState<SurveyStudent[]>([]);
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGender, setNewStudentGender] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [surveyLink, setSurveyLink] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const handleTitleClick = (survey: Survey) => {
    setSelectedSurvey(survey);
  };

  const handleClosePopup = () => {
    setSelectedSurvey(null);
  };

  const handleSaveMatching = (students: any[]) => {
    console.log("Saved students matching:", students);
    // Here you would typically call an API to save the new order
    alert("매칭 결과가 저장되었습니다.");
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(surveyLink);
      alert("링크가 클립보드에 복사되었습니다!");
    } catch (error) {
      console.error("복사 실패:", error);
      // fallback: 텍스트 선택
      const textArea = document.createElement("textarea");
      textArea.value = surveyLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("링크가 클립보드에 복사되었습니다!");
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadExcel = async () => {
    // 파일 선택 다이얼로그 열기
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // 엑셀 파일 확장자 확인
    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      alert("엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.");
      return;
    }

    setIsUploading(true);

    try {
      // 프론트엔드에서 엑셀 파일 파싱
      const parsedStudents = await parseExcelFile(file);

      if (parsedStudents.length === 0) {
        alert("엑셀 파일에서 학생 데이터를 찾을 수 없습니다.");
        return;
      }

      // 파싱된 학생 데이터를 SurveyStudent 형식으로 변환
      const newStudents: SurveyStudent[] = parsedStudents.map((student) => ({
        id: student.id,
        name: student.name,
        gender:
          student.gender === "M"
            ? "남"
            : student.gender === "F"
              ? "여"
              : student.gender,
      }));

      // 기존 학생 목록과 병합 (중복 제거)
      const existingIds = new Set(surveyStudents.map((s) => s.id));
      const uniqueNewStudents = newStudents.filter(
        (s) => !existingIds.has(s.id)
      );

      if (uniqueNewStudents.length === 0) {
        alert("모든 학생이 이미 추가되어 있습니다.");
        return;
      }

      // 학생 목록에 추가
      setSurveyStudents([...surveyStudents, ...uniqueNewStudents]);

      alert(
        `엑셀 파일에서 ${parsedStudents.length}명의 학생을 찾았습니다.\n${uniqueNewStudents.length}명이 추가되었습니다.`
      );
    } catch (error) {
      console.error("엑셀 파일 파싱 실패:", error);
      alert(
        `엑셀 파일 파싱에 실패했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    } finally {
      setIsUploading(false);
      // 파일 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveSurvey = async () => {
    if (!surveyTitle || !surveyDeadline) {
      alert("설문 제목과 마감일을 입력해주세요.");
      return;
    }
    if (surveyStudents.length === 0) {
      alert("최소 1명 이상의 학생을 추가해주세요.");
      return;
    }

    // 마감일을 ISO 형식으로 변환 (날짜만 입력된 경우 시간 추가)
    let deadlineISO = surveyDeadline;
    if (!deadlineISO.includes("T")) {
      deadlineISO = `${surveyDeadline}T23:59:59`;
    }

    // 참여자 데이터 변환 (서버 API 형식)
    const participants = surveyStudents.map((s) => ({
      studentId: s.id,
      name: s.name,
      gender: s.gender as "남" | "여",
    }));

    // 질문 데이터 변환 (서버 API 형식)
    const fields = fixedQuestions.map((q, index) => {
      const field: {
        id: string;
        title: string;
        type: "multiple-choice" | "boolean" | "text";
        options?: string[];
      } = {
        id: `q${index + 1}`,
        title: q.text,
        type: q.type === "multiple-choice" ? "multiple-choice" : "text",
      };

      // multiple-choice 타입인 경우 options 추가
      if (q.type === "multiple-choice") {
        // 질문별 옵션 설정
        if (q.text.includes("기상 시간")) {
          field.options = ["6시 이전", "6시-8시", "8시-10시", "10시 이후"];
        } else if (q.text.includes("취침 시간")) {
          field.options = ["22시 이전", "22시-24시", "24시 이후"];
        } else if (q.text.includes("흡연")) {
          field.options = ["예", "아니오"];
        } else if (q.text.includes("수면 습관")) {
          field.options = ["코골이", "이갈이", "없음"];
        } else {
          field.options = ["선택지1", "선택지2", "선택지3", "기타"];
        }
      }

      return field;
    });

    // 서버로 설문 생성 요청 (저장 상태)
    try {
      const createdSurvey = await createSurveyMutation.mutateAsync({
        title: surveyTitle,
        deadline: deadlineISO,
        participants,
        fields,
      });

      if (!createdSurvey) {
        alert("설문 저장에 실패했습니다.");
        return;
      }

      // 폼 초기화
      setSurveyTitle("");
      setSurveyDeadline("");
      setSurveyStudents([]);

      alert("설문이 저장되었습니다.");
    } catch (error) {
      console.error("설문 저장 실패:", error);
      alert("설문 저장에 실패했습니다.");
    }
  };

  const handleDeploySurvey = async () => {
    if (!surveyTitle || !surveyDeadline) {
      alert("설문 제목과 마감일을 입력해주세요.");
      return;
    }
    if (surveyStudents.length === 0) {
      alert("최소 1명 이상의 학생을 추가해주세요.");
      return;
    }

    // 마감일을 ISO 형식으로 변환 (날짜만 입력된 경우 시간 추가)
    let deadlineISO = surveyDeadline;
    if (!deadlineISO.includes("T")) {
      deadlineISO = `${surveyDeadline}T23:59:59`;
    }

    // 참여자 데이터 변환 (서버 API 형식)
    const participants = surveyStudents.map((s) => ({
      studentId: s.id,
      name: s.name,
      gender: s.gender as "남" | "여",
    }));

    // 질문 데이터 변환 (서버 API 형식)
    const fields = fixedQuestions.map((q, index) => {
      const field: {
        id: string;
        title: string;
        type: "multiple-choice" | "boolean" | "text";
        options?: string[];
      } = {
        id: `q${index + 1}`,
        title: q.text,
        type: q.type === "multiple-choice" ? "multiple-choice" : "text",
      };

      // multiple-choice 타입인 경우 options 추가
      if (q.type === "multiple-choice") {
        // 질문별 옵션 설정
        if (q.text.includes("기상 시간")) {
          field.options = ["6시 이전", "6시-8시", "8시-10시", "10시 이후"];
        } else if (q.text.includes("취침 시간")) {
          field.options = ["22시 이전", "22시-24시", "24시 이후"];
        } else if (q.text.includes("흡연")) {
          field.options = ["예", "아니오"];
        } else if (q.text.includes("수면 습관")) {
          field.options = ["코골이", "이갈이", "없음"];
        } else {
          field.options = ["선택지1", "선택지2", "선택지3", "기타"];
        }
      }

      return field;
    });

    // 서버로 설문 생성 요청
    try {
      const createdSurvey = await createSurveyMutation.mutateAsync({
        title: surveyTitle,
        deadline: deadlineISO,
        participants,
        fields,
      });

      console.log("createdSurvey", createdSurvey);
      if (!createdSurvey) {
        alert("설문 배포에 실패했습니다.");
        return;
      }

      // 서버에서 받은 formId로 설문 링크 생성
      const surveyWithFormId = createdSurvey as typeof createdSurvey & {
        formId?: string;
      };
      const formId = surveyWithFormId.formId || createdSurvey.id;
      const link = `${window.location.origin}/survey/${formId}`;
      setSurveyLink(link);
      setShowLinkModal(true);

      // 폼 초기화
      setSurveyTitle("");
      setSurveyDeadline("");
      setSurveyStudents([]);
    } catch (error) {
      console.error("설문 배포 실패:", error);
      alert("설문 배포에 실패했습니다.");
    }
  };

  return (
    <AdminLayout>
      <div className="page-title">매칭 설문 관리</div>

      {/* 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <SurveyListTable surveys={surveys} onTitleClick={handleTitleClick} />

      {selectedSurvey && (
        <StudentMatchingPopup
          surveyTitle={selectedSurvey.title}
          onClose={handleClosePopup}
          onSave={handleSaveMatching}
        />
      )}

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
        isUploading={isUploading}
      />

      {/* 설문 링크 모달 */}
      {showLinkModal && (
        <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>설문 배포 완료</h3>
              <button
                className="modal-close"
                onClick={() => setShowLinkModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">
                설문이 성공적으로 배포되었습니다.
                <br />
                아래 링크를 학생들에게 공유해주세요.
              </p>
              <div className="link-container">
                <input
                  type="text"
                  value={surveyLink}
                  readOnly
                  className="link-input"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button className="btn-copy" onClick={handleCopyLink}>
                  복사
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => setShowLinkModal(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
