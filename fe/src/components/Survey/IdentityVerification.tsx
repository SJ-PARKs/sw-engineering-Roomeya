import "../../styles/survey.css";

interface IdentityVerificationProps {
  studentId: string;
  studentName: string;
  isVerified: boolean;
  isSubmitted: boolean;
  error: string;
  onStudentIdChange: (value: string) => void;
  onStudentNameChange: (value: string) => void;
  onVerify: () => void;
}

export default function IdentityVerification({
  studentId,
  studentName,
  isVerified,
  isSubmitted,
  error,
  onStudentIdChange,
  onStudentNameChange,
  onVerify,
}: IdentityVerificationProps) {
  return (
    <div className="survey-section">
      <h3>신원 확인</h3>
      {isSubmitted && (
        <div className="alert alert-info">
          이미 제출한 설문입니다. 한 번 제출한 설문은 수정할 수 없습니다.
        </div>
      )}
      <div className="form-group">
        <label>학번</label>
        <input
          type="text"
          id="student-id"
          placeholder="학번을 입력하세요"
          value={studentId}
          onChange={(e) => {
            onStudentIdChange(e.target.value);
          }}
          disabled={isSubmitted}
        />
      </div>
      <div className="form-group">
        <label>이름</label>
        <input
          type="text"
          id="student-name"
          placeholder="이름을 입력하세요"
          value={studentName}
          onChange={(e) => {
            onStudentNameChange(e.target.value);
          }}
          disabled={isSubmitted}
        />
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {isVerified && !isSubmitted && (
        <div className="alert alert-success">신원 확인이 완료되었습니다.</div>
      )}
      <button
        className="btn-primary"
        id="verify-identity"
        onClick={onVerify}
        disabled={isSubmitted}
      >
        확인
      </button>
    </div>
  );
}

