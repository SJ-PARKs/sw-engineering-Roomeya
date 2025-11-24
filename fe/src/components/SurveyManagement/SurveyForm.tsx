import QuestionList from "./QuestionList";
import SurveyStudentManagement from "./SurveyStudentManagement";
import "../../styles/survey-management.css";

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

interface SurveyFormProps {
  title: string;
  deadline: string;
  students: SurveyStudent[];
  questions: Question[];
  newStudentId: string;
  newStudentName: string;
  newStudentGender: string;
  onTitleChange: (value: string) => void;
  onDeadlineChange: (value: string) => void;
  onStudentIdChange: (value: string) => void;
  onStudentNameChange: (value: string) => void;
  onStudentGenderChange: (value: string) => void;
  onAddStudent: () => void;
  onDeleteStudent: (studentId: string) => void;
  onUploadExcel: () => void;
  onSave: () => void;
  onDeploy: () => void;
}

export default function SurveyForm({
  title,
  deadline,
  students,
  questions,
  newStudentId,
  newStudentName,
  newStudentGender,
  onTitleChange,
  onDeadlineChange,
  onStudentIdChange,
  onStudentNameChange,
  onStudentGenderChange,
  onAddStudent,
  onDeleteStudent,
  onUploadExcel,
  onSave,
  onDeploy,
}: SurveyFormProps) {
  return (
    <div className="survey-management-section">
      <h3>새 설문 생성</h3>

      <div className="form-group">
        <label>설문 제목</label>
        <input
          type="text"
          id="survey-title"
          placeholder="예: 2025년 봄학기 신입생 매칭 설문"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>설문 마감일</label>
        <input
          type="date"
          id="survey-deadline"
          value={deadline}
          onChange={(e) => onDeadlineChange(e.target.value)}
        />
      </div>

      <SurveyStudentManagement
        students={students}
        newStudentId={newStudentId}
        newStudentName={newStudentName}
        newStudentGender={newStudentGender}
        onStudentIdChange={onStudentIdChange}
        onStudentNameChange={onStudentNameChange}
        onStudentGenderChange={onStudentGenderChange}
        onAddStudent={onAddStudent}
        onDeleteStudent={onDeleteStudent}
        onUploadExcel={onUploadExcel}
      />

      <QuestionList questions={questions} />

      <div className="survey-form-actions">
        <button className="btn-secondary" id="save-survey" onClick={onSave}>
          저장
        </button>
        <button className="btn-primary" id="deploy-survey" onClick={onDeploy}>
          설문 배포 (링크 생성)
        </button>
      </div>
    </div>
  );
}
