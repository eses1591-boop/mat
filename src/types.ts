export type DifficultyLevel = 1 | 2 | 3;

export interface Question {
  id: string;
  level: DifficultyLevel;
  levelName: string;
  prompt: string;          // e.g. "|-7| = ?" or "-|8| + |-3| = ?"
  questionText: string;    // Clear instruction e.g. "İfadesinin değerini bulunuz:"
  options: (string | number)[];
  correctAnswer: string | number;
  explanation: string;     // Pedagogical explanation for mistakes
  numberLineValue?: number; // Optional number to highlight on number line
  isComparison?: boolean;
  hint?: string;
}

export type GameMode = 'story' | 'endless' | 'lab';

export interface GameStats {
  score: number;
  streak: number;
  bestStreak: number;
  correctCount: number;
  wrongCount: number;
  totalAnswered: number;
}
