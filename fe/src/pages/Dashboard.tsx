import { useState } from "react";
import AdminLayout from "../components/common/AdminLayout";
import StudentActionButtons from "../components/Dashboard/StudentActionButtons";
import StudentListTable from "../components/Dashboard/StudentListTable";
import Pagination from "../components/common/Pagination";
import "../styles/common.css";

interface Student {
  id: string;
  name: string;
  gender: string;
  email: string;
  birthDate: string;
  registerDate: string;
}

export default function Dashboard() {
  // localStorage에서 학생 데이터 가져오기 또는 기본 데이터 사용
  const getInitialStudents = (): Student[] => {
    const stored = localStorage.getItem("students");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse student data", e);
      }
    }
    // 기본 학생 데이터
    const defaultStudents: Student[] = [
    {
      id: "2024001",
      name: "김철수",
      gender: "남",
      email: "kim@university.ac.kr",
      birthDate: "2005-03-15",
      registerDate: "2024-10-01",
    },
    {
      id: "2024002",
      name: "이영희",
      gender: "여",
      email: "lee@university.ac.kr",
      birthDate: "2005-07-22",
      registerDate: "2024-10-01",
    },
    ];
    localStorage.setItem("students", JSON.stringify(defaultStudents));
    return defaultStudents;
  };

  const [students, setStudents] = useState<Student[]>(getInitialStudents);

  // 학생 데이터가 변경될 때마다 localStorage에 저장
  const updateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem("students", JSON.stringify(newStudents));
  };

  const handleEdit = (studentId: string) => {
    alert(`학생 ${studentId} 수정 기능 (구현 예정)`);
  };

  const handleDelete = (studentId: string) => {
    if (confirm(`학생 ${studentId}를 삭제하시겠습니까?`)) {
      const updatedStudents = students.filter((s) => s.id !== studentId);
      updateStudents(updatedStudents);
      alert("삭제 완료");
    }
  };

  const handleUploadExcel = () => {
    alert("엑셀 업로드 기능 (구현 예정)");
  };

  const handleAddStudent = () => {
    alert("학생 추가 기능 (구현 예정)");
  };

  return (
    <AdminLayout>
            <div className="page-title">학생 목록 관리</div>

      <StudentActionButtons
        onUploadExcel={handleUploadExcel}
        onAddStudent={handleAddStudent}
      />

      <StudentListTable
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination />
    </AdminLayout>
  );
}
