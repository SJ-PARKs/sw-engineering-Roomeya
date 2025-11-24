import "../../styles/common.css";

interface Student {
  id: string;
  name: string;
  gender: string;
  email: string;
  birthDate: string;
  registerDate: string;
}

interface StudentListTableProps {
  students: Student[];
  onEdit: (studentId: string) => void;
  onDelete: (studentId: string) => void;
}

export default function StudentListTable({
  students,
  onEdit,
  onDelete,
}: StudentListTableProps) {
  return (
    <table className="data-table" id="student-table">
      <thead>
        <tr>
          <th>학번</th>
          <th>이름</th>
          <th>성별</th>
          <th>이메일</th>
          <th>생년월일</th>
          <th>등록일</th>
          <th>작업</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>{student.id}</td>
            <td>{student.name}</td>
            <td>{student.gender}</td>
            <td>{student.email}</td>
            <td>{student.birthDate}</td>
            <td>{student.registerDate}</td>
            <td>
              <button
                className="btn-small btn-edit"
                onClick={() => onEdit(student.id)}
              >
                수정
              </button>
              <button
                className="btn-small btn-delete"
                onClick={() => onDelete(student.id)}
              >
                삭제
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
