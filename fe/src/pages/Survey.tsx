import { useState } from "react";
import { useParams } from "react-router-dom";
import IdentityVerification from "../components/Survey/IdentityVerification";
import SurveyQuestions from "../components/Survey/SurveyQuestions";
import { useSubmitSurveyResponse, useIdentifyStudent } from "../hooks";
import "../styles/survey.css";

export default function Survey() {
  const { surveyId } = useParams<{ surveyId: string }>();

  const [isVerified, setIsVerified] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    wakeup: "",
    bedtime: "",
    smoking: "",
    sleepHabits: "",
    mbti: "",
    major: "",
    specialNotes: "",
  });

  // 설문 응답 제출 훅
  const submitResponseMutation = useSubmitSurveyResponse();

  // 학생 인증 훅
  const identifyStudentMutation = useIdentifyStudent();

  const handleVerify = async () => {
    setVerificationError("");
    if (!studentId || !studentName) {
      setVerificationError("학번과 이름을 모두 입력해주세요.");
      return;
    }

    if (!surveyId) {
      setVerificationError("설문 ID가 없습니다.");
      return;
    }

    // 서버 API로 학생 인증 (실존하는 학생인지 확인)
    try {
      const result = await identifyStudentMutation.mutateAsync({
        studentId: studentId,
        name: studentName,
      });

      if (result.isValid) {
        setIsVerified(true);
        setVerificationError("");
      } else {
        console.log(result);
        setVerificationError(
          "학번과 이름이 일치하지 않거나 등록되지 않은 학생입니다."
        );
      }
    } catch (error) {
      console.error("학생 인증 실패:", error);
      setVerificationError("학생 인증에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSubmit = async () => {
    if (!isVerified) {
      alert("먼저 신원 확인을 완료해주세요.");
      return;
    }

    if (isSubmitted) {
      alert("이미 제출한 설문입니다. 한 번 제출한 설문은 수정할 수 없습니다.");
      return;
    }

    // 필수 항목 확인
    if (
      !formData.wakeup ||
      !formData.bedtime ||
      !formData.smoking ||
      !formData.sleepHabits
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (!surveyId) {
      alert("설문 ID가 없습니다.");
      return;
    }

    // 서버 API로 설문 응답 제출 (URL의 formId를 서버로 보내서 검증)
    try {
      const result = await submitResponseMutation.mutateAsync({
        formId: surveyId, // URL의 formId
        studentId,
        studentName,
        answers: formData,
      });

      if (!result) {
        alert("설문 제출에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      setIsSubmitted(true);
      alert("설문조사가 제출되었습니다!");
    } catch (error) {
      console.error("설문 제출 실패:", error);
      alert("설문 제출에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleRadioChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleStudentIdChange = (value: string) => {
    setStudentId(value);
    setIsVerified(false);
    setIsSubmitted(false);
  };

  const handleStudentNameChange = (value: string) => {
    setStudentName(value);
    setIsVerified(false);
    setIsSubmitted(false);
  };

  return (
    <div id="survey" className="survey-page">
      <div className="survey-content">
        <div className="survey-intro">
          <div className="page-title">룸메이트 매칭을 위한 기본 설문조사</div>
          <p>최적의 룸메이트 매칭을 위해 솔직하게 답변해 주세요.</p>
        </div>

        <IdentityVerification
          studentId={studentId}
          studentName={studentName}
          isVerified={isVerified}
          isSubmitted={isSubmitted}
          error={verificationError}
          onStudentIdChange={handleStudentIdChange}
          onStudentNameChange={handleStudentNameChange}
          onVerify={handleVerify}
        />

        <SurveyQuestions
          isVerified={isVerified}
          formData={formData}
          onRadioChange={handleRadioChange}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
