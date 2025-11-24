import "../../styles/survey-management.css";

interface Survey {
  id: number;
  title: string;
  createdDate: string;
  deadline: string;
  status: "active" | "inactive";
}

interface SurveyListTableProps {
  surveys: Survey[];
  onEdit: (surveyId: number) => void;
  onDelete: (surveyId: number) => void;
}

export default function SurveyListTable({
  surveys,
  onEdit,
  onDelete,
}: SurveyListTableProps) {
  return (
    <div className="survey-management-section existing-surveys-table">
      <h3>기존 설문 목록</h3>
      <table className="data-table" id="existing-surveys-table">
        <thead>
          <tr>
            <th>설문 제목</th>
            <th>생성일</th>
            <th>마감일</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((survey) => (
            <tr key={survey.id}>
              <td>{survey.title}</td>
              <td>{survey.createdDate}</td>
              <td>{survey.deadline}</td>
              <td>
                <span className={`survey-status ${survey.status}`}>
                  {survey.status === "active" ? "활성" : "비활성"}
                </span>
              </td>
              <td>
                <button
                  className="btn-small btn-edit btn-edit-survey"
                  onClick={() => onEdit(survey.id)}
                >
                  수정
                </button>
                <button
                  className="btn-small btn-delete btn-delete-survey"
                  onClick={() => onDelete(survey.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

