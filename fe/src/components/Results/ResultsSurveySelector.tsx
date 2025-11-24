import "../../styles/dashboard.css";

interface Survey {
  id: number;
  title: string;
  deadline: string;
}

interface ResultsSurveySelectorProps {
  surveys: Survey[];
  selectedSurveyId: number | null;
  onSelectChange: (surveyId: number) => void;
}

export default function ResultsSurveySelector({
  surveys,
  selectedSurveyId,
  onSelectChange,
}: ResultsSurveySelectorProps) {
  if (surveys.length === 0) {
    return (
      <div className="form-group">
        <label>매칭 결과를 볼 설문 선택</label>
        <div className="alert alert-info">
          매칭 결과가 있는 설문이 없습니다. 먼저 매칭 실행에서 매칭을 완료해주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label>매칭 결과를 볼 설문 선택</label>
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

