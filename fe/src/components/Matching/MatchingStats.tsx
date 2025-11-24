import "../../styles/dashboard.css";

interface MatchingStatsProps {
  total: number;
  completed: number;
  rate: number;
}

export default function MatchingStats({
  total,
  completed,
  rate,
}: MatchingStatsProps) {
  return (
    <div className="info-card">
      <h3>설문 현황</h3>
      <div className="info-stats">
        <div className="stat-item">
          <span className="stat-label">전체 학생 수</span>
          <span className="stat-value">{total}명</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">설문 완료</span>
          <span className="stat-value">{completed}명</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">응답률</span>
          <span className="stat-value">{rate}%</span>
        </div>
      </div>
    </div>
  );
}

