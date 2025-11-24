import "../../styles/common.css";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 3,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        data-page="prev"
        onClick={() => onPageChange?.(currentPage - 1)}
      >
        이전
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`pagination-btn ${page === currentPage ? "active" : ""}`}
          data-page={page}
          onClick={() => onPageChange?.(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="pagination-btn"
        data-page="next"
        onClick={() => onPageChange?.(currentPage + 1)}
      >
        다음
      </button>
    </div>
  );
}

