import { Link, useLocation } from "react-router-dom";
import "../../styles/dashboard.css";

export default function Sidebar() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header-title">메뉴</div>
        <div className="sidebar-admin-info">
          <div className="admin-name">
            관리자: {localStorage.getItem("adminEmail") || "홍길동님"}
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link
            to="/survey-management"
            className={
              location.pathname === "/survey-management" ? "active" : ""
            }
          >
            매칭 설문 관리
          </Link>
        </li>
        <li>
          <Link
            to="/matching"
            className={location.pathname === "/matching" ? "active" : ""}
          >
            매칭 실행
          </Link>
        </li>
        <li>
          <Link
            to="/results"
            className={location.pathname === "/results" ? "active" : ""}
          >
            매칭 결과 보기
          </Link>
        </li>
      </ul>
    </div>
  );
}
