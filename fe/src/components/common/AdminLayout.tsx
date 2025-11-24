import { type ReactNode } from "react";
import Sidebar from "./Sidebar";
import "../../styles/dashboard.css";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="dashboard">
          <Sidebar />
          <div className="main-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
