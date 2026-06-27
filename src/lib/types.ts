
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

/** Which playable experience renders a module. Absent -> classic quiz. */
export type ExperienceType = 'classic-quiz' | 'topdown-adventure' | 'math-drill';

/** Arithmetic operations the math-drill experience can generate. */
export type DrillOperation = '+' | '-' | '×' | '÷';

/** Config for the math-drill experience (procedurally generated practice). */
export interface DrillConfig {
  /** Which operations to mix in. */
  operations: DrillOperation[];
  /** Upper bound for + and - operands (default 100). */
  maxOperand?: number;
  /** Upper bound for × and ÷ factors (default 12). */
  maxFactor?: number;
  /** How many exercises per run (default 20). */
  count?: number;
  /** Optional countdown for the whole run, in seconds. */
  durationSec?: number;
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
  /** Curriculum placement (for grouping modules into subjects/units toward exams). */
  subject?: string;   // e.g. "Matemática"
  unit?: string;      // e.g. "Numeración hasta 10.000"
  grade?: string;     // e.g. "5to" / "10 años"
  order?: number;     // sort order within a subject/unit
  /** Which experience renders this module. Absent -> classic quiz. */
  experienceType?: ExperienceType;
  /** Settings for the math-drill experience (when experienceType === 'math-drill'). */
  drill?: DrillConfig;
  createdAt?: any;
}

/** Forward-looking alias: the experience-agnostic knowledge layer any experience renders. */
export type LearningModule = Quiz;

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
