import { useCallback, useEffect, useState } from "react";
import {
  getLeaderboard,
  // getActiveQuiz,
  getLatestQuiz,
  getQuizById,
  getMyParticipant,
  getMyLeaderboardEntry,
  getQuestions,
  getQuizStats,
  subscribeToQuiz,
} from "./competition.service";
import type {
  CompetitionParticipant,
  CompetitionQuestion,
  CompetitionQuiz,
  LeaderboardEntry,
  QuizStats,
} from "./types";

export function useLiveCompetition(quizId?: string, includeCorrectAnswers = false) {
  const [quiz, setQuiz] = useState<CompetitionQuiz | null>(null);
  const [questions, setQuestions] = useState<CompetitionQuestion[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [participant, setParticipant] = useState<CompetitionParticipant | null>(null);
  const [stats, setStats] = useState<QuizStats>({
    totalParticipants: 0,
    answersSubmitted: 0,
    pendingUsers: 0,
    correctRate: 0,
    fastestResponders: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("Loading competition...");

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextQuiz = quizId ? await getQuizById(quizId) : await getLatestQuiz();
      setQuiz(nextQuiz);

      if (!nextQuiz) {
        setQuestions([]);
        setLeaderboard([]);
        setStatus("No quiz available");
        return;
      }

      const [nextQuestions, nextLeaderboard, nextStats, nextMyEntry, nextParticipant] = await Promise.all([
        getQuestions(nextQuiz.id, includeCorrectAnswers),
        getLeaderboard(nextQuiz.id),
        getQuizStats(nextQuiz),
        getMyLeaderboardEntry(nextQuiz.id),
        getMyParticipant(nextQuiz.id),
      ]);
      setQuestions(nextQuestions);
      setLeaderboard(nextLeaderboard);
      setStats(nextStats);
      setMyEntry(nextMyEntry);
      setParticipant(nextParticipant);
      setStatus("Live");
    } catch (error) {
      console.error(error);
      setStatus("Competition data could not load");
    } finally {
      setIsLoading(false);
    }
  }, [includeCorrectAnswers, quizId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!quiz?.id) return undefined;
    return subscribeToQuiz(quiz.id, load);
  }, [load, quiz?.id]);

  const activeQuestion = questions.find((question) => question.id === quiz?.activeQuestionId) ?? null;
  const remainingQuestions = Math.max(questions.length - (quiz?.currentQuestionIndex ?? 0) - 1, 0);

  return {
    quiz,
    questions,
    activeQuestion,
    leaderboard,
    myEntry,
    participant,
    stats,
    remainingQuestions,
    isLoading,
    status,
    reload: load,
  };
}
