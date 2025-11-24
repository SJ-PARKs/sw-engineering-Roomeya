import "../../styles/common.css";
import "../../styles/results.css";

interface MatchResult {
  id: number;
  roomNumber: string;
  studentA: string;
  studentB: string;
  matchScore: number;
}

interface ResultsTableProps {
  results: MatchResult[];
  onEdit: (matchId: number) => void;
}

export default function ResultsTable({
  results,
  onEdit,
}: ResultsTableProps) {
  const getScoreClass = (score: number) => {
    if (score >= 90) return "high";
    if (score >= 80) return "medium";
    return "low";
  };

  return (
    <div className="results-table-container">
      <table className="data-table" id="results-table">
        <thead>
          <tr>
            <th>방 번호</th>
            <th>학생 A 정보</th>
            <th>학생 B 정보</th>
            <th>매칭 점수</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td>{result.roomNumber}</td>
              <td>{result.studentA}</td>
              <td>{result.studentB}</td>
              <td>
                <span
                  className={`match-score ${getScoreClass(result.matchScore)}`}
                >
                  {result.matchScore}점
                </span>
              </td>
              <td>
                <button
                  className="btn-small btn-edit btn-edit-match"
                  onClick={() => onEdit(result.id)}
                >
                  수정
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

