import type { User } from "@supabase/supabase-js";
import { supabase } from "../../supabase";
import type {
  CompetitionAttempt,
  CompetitionOption,
  CompetitionParticipant,
  CompetitionQuestion,
  CompetitionQuiz,
  CompetitionUser,
  LeaderboardEntry,
  QuizStats,
} from "./types";

type QuizRow = {
  id: string;
  title: string;
  description: string;
  status: CompetitionQuiz["status"];
  timer_per_question: number;
  is_live?: boolean;
  active_question_id: string | null;
  current_question_index: number;
  started_at: string | null;
  question_started_at: string | null;
};

type QuestionRow = {
  id: string;
  quiz_id: string;
  question: string;
  sort_order: number;
  timer_seconds: number;
};

type OptionRow = {
  id: string;
  question_id: string;
  option_text: string;
  is_correct?: boolean;
  sort_order: number;
};

type UserRow = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  role: CompetitionUser["role"];
};

type LeaderboardRow = {
  quiz_id: string;
  user_id: string;
  score: number;
  correct_count: number;
  wrong_count: number;
  attempted_count: number;
  total_time_ms: number;
  rank: number;
  users?:
    | {
    name: string | null;
    avatar_url: string | null;
  }
    | Array<{
        name: string | null;
        avatar_url: string | null;
      }>
    | null;
};

type ParticipantRow = {
  id: string;
  quiz_id: string;
  user_id: string;
  status: CompetitionParticipant["status"];
};

function requireSupabase() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

function toQuiz(row: QuizRow): CompetitionQuiz {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    timerPerQuestion: row.timer_per_question,
    isLive: row.is_live ?? false,
    activeQuestionId: row.active_question_id,
    currentQuestionIndex: row.current_question_index,
    startedAt: row.started_at,
    questionStartedAt: row.question_started_at,
  };
}

function toQuestion(row: QuestionRow, options: CompetitionOption[] = []): CompetitionQuestion {
  return {
    id: row.id,
    quizId: row.quiz_id,
    question: row.question,
    sortOrder: row.sort_order,
    timerSeconds: row.timer_seconds,
    options,
  };
}

function toOption(row: OptionRow): CompetitionOption {
  return {
    id: row.id,
    questionId: row.question_id,
    optionText: row.option_text,
    isCorrect: row.is_correct ?? false,
    sortOrder: row.sort_order,
  };
}

function toUser(row: UserRow): CompetitionUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    role: row.role,
  };
}

function toLeaderboard(row: LeaderboardRow): LeaderboardEntry {
  const userProfile = Array.isArray(row.users) ? row.users[0] : row.users;

  return {
    quizId: row.quiz_id,
    userId: row.user_id,
    score: row.score,
    correctCount: row.correct_count,
    wrongCount: row.wrong_count,
    attemptedCount: row.attempted_count,
    totalTimeMs: row.total_time_ms,
    rank: row.rank,
    name: userProfile?.name ?? "Guest Devotee",
    avatarUrl: userProfile?.avatar_url ?? null,
  };
}

export async function signInWithGoogle() {
  const client = requireSupabase();
  const { error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin + window.location.pathname },
  });
  if (error) throw error;
}

