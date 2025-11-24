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
}

export default function SurveyListTable({ surveys }: SurveyListTableProps) {
  return (
    <div className="survey-management-section existing-surveys-table">
      <h3>기존 설문 목록</h3>
      <table className="data-table" id="existing-surveys-table">
        <thead>
          <tr>
            <th>설문 제목</th>
            <th>생성일</th>
            <th>마감일</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((survey) => (
            <tr key={survey.id}>
              <td>{survey.title}</td>
              <td>{survey.createdDate}</td>
              <td>{survey.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
