import "../../styles/survey-management.css";

interface Question {
  id: number;
  text: string;
  type: "multiple-choice" | "text-input";
}

interface QuestionListProps {
  questions: Question[];
}

export default function QuestionList({ questions }: QuestionListProps) {
  return (
    <div className="question-list">
      <h4>설문 질문 목록 (고정)</h4>
      <div id="question-preview">
        {questions.map((question, index) => (
          <div className="question-item" key={question.id}>
            <span className="question-text">
              {index + 1}. {question.text}
              <span className={`question-type-badge ${question.type}`}>
                {question.type === "multiple-choice" ? "객관식" : "주관식"}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

