import "../../styles/survey-management.css";
import { type Survey } from "../../types/survey";

interface SurveyListTableProps {
  surveys: Survey[];
  onTitleClick: (survey: Survey) => void;
}

export default function SurveyListTable({ surveys, onTitleClick }: SurveyListTableProps) {
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
              <td
                className="survey-title-cell"
                onClick={() => onTitleClick(survey)}
                style={{ cursor: "pointer", color: "#1a73e8", fontWeight: 500 }}
              >
                {survey.title}
              </td>
              <td>{survey.createdDate}</td>
              <td>{survey.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
