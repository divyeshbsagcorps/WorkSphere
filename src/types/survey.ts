export type QuestionType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'radio'
  | 'select'
  | 'checkbox';

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  helpText?: string;
}

export interface SurveySection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  sections: SurveySection[];
  targetDepartment?: string;
  isActive: boolean;
  createdAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  employeeId: number;
  answers: Record<string, string | string[]>;
  submittedAt: string;
}

export interface SurveyState {
  surveys: Survey[];
  activeSurvey: Survey | null;
  currentStep: number;
  responses: SurveyResponse[];
  isLoading: boolean;
  error: string | null;
  aiInsights: string | null;
  isAiLoading: boolean;
}
