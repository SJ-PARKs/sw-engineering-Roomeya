import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignUpAdmin, useConfirmSignUpAdmin } from "../hooks";
import "../styles/login.css";

type TabType = "login" | "signup" | "confirm";

export default function Login() {
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signupEmail, setSignupEmail] = useState(""); // 회원가입 시 사용한 이메일 저장
  const navigate = useNavigate();

  const signInMutation = useSignIn();
  const signUpMutation = useSignUpAdmin();
  const confirmSignUpMutation = useConfirmSignUpAdmin();

  const loading =
    signInMutation.isPending ||
    signUpMutation.isPending ||
    confirmSignUpMutation.isPending;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await signInMutation.mutateAsync({ email, password });
      if (result.error) {
        setError(result.error);
      } else {
        // 로그인 성공
        navigate("/survey-management");
      }
    } catch (err) {
      console.error(err);
      setError("로그인에 실패했습니다. ");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 길이 확인 (최소 8자)
    if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    try {
      const result = await signUpMutation.mutateAsync({ email, password });
      if (result.error) {
        setError(result.error);
      } else {
        // 회원가입 성공 - 이메일 인증 단계로 이동
        setSignupEmail(email);
        setActiveTab("confirm");
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError("회원가입에 실패했습니다.");
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await confirmSignUpMutation.mutateAsync({
        email: signupEmail,
        confirmationCode,
      });
      if (result.error) {
        setError(result.error);
      } else {
        // 인증 성공 - 로그인 페이지로 이동
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
        setActiveTab("login");
        setConfirmationCode("");
        setSignupEmail("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      setError("인증 코드 확인에 실패했습니다.");
    }
  };

  return (
    <div id="login" className="login-page">
      <div className="login-container">
        <div className="logo">
          🏠 룸메야!
          <br />
          <small>기숙사 룸메이트 매칭 시스템 - 관리자</small>
        </div>

        {/* 탭 메뉴 */}
        <div className="auth-tabs">
          <button
            className={`tab-button ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("login");
              setError(null);
            }}
          >
            로그인
          </button>
          <button
            className={`tab-button ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("signup");
              setError(null);
            }}
          >
            회원가입
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && <div className="error-message">{error}</div>}

        {/* 로그인 폼 */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                id="admin-email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                id="admin-password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              id="admin-login"
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        )}

        {/* 회원가입 폼 */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                id="signup-email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                id="signup-password"
                placeholder="비밀번호를 입력하세요 (최소 8자)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
              />
            </div>

            <div className="form-group">
              <label>비밀번호 확인</label>
              <input
                type="password"
                id="signup-confirm-password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              id="admin-signup"
              disabled={loading}
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>
        )}

        {/* 이메일 인증 코드 확인 폼 */}
        {activeTab === "confirm" && (
          <form onSubmit={handleConfirmSignUp}>
            <div className="confirm-message">
              <p>
                <strong>{signupEmail}</strong>로 인증 코드를 발송했습니다.
                <br />
                이메일을 확인하여 인증 코드를 입력해주세요.
              </p>
            </div>

            <div className="form-group">
              <label>인증 코드</label>
              <input
                type="text"
                id="confirmation-code"
                placeholder="인증 코드를 입력하세요"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              id="confirm-signup"
              disabled={loading}
            >
              {loading ? "인증 중..." : "인증 완료"}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setActiveTab("signup");
                setConfirmationCode("");
              }}
              disabled={loading}
            >
              뒤로 가기
            </button>
          </form>
        )}

        {activeTab === "login" && (
          <a href="#" className="forgot-password">
            비밀번호를 잊으셨나요?
          </a>
        )}
      </div>
    </div>
  );
}
