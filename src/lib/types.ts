
export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_in_the_blank' | 'short_answer' | 'matching' | 'dictation' | 'odd_one_out';

export interface MatchItem {
  id: string;
  prompt: string;
  match: string;
}

export interface Question {
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  matchItems?: MatchItem[];
  explanation?: string;
  image?: string;
  active?: boolean;
}

export interface Rule {
  title: string;
  text: string;
  example: string;
}

export interface TheorySection {
  intro: string;
  rules: Rule[];
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  image?: string;
  questions: Question[];
  theory?: TheorySection;
  flashcards?: Flashcard[];
  active: boolean;
  sessionLength?: number;
  mode?: 'Jordi' | 'Marc';
  createdAt?: any;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface Score {
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  date: number;
}

export interface Report {
  id: string;
  quizId: string;
  quizTitle: string;
  question: string;
  reportType: 'confusing_question' | 'incorrect_correction';
  userAnswer?: string;
  correctAnswer?: string;
  reportedAt: number;
  status: 'new' | 'reviewed';
}

export interface AdminDashboardUser {
  uid: string;
  displayName: string;
  email: string | null;
  highScore: number;
  quizzesPlayed: number;
  lastPlayed: number | null;
}
