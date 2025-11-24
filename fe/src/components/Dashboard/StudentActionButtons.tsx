import "../../styles/common.css";

interface StudentActionButtonsProps {
  onUploadExcel: () => void;
  onAddStudent: () => void;
}

export default function StudentActionButtons({
  onUploadExcel,
  onAddStudent,
}: StudentActionButtonsProps) {
  return (
    <div className="action-buttons">
      <button className="btn-success" id="upload-excel" onClick={onUploadExcel}>
        엑셀 파일 업로드
      </button>
      <button className="btn-secondary" id="add-student" onClick={onAddStudent}>
        개별 학생 추가
      </button>
    </div>
  );
}

