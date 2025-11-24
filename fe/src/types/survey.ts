export interface SurveyStudent {
    id: string;
    name: string;
    gender: string;
}

export interface Question {
    id: number;
    text: string;
    type: "multiple-choice" | "text-input";
}

export interface Survey {
    id: number;
    title: string;
    createdDate: string;
    deadline: string;
    status: "active" | "inactive";
    studentIds?: string[];
    students?: SurveyStudent[];
    questions?: Question[];
    [key: string]: any;
}
