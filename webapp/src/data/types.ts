export type QuestionFormat = 'text' | 'multiple-choice';

export interface MultipleChoiceQuestion {
  id: number;
  question: string;
  format: 'multiple-choice';
  options: string[];
  answer: string; // må matche ett av options eksakt
  spotify?: string; // Spotify track ID hvis embed skal vises
}

export interface TextQuestion {
  id: number;
  question: string;
  format: 'text';
  answer: string | string[]; // array = flere godkjente svar
  spotify?: string;
}

export type Question = MultipleChoiceQuestion | TextQuestion;

export interface TriviaSection {
  id: number;
  title: string;
  icon: string; // emoji
  questions: Question[];
}
