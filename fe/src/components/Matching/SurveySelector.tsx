import "../../styles/dashboard.css";

interface Survey {
  id: number;
  title: string;
  deadline: string;
}

interface SurveySelectorProps {
  surveys: Survey[];
  selectedSurveyId: number | null;
  onSelectChange: (surveyId: number) => void;
}

export default function SurveySelector({
  surveys,
  selectedSurveyId,
  onSelectChange,
}: SurveySelectorProps) {
  if (surveys.length === 0) {
    return (
      <div className="form-group">
        <label>매칭할 설문 선택</label>
        <div className="alert alert-info">
          활성화된 설문이 없습니다. 먼저 설문 관리에서 설문을 생성하고
          배포해주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label>매칭할 설문 선택</label>
      <select
        className="form-group input"
        value={selectedSurveyId || ""}
        onChange={(e) => onSelectChange(Number(e.target.value))}
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "14px",
        }}
      >
        <option value="">설문을 선택하세요</option>
        {surveys.map((survey) => (
          <option key={survey.id} value={survey.id}>
            {survey.title} (마감: {survey.deadline})
          </option>
        ))}
      </select>
    </div>
  );
}

