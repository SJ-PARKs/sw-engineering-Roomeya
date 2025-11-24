import "../../styles/survey-management.css";

interface SurveyStudent {
  id: string;
  name: string;
  gender: string;
}

interface SurveyStudentManagementProps {
  students: SurveyStudent[];
  newStudentId: string;
  newStudentName: string;
  newStudentGender: string;
  onStudentIdChange: (value: string) => void;
  onStudentNameChange: (value: string) => void;
  onStudentGenderChange: (value: string) => void;
  onAddStudent: () => void;
  onDeleteStudent: (studentId: string) => void;
  onUploadExcel: () => void;
}

export default function SurveyStudentManagement({
  students,
  newStudentId,
  newStudentName,
  newStudentGender,
  onStudentIdChange,
  onStudentNameChange,
  onStudentGenderChange,
  onAddStudent,
  onDeleteStudent,
  onUploadExcel,
}: SurveyStudentManagementProps) {
  return (
    <div className="form-group">
      <label>참여 학생 목록 ({students.length}명)</label>
      <div className="survey-student-management">
        <div className="student-add-section">
          <div className="action-buttons">
            <button className="btn-success" onClick={onUploadExcel}>
              엑셀 파일 업로드
            </button>
            <button className="btn-secondary" onClick={onAddStudent}>
              개별 학생 추가
            </button>
          </div>

          <div className="student-add-form">
            <div className="form-row">
              <div className="form-group-small">
                <label>학번 *</label>
                <input
                  type="text"
                  placeholder="학번"
                  value={newStudentId}
                  onChange={(e) => onStudentIdChange(e.target.value)}
                />
              </div>
              <div className="form-group-small">
                <label>이름 *</label>
                <input
                  type="text"
                  placeholder="이름"
                  value={newStudentName}
                  onChange={(e) => onStudentNameChange(e.target.value)}
                />
              </div>
              <div className="form-group-small">
                <label>성별 *</label>
                <select
                  value={newStudentGender}
                  onChange={(e) => onStudentGenderChange(e.target.value)}
                >
                  <option value="">선택</option>
                  <option value="남">남</option>
                  <option value="여">여</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {students.length > 0 && (
          <div className="student-list-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>학번</th>
                  <th>이름</th>
                  <th>성별</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.gender}</td>
                    <td>
                      <button
                        className="btn-small btn-delete"
                        onClick={() => onDeleteStudent(student.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

