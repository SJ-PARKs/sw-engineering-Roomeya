import "../../styles/dashboard.css";
import "../../styles/survey.css";

interface MatchingActionProps {
  isRunning: boolean;
  status: string;
  onRun: () => void;
}

export default function MatchingAction({
  isRunning,
  status,
  onRun,
}: MatchingActionProps) {
  return (
    <div className="matching-action-section">
      <p className="matching-description">
        선택한 설문의 응답을 기반으로 최적의 룸메이트 매칭을 실행합니다.
        <br />
        매칭이 완료되면 결과 페이지로 이동합니다.
      </p>
      <button
        className="btn-primary"
        onClick={onRun}
        disabled={isRunning}
        style={{ fontSize: "18px", padding: "16px 32px" }}
      >
        {isRunning ? "매칭 실행 중..." : "매칭 실행"}
      </button>
      {status && (
        <div
          className={`alert ${isRunning ? "alert-info" : "alert-success"}`}
        >
          {status}
        </div>
      )}
    </div>
  );
}

