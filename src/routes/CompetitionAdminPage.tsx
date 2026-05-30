import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Pause, Play, Plus, SkipForward, Square, Users } from "lucide-react";
import {
  createQuestionWithOptions,
  createQuiz,
  getQuestions,
  getQuizzes,
  goToNextQuestion,
  setQuizStatus,
  startQuiz,
  useCompetitionAuth,
  useLiveCompetition,
  type CompetitionQuestion,
  type CompetitionQuiz,
} from "../services/competition";

const panelClass = "rounded-3xl border border-amber-300/20 bg-white/[0.055] p-5 backdrop-blur";
const inputClass =
  "w-full rounded-2xl border border-amber-300/20 bg-[#06142b]/80 px-4 py-3 text-amber-50 outline-none transition focus:border-amber-300/70";

function AdminMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-amber-300/15 bg-black/20 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function StepPill({ step, label }: { step: string; label: string }) {
  return (
    <div className="rounded-2xl border border-amber-300/15 bg-black/20 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">{step}</p>
      <p className="mt-1 font-bold text-white">{label}</p>
    </div>
  );
}

export default function CompetitionAdminPage() {
  const { profile, isAdmin, isLoading, signIn, signOut } = useCompetitionAuth();
  const [quizzes, setQuizzes] = useState<CompetitionQuiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [adminQuestions, setAdminQuestions] = useState<CompetitionQuestion[]>([]);
  const [questionsStatus, setQuestionsStatus] = useState("Select a quiz to load questions.");
  const live = useLiveCompetition(selectedQuizId || undefined, true);
  const [quizDraft, setQuizDraft] = useState({
    title: "Sunday Gita Quiz",
    description: "Live Bhagavad Gita quiz competition",
    timer: "10",
  });
  const [questionDraft, setQuestionDraft] = useState({
    question: "",
    timer: "10",
    options: ["", "", "", ""],
    correctIndex: 0,
  });
  const selectedQuiz = quizzes.find((item) => item.id === selectedQuizId) ?? null;

  const loadQuizzes = async () => {
    const nextQuizzes = await getQuizzes();
    setQuizzes(nextQuizzes);
    setSelectedQuizId((current) => current || nextQuizzes[0]?.id || "");
  };

  const loadSelectedQuestions = useCallback(async (quizId = selectedQuizId) => {
    if (!quizId) {
      setAdminQuestions([]);
      setQuestionsStatus("Select a quiz to load questions.");
      return;
    }

    setQuestionsStatus("Loading questions...");
    try {
      const nextQuestions = await getQuestions(quizId, true);
      setAdminQuestions(nextQuestions);
      setQuestionsStatus(`${nextQuestions.length} question${nextQuestions.length === 1 ? "" : "s"} loaded.`);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Unknown Supabase error";
      setAdminQuestions([]);
      setQuestionsStatus(`Questions load nahi hue: ${message}`);
    }
  }, [selectedQuizId]);

  useEffect(() => {
    loadQuizzes().catch(console.error);
  }, []);

  useEffect(() => {
    loadSelectedQuestions().catch(console.error);
  }, [loadSelectedQuestions]);

  if (isLoading) {
    return <main className="min-h-screen bg-[#000212] p-6 text-amber-50">Loading admin...</main>;
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#000212] p-6 text-amber-50">
        <div className={panelClass}>
          <h1 className="text-3xl font-black">Competition Admin</h1>
          <p className="mt-2 text-amber-50/60">Login with Google to continue.</p>
          <button onClick={signIn} className="mt-5 rounded-2xl bg-amber-300 px-5 py-3 font-black text-[#08111f]">
            Login with Google
          </button>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#000212] p-6 text-amber-50">
        <div className={panelClass}>
          <h1 className="text-3xl font-black">Admin access required</h1>
          <p className="mt-2 text-amber-50/60">Set this user role to admin in Supabase users table.</p>
          <button onClick={signOut} className="mt-5 rounded-2xl border border-amber-300/30 px-5 py-3 font-bold">
            Sign out
          </button>
        </div>
      </main>
    );
  }

  const quiz = live.quiz;

  const saveQuiz = async () => {
    try {
      const nextQuiz = await createQuiz(quizDraft.title, quizDraft.description, Number(quizDraft.timer) || 10);
      await loadQuizzes();
      setSelectedQuizId(nextQuiz.id);
      window.alert("Quiz created. Ab questions add karo.");
    } catch (error) {
      console.error(error);
      window.alert("Quiz create nahi hua. Admin role/schema check karo.");
    }
  };

  const saveQuestion = async () => {
    if (!selectedQuizId) {
      window.alert("Pehle quiz create/select karo.");
      return;
    }
    const options = questionDraft.options
      .map((text, index) => ({ text: text.trim(), isCorrect: index === questionDraft.correctIndex }))
      .filter((option) => option.text);
    if (!questionDraft.question.trim() || options.length < 2) {
      window.alert("Add question and at least 2 options.");
      return;
    }
    try {
      await createQuestionWithOptions(selectedQuizId, questionDraft.question, Number(questionDraft.timer) || 10, options);
      setQuestionDraft({ question: "", timer: quizDraft.timer, options: ["", "", "", ""], correctIndex: 0 });
      await loadSelectedQuestions(selectedQuizId);
      await live.reload();
    } catch (error) {
      console.error(error);
      window.alert("Question save nahi hua. Admin role/schema check karo.");
    }
  };

  return (
    <main className="min-h-screen bg-[#000212] p-4 text-amber-50 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col justify-between gap-4 rounded-3xl border border-amber-300/20 bg-white/[0.055] p-5 backdrop-blur lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">Live Quiz Admin</p>
            <h1 className="mt-1 text-4xl font-black">Raja Vidya Competition Console</h1>
            <p className="mt-2 text-amber-50/60">{profile.name} • Simple live quiz control</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/competition" className="rounded-2xl border border-amber-300/25 px-4 py-3 font-bold">Participant</a>
            <a href="/live-leaderboard" className="rounded-2xl border border-amber-300/25 px-4 py-3 font-bold">Live Screen</a>
            <button onClick={signOut} className="rounded-2xl border border-red-300/25 px-4 py-3 font-bold text-red-100">Sign out</button>
          </div>
        </header>

        <section className="mb-5 grid gap-3 md:grid-cols-3">
          <StepPill step="Step 1" label="Create/select quiz" />
          <StepPill step="Step 2" label="Add questions" />
          <StepPill step="Step 3" label="Start and press Next" />
        </section>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <section className={panelClass}>
            <h2 className="text-2xl font-black">Step 1: Quiz</h2>
            <div className="mt-4 grid gap-3">
              <input className={inputClass} value={quizDraft.title} onChange={(event) => setQuizDraft({ ...quizDraft, title: event.target.value })} />
              <input className={inputClass} value={quizDraft.description} onChange={(event) => setQuizDraft({ ...quizDraft, description: event.target.value })} />
              <input className={inputClass} value={quizDraft.timer} onChange={(event) => setQuizDraft({ ...quizDraft, timer: event.target.value })} />
              <button onClick={saveQuiz} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-300 px-5 py-3 font-black text-[#08111f]">
                <Plus size={18} /> Create Quiz
              </button>
            </div>

            <h2 className="mt-7 text-2xl font-black">Your Quizzes</h2>
            <p className="mt-1 text-sm text-amber-50/55">
              Jis quiz par kaam karna hai us card ko select karo.
            </p>
            <div className="mt-4 grid gap-3">
              {quizzes.length === 0 && (
                <p className="rounded-2xl border border-amber-300/15 bg-black/20 px-4 py-3 text-amber-50/60">
                  Abhi koi quiz nahi hai. Pehle Create Quiz dabao.
                </p>
              )}
              {quizzes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedQuizId(item.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    selectedQuizId === item.id
                      ? "border-amber-300 bg-amber-300/12"
                      : "border-amber-300/15 bg-black/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="block text-lg font-black text-white">{item.title}</span>
                  <span className="mt-1 block text-sm capitalize text-amber-50/55">
                    Status: {item.status}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className={panelClass}>
            <h2 className="text-2xl font-black">Step 2: Add Question</h2>
            <p className="mt-1 text-sm text-amber-50/55">
              Active quiz: <span className="font-bold text-amber-200">{selectedQuiz?.title ?? "No quiz selected"}</span>
            </p>
            {selectedQuizId && (
              <p className="mt-1 text-xs text-amber-50/40">
                Quiz ID: {selectedQuizId}
              </p>
            )}
            <div className="mt-4 grid gap-3">
              <textarea className={inputClass} rows={3} value={questionDraft.question} onChange={(event) => setQuestionDraft({ ...questionDraft, question: event.target.value })} placeholder="Question" />
              <input className={inputClass} value={questionDraft.timer} onChange={(event) => setQuestionDraft({ ...questionDraft, timer: event.target.value })} placeholder="Timer seconds" />
              {questionDraft.options.map((option, index) => (
                <label key={index} className="grid gap-2 rounded-2xl border border-amber-300/15 bg-black/20 p-3 sm:grid-cols-[auto_1fr] sm:items-center">
                  <input type="radio" checked={questionDraft.correctIndex === index} onChange={() => setQuestionDraft({ ...questionDraft, correctIndex: index })} className="size-5 accent-amber-400" />
                  <input className={inputClass} value={option} onChange={(event) => {
                    const options = [...questionDraft.options];
                    options[index] = event.target.value;
                    setQuestionDraft({ ...questionDraft, options });
                  }} placeholder={`Option ${index + 1}`} />
                </label>
              ))}
              <button onClick={saveQuestion} className="rounded-2xl bg-green-600 px-5 py-3 font-black text-white">Add Question</button>
            </div>
          </section>
        </div>

        {selectedQuiz && (
          <section className={`${panelClass} mt-5`}>
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black">Saved Questions</h2>
                <p className="text-sm text-amber-50/55">
                  {adminQuestions.length} question{adminQuestions.length === 1 ? "" : "s"} added in {selectedQuiz.title}
                </p>
                <p className={`mt-1 text-xs font-bold ${questionsStatus.includes("nahi") ? "text-red-200" : "text-amber-300"}`}>
                  {questionsStatus}
                </p>
              </div>
              <button
                type="button"
                onClick={() => loadSelectedQuestions()}
                className="rounded-2xl border border-amber-300/25 px-4 py-2 font-bold"
              >
                Refresh
              </button>
            </div>
            {adminQuestions.length === 0 ? (
              <p className="rounded-2xl border border-amber-300/15 bg-black/20 px-4 py-4 text-amber-50/60">
                Abhi question add nahi hua. Step 2 me question aur options fill karke Add Question dabao.
              </p>
            ) : (
              <div className="grid gap-3">
                {adminQuestions.map((question, index) => (
                  <div key={question.id} className="rounded-2xl border border-amber-300/15 bg-black/20 p-4">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
                      Question {index + 1} • {question.timerSeconds}s
                    </p>
                    <p className="mt-2 text-xl font-black text-white">{question.question}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {question.options.map((option) => (
                        <p
                          key={option.id}
                          className={`rounded-xl px-3 py-2 text-sm font-bold ${
                            option.isCorrect
                              ? "bg-green-500/15 text-green-100"
                              : "bg-white/[0.05] text-amber-50/75"
                          }`}
                        >
                          {option.optionText}
                          {option.isCorrect ? " ✓" : ""}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {quiz && (
          <section className={`${panelClass} mt-5`}>
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-3xl font-black">Step 3: Run Quiz</h2>
                <p className="mt-1 text-amber-50/60">Status: {quiz.status} • Question {quiz.currentQuestionIndex + 1}/{live.questions.length}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => startQuiz(quiz.id).then(live.reload).catch((error) => {
                  console.error(error);
                  window.alert("Start nahi hua. At least 1 question add karo.");
                })} className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 font-bold text-white"><Play size={18} /> Start</button>
                <button onClick={() => setQuizStatus(quiz, "paused").then(live.reload)} className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/25 px-4 py-3 font-bold"><Pause size={18} /> Pause</button>
                <button onClick={() => setQuizStatus(quiz, "active").then(live.reload)} className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/25 px-4 py-3 font-bold"><Play size={18} /> Resume</button>
                <button onClick={() => goToNextQuestion(quiz).then(live.reload)} className="inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-4 py-3 font-black text-[#08111f]"><SkipForward size={18} /> Next</button>
                <button onClick={() => setQuizStatus(quiz, "ended").then(live.reload)} className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white"><Square size={18} /> End</button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <AdminMetric label="Participants" value={live.stats.totalParticipants} />
              <AdminMetric label="Answers Submitted" value={live.stats.answersSubmitted} />
              <AdminMetric label="Pending Users" value={live.stats.pendingUsers} />
              <AdminMetric label="Correct Rate" value={`${live.stats.correctRate}%`} />
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <motion.div layout className="rounded-3xl border border-amber-300/15 bg-black/20 p-5">
                <h3 className="mb-3 flex items-center gap-2 text-xl font-black"><BarChart3 /> Current Question</h3>
                <p className="text-2xl font-black text-white">{live.activeQuestion?.question ?? "No active question"}</p>
                <div className="mt-4 grid gap-2">
                  {live.activeQuestion?.options.map((option) => (
                    <p key={option.id} className="rounded-2xl bg-white/[0.05] px-4 py-3">
                      {option.optionText} {option.isCorrect && <CheckCircle2 className="inline text-green-300" size={18} />}
                    </p>
                  ))}
                </div>
              </motion.div>
              <div className="rounded-3xl border border-amber-300/15 bg-black/20 p-5">
                <h3 className="mb-3 flex items-center gap-2 text-xl font-black"><Users /> Fastest Responders</h3>
                {live.stats.fastestResponders.map((entry) => (
                  <p key={entry.userId} className="flex justify-between rounded-2xl bg-white/[0.05] px-4 py-3">
                    <span>{entry.name}</span><span>{Math.round(entry.totalTimeMs / 1000)}s</span>
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
