import "../../styles/results.css";

interface SummaryCardsProps {
  totalMatched: number;
  successfulPairs: number;
  successRate: number;
  unmatched: number;
}

export default function SummaryCards({
  totalMatched,
  successfulPairs,
  successRate,
  unmatched,
}: SummaryCardsProps) {
  return (
    <div className="summary-cards">
      <div className="summary-card">
        <h3 id="total-matched">{totalMatched}</h3>
        <p>총 매칭된 학생</p>
      </div>
      <div className="summary-card">
        <h3 id="successful-pairs">{successfulPairs}</h3>
        <p>매칭 성공 쌍</p>
      </div>
      <div className="summary-card">
        <h3 id="success-rate">{successRate}%</h3>
        <p>매칭 성공률</p>
      </div>
      <div className="summary-card">
        <h3 id="unmatched">{unmatched}</h3>
        <p>미매칭 학생</p>
      </div>
    </div>
  );
}

