import { Link, useLocation } from "react-router-dom";
import "../styles/navigation.css";

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/login", label: "1. 관리자 로그인" },
    { path: "/dashboard", label: "2. 관리자 대시보드" },
    { path: "/survey", label: "3. 학생 설문조사" },
    { path: "/results", label: "4. 매칭 결과" },
    { path: "/survey-management", label: "5. 설문 관리" },
  ];

  return (
    <div className="wireframe-nav">
      <h1>🏠 룸메야! - 와이어프레임 시스템</h1>
      <div className="nav-buttons">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-btn ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
