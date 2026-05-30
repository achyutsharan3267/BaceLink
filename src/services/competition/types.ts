export type CompetitionRole = "admin" | "participant";
export type CompetitionStatus = "draft" | "waiting" | "active" | "paused" | "ended";

export type CompetitionUser = {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  role: CompetitionRole;
};

export type CompetitionQuiz = {
  id: string;
  title: string;
  description: string;
  status: CompetitionStatus;
  timerPerQuestion: number;
  isLive: boolean;
  activeQuestionId: string | null;
  currentQuestionIndex: number;
  startedAt: string | null;
  questionStartedAt: string | null;
};

export type CompetitionQuestion = {
  id: string;
  quizId: string;
  question: string;
  sortOrder: number;
  timerSeconds: number;
  options: CompetitionOption[];
};

export type CompetitionOption = {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  sortOrder: number;
};

export type CompetitionParticipant = {
  id: string;
  quizId: string;
  userId: string;
  status: "joined" | "active" | "completed";
};

export type CompetitionAttempt = {
  id: string;
  quizId: string;
  questionId: string;
  userId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeTakenMs: number;
  points: number;
  createdAt: string;
};

export type LeaderboardEntry = {
  quizId: string;
  userId: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  attemptedCount: number;
  totalTimeMs: number;
  rank: number;
  name: string;
  avatarUrl: string | null;
};

export type QuizStats = {
  totalParticipants: number;
  answersSubmitted: number;
  pendingUsers: number;
  correctRate: number;
  fastestResponders: LeaderboardEntry[];
};