export async function signOutCompetitionUser() {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function getAuthUser() {
  const client = requireSupabase();
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function upsertUserProfile(user: User) {
  const client = requireSupabase();
  const profile = {
    id: user.id,
    email: user.email ?? null,
    name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "Devotee",
    avatar_url: user.user_metadata?.avatar_url ?? null,
  };

  const { data: existing } = await client.from("users").select("role").eq("id", user.id).maybeSingle();
  const { data, error } = await client
    .from("users")
    .upsert({ ...profile, role: existing?.role ?? "participant" })
    .select("id,email,name,avatar_url,role")
    .single();

  if (error) throw error;
  return toUser(data as UserRow);
}

export async function getCurrentProfile() {
  const user = await getAuthUser();
  if (!user) return null;
  return upsertUserProfile(user);
}

export async function getLatestQuiz() {
  const client = requireSupabase();
  const { data, error } = await client
    .from("quizzes")
    .select("id,title,description,status,timer_per_question,is_live,active_question_id,current_question_index,started_at,question_started_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? toQuiz(data as QuizRow) : null;
}

export async function getActiveQuiz() {
  const client = requireSupabase();
  const { data, error } = await client
    .from("quizzes")
    .select("id,title,description,status,timer_per_question,is_live,active_question_id,current_question_index,started_at,question_started_at")
    .eq("is_live", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (data) return toQuiz(data as QuizRow);
  return getLatestQuiz();
}

export async function getQuizById(quizId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("quizzes")
    .select("id,title,description,status,timer_per_question,is_live,active_question_id,current_question_index,started_at,question_started_at")
    .eq("id", quizId)
    .maybeSingle();
  if (error) throw error;
  return data ? toQuiz(data as QuizRow) : null;
}

export async function getQuizzes() {
  const client = requireSupabase();
  const { data, error } = await client
    .from("quizzes")
    .select("id,title,description,status,timer_per_question,is_live,active_question_id,current_question_index,started_at,question_started_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => toQuiz(row as QuizRow));
}

export async function createQuiz(title: string, description: string, timerPerQuestion: number) {
  const client = requireSupabase();
  const { data: user } = await client.auth.getUser();
  const { data, error } = await client
    .from("quizzes")
    .insert({
      title,
      description,
      timer_per_question: timerPerQuestion,
      status: "draft",
      created_by: user.user?.id ?? null,
    })
    .select("id,title,description,status,timer_per_question,is_live,active_question_id,current_question_index,started_at,question_started_at")
    .single();
  if (error) throw error;
  return toQuiz(data as QuizRow);
}

export async function makeQuizLive(quizId: string) {
  const client = requireSupabase();
  const { error: clearError } = await client.from("quizzes").update({ is_live: false });
  if (clearError) throw clearError;

  const { error } = await client.from("quizzes").update({ is_live: true }).eq("id", quizId);
  if (error) throw error;
}

export async function createQuestionWithOptions(
  quizId: string,
  question: string,
  timerSeconds: number,
  options: Array<{ text: string; isCorrect: boolean }>,
) {
  const client = requireSupabase();
  const { count } = await client
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("quiz_id", quizId);
  const { data: questionRow, error: questionError } = await client
    .from("questions")
    .insert({
      quiz_id: quizId,
      question,
      timer_seconds: timerSeconds,
      sort_order: count ?? 0,
    })
    .select("id,quiz_id,question,sort_order,timer_seconds")
    .single();
  if (questionError) throw questionError;

  const optionRows = options.map((option, index) => ({
    question_id: questionRow.id,
    option_text: option.text,
    is_correct: option.isCorrect,
    sort_order: index,
  }));
  const { error: optionError } = await client.from("options").insert(optionRows);
  if (optionError) throw optionError;

  return getQuestions(quizId, true);
}

export async function getQuestions(quizId: string, includeCorrectAnswers = false) {
  const client = requireSupabase();
  const { data: questions, error: questionError } = await client
    .from("questions")
    .select("id,quiz_id,question,sort_order,timer_seconds")
    .eq("quiz_id", quizId)
    .order("sort_order", { ascending: true });
  if (questionError) throw questionError;

  const questionIds = (questions ?? []).map((question) => question.id);
  const optionSelect = includeCorrectAnswers
    ? "id,question_id,option_text,is_correct,sort_order"
    : "id,question_id,option_text,sort_order";
  const { data: options, error: optionError } = await client
    .from("options")
    .select(optionSelect)
    .in("question_id", questionIds.length ? questionIds : ["00000000-0000-0000-0000-000000000000"])
    .order("sort_order", { ascending: true });
  if (optionError) throw optionError;

  const optionsByQuestion = new Map<string, CompetitionOption[]>();
  (options ?? []).forEach((option) => {
    const nextOption = toOption(option as unknown as OptionRow);
    optionsByQuestion.set(nextOption.questionId, [
      ...(optionsByQuestion.get(nextOption.questionId) ?? []),
      nextOption,
    ]);
  });

  return (questions ?? []).map((question) =>
    toQuestion(question as QuestionRow, optionsByQuestion.get(question.id) ?? []),
  );
}

export async function joinQuiz(quizId: string) {
  const client = requireSupabase();
  const user = await getAuthUser();
  if (!user) throw new Error("Login required.");

  const { error } = await client
    .from("quiz_participants")
    .upsert({ quiz_id: quizId, user_id: user.id, status: "joined" }, { onConflict: "quiz_id,user_id" });
  if (error) throw error;
}

export async function getMyParticipant(quizId: string) {
  const client = requireSupabase();
  const user = await getAuthUser();
  if (!user) return null;

  const { data, error } = await client
    .from("quiz_participants")
    .select("id,quiz_id,user_id,status")
    .eq("quiz_id", quizId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as ParticipantRow;
  return {
    id: row.id,
    quizId: row.quiz_id,
    userId: row.user_id,
    status: row.status,
  } satisfies CompetitionParticipant;
}

export async function submitCompetitionAnswer(quizId: string, questionId: string, optionId: string) {
  const client = requireSupabase();
  const { data, error } = await client.rpc("submit_quiz_answer", {
    target_quiz_id: quizId,
    target_question_id: questionId,
    target_option_id: optionId,
  });
  if (error) throw error;
  const row = data as {
    id: string;
    quiz_id: string;
    question_id: string;
    user_id: string;
    selected_option_id: string;
    is_correct: boolean;
    time_taken_ms: number;
    points: number;
    created_at: string;
  };
  return {
    id: row.id,
    quizId: row.quiz_id,
    questionId: row.question_id,
    userId: row.user_id,
    selectedOptionId: row.selected_option_id,
    isCorrect: row.is_correct,
    timeTakenMs: row.time_taken_ms,
    points: row.points,
    createdAt: row.created_at,
  } satisfies CompetitionAttempt;
}

export async function setQuizStatus(quiz: CompetitionQuiz, status: CompetitionQuiz["status"]) {
  const client = requireSupabase();
  const updates: Record<string, unknown> = { status };
  if (status === "active") {
    updates.started_at = quiz.startedAt ?? new Date().toISOString();
    updates.question_started_at = new Date().toISOString();
  }
  if (status === "ended") {
    updates.active_question_id = null;
  }
  const { error } = await client.from("quizzes").update(updates).eq("id", quiz.id);
  if (error) throw error;
}

export async function startQuiz(quizId: string) {
  const client = requireSupabase();
  const questions = await getQuestions(quizId);
  const firstQuestion = questions[0];
  if (!firstQuestion) throw new Error("Add at least one question first.");
  const { error } = await client
    .from("quizzes")
    .update({
      status: "active",
      active_question_id: firstQuestion.id,
      current_question_index: 0,
      started_at: new Date().toISOString(),
      question_started_at: new Date().toISOString(),
    })
    .eq("id", quizId);
  if (error) throw error;
}

export async function goToNextQuestion(quiz: CompetitionQuiz) {
  const client = requireSupabase();
  const questions = await getQuestions(quiz.id);
  const nextIndex = quiz.currentQuestionIndex + 1;
  const nextQuestion = questions[nextIndex];
  if (!nextQuestion) {
    await setQuizStatus(quiz, "ended");
    return;
  }
  const { error } = await client
    .from("quizzes")
    .update({
      status: "active",
      active_question_id: nextQuestion.id,
      current_question_index: nextIndex,
      question_started_at: new Date().toISOString(),
    })
    .eq("id", quiz.id);
  if (error) throw error;
}

export async function getLeaderboard(quizId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("leaderboard")
    .select("quiz_id,user_id,score,correct_count,wrong_count,attempted_count,total_time_ms,rank,users(name,avatar_url)")
    .eq("quiz_id", quizId)
    .order("rank", { ascending: true })
    .limit(50);
  if (error) throw error;
  return (data ?? []).map((row) => toLeaderboard(row as LeaderboardRow));
}

export async function getMyLeaderboardEntry(quizId: string) {
  const client = requireSupabase();
  const user = await getAuthUser();
  if (!user) return null;
  const { data, error } = await client
    .from("leaderboard")
    .select("quiz_id,user_id,score,correct_count,wrong_count,attempted_count,total_time_ms,rank,users(name,avatar_url)")
    .eq("quiz_id", quizId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data ? toLeaderboard(data as LeaderboardRow) : null;
}

export async function getQuizStats(quiz: CompetitionQuiz) {
  const client = requireSupabase();
  const [{ count: totalParticipants }, { count: answersSubmitted }, leaderboard] = await Promise.all([
    client.from("quiz_participants").select("id", { count: "exact", head: true }).eq("quiz_id", quiz.id),
    quiz.activeQuestionId
      ? client
          .from("competition_attempts")
          .select("id", { count: "exact", head: true })
          .eq("quiz_id", quiz.id)
          .eq("question_id", quiz.activeQuestionId)
      : Promise.resolve({ count: 0 }),
    getLeaderboard(quiz.id),
  ]);

  const correctAnswers = quiz.activeQuestionId
    ? await client
        .from("competition_attempts")
        .select("id", { count: "exact", head: true })
        .eq("quiz_id", quiz.id)
        .eq("question_id", quiz.activeQuestionId)
        .eq("is_correct", true)
    : { count: 0 };

  const submitted = answersSubmitted ?? 0;
  return {
    totalParticipants: totalParticipants ?? 0,
    answersSubmitted: submitted,
    pendingUsers: Math.max((totalParticipants ?? 0) - submitted, 0),
    correctRate: submitted > 0 ? Math.round(((correctAnswers.count ?? 0) / submitted) * 100) : 0,
    fastestResponders: leaderboard.slice().sort((a, b) => a.totalTimeMs - b.totalTimeMs).slice(0, 3),
  } satisfies QuizStats;
}

export function subscribeToQuiz(quizId: string, onChange: () => void) {
  const client = requireSupabase();
  const channel = client
    .channel(`quiz-${quizId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "quizzes", filter: `id=eq.${quizId}` }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "competition_attempts", filter: `quiz_id=eq.${quizId}` }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "leaderboard", filter: `quiz_id=eq.${quizId}` }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "quiz_participants", filter: `quiz_id=eq.${quizId}` }, onChange)
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}
