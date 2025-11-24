import "../../styles/survey.css";

interface SurveyQuestionsProps {
  isVerified: boolean;
  formData: {
    wakeup: string;
    bedtime: string;
    smoking: string;
    sleepHabits: string;
    mbti: string;
    major: string;
    specialNotes: string;
  };
  onRadioChange: (field: string, value: string) => void;
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export default function SurveyQuestions({
  isVerified,
  formData,
  onRadioChange,
  onInputChange,
  onSubmit,
}: SurveyQuestionsProps) {
  return (
    <div
      id="survey-questions"
      className={`survey-section ${!isVerified ? "disabled" : ""}`}
    >
      <h3>설문 항목</h3>

      <div className="form-group">
        <label>기상 시간</label>
        <div className="radio-group">
          <div className="radio-item">
            <input
              type="radio"
              name="wakeup"
              value="before6"
              checked={formData.wakeup === "before6"}
              onChange={(e) => onRadioChange("wakeup", e.target.value)}
            />
            오전 6시 이전
          </div>
          <div className="radio-item">
            <input
              type="radio"
              name="wakeup"
              value="6to8"
              checked={formData.wakeup === "6to8"}
              onChange={(e) => onRadioChange("wakeup", e.target.value)}
            />
            오전 6시 - 8시
          </div>
          <div className="radio-item">
            <input
              type="radio"
              name="wakeup"
              value="8to10"
              checked={formData.wakeup === "8to10"}
              onChange={(e) => onRadioChange("wakeup", e.target.value)}
            />
            오전 8시 - 10시
          </div>
          <div className="radio-item">
            <input
              type="radio"
              name="wakeup"
              value="after10"
              checked={formData.wakeup === "after10"}
              onChange={(e) => onRadioChange("wakeup", e.target.value)}
            />
            오전 10시 이후
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>취침 시간</label>
        <div className="radio-group">
          <div className="radio-item">
            <input
              type="radio"
              name="bedtime"
              value="before10"
              checked={formData.bedtime === "before10"}
              onChange={(e) => onRadioChange("bedtime", e.target.value)}
            />
            오후 10시 이전
          </div>
          <div className="radio-item">
            <input
              type="radio"
              name="bedtime"
              value="10to12"
              checked={formData.bedtime === "10to12"}
              onChange={(e) => onRadioChange("bedtime", e.target.value)}
            />
            오후 10시 - 12시
          </div>
          <div className="radio-item">
            <input
              type="radio"
              name="bedtime"
              value="12to2"
              checked={formData.bedtime === "12to2"}
              onChange={(e) => onRadioChange("bedtime", e.target.value)}
            />
            오전 12시 - 2시
          </div>
          <div className="radio-item">
            <input
              type="radio"
              name="bedtime"
              value="after2"
              checked={formData.bedtime === "after2"}
              onChange={(e) => onRadioChange("bedtime", e.target.value)}
            />
            오전 2시 이후
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>흡연 여부</label>
        <div className="radio-group">
          <div className="radio-item">
            <input
              type="radio"
              name="smoking"
              value="yes"
              checked={formData.smoking === "yes"}
              onChange={(e) => onRadioChange("smoking", e.target.value)}
            />
            예
          </div>
          <div className="radio-item">
            <input
              type="radio"
              name="smoking"
              value="no"
              checked={formData.smoking === "no"}
              onChange={(e) => onRadioChange("smoking", e.target.value)}
            />
            아니오
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>수면 습관 (코골이, 이갈이 등)</label>
        <div className="radio-group">
          <div className="radio-item">
            <input
              type="radio"
              name="sleep_habits"
              value="yes"
              checked={formData.sleepHabits === "yes"}
              onChange={(e) => onRadioChange("sleepHabits", e.target.value)}
            />
            있음
          </div>
          <div className="radio-item">
            <input
              type="radio"
              name="sleep_habits"
              value="no"
              checked={formData.sleepHabits === "no"}
              onChange={(e) => onRadioChange("sleepHabits", e.target.value)}
            />
            없음
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>MBTI</label>
        <input
          type="text"
          id="mbti"
          placeholder="MBTI를 입력하세요 (예: ENFP)"
          value={formData.mbti}
          onChange={(e) => onInputChange("mbti", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>전공</label>
        <input
          type="text"
          id="major"
          placeholder="전공을 입력하세요"
          value={formData.major}
          onChange={(e) => onInputChange("major", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>특이사항 또는 요청사항</label>
        <textarea
          rows={4}
          id="special-notes"
          placeholder="추가로 알려주고 싶은 내용이 있다면 작성해 주세요"
          value={formData.specialNotes}
          onChange={(e) => onInputChange("specialNotes", e.target.value)}
        />
      </div>

      <div className="survey-submit">
        <button className="btn-primary" id="submit-survey" onClick={onSubmit}>
          제출하기
        </button>
      </div>
    </div>
  );
}
