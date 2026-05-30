import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock3, LogOut, Trophy } from "lucide-react";
import {
  joinQuiz,
  submitCompetitionAnswer,
  useCompetitionAuth,
  useLiveCompetition,
} from "../services/competition";

const panelClass = "rounded-3xl border border-amber-300/20 bg-white/[0.055] p-5 backdrop-blur";

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-amber-300/15 bg-black/20 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

export default function ParticipantCompetitionPage() {
  const { profile, isLoading, signIn, signOut } = useCompetitionAuth();
  const live = useLiveCompetition();
  const [hasJoined, setHasJoined] = useState(false);
  const [submittedQuestionId, setSubmittedQuestionId] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setSubmittedQuestionId(null);
    setSubmitStatus("");
  }, [live.activeQuestion?.id]);

  const secondsLeft = useMemo(() => {
    if (!live.quiz?.questionStartedAt || !live.activeQuestion) return live.quiz?.timerPerQuestion ?? 10;
    const elapsed = Math.floor((now - new Date(live.quiz.questionStartedAt).getTime()) / 1000);
    return Math.max(live.activeQuestion.timerSeconds - elapsed, 0);
  }, [live.activeQuestion, live.quiz?.questionStartedAt, live.quiz?.timerPerQuestion, now]);

  if (isLoading || live.isLoading) {
    return <main className="min-h-screen bg-[#000212] p-6 text-amber-50">Loading quiz...</main>;
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#000212] p-4 text-amber-50">
        <div className={`${panelClass} max-w-md text-center`}>
          <Trophy className="mx-auto text-amber-300" size={54} />
          <h1 className="mt-4 text-4xl font-black">Sunday Gita Quiz</h1>
          <p className="mt-2 text-amber-50/60">Login with Google to join the live competition.</p>
          <button onClick={signIn} className="mt-6 w-full rounded-2xl bg-amber-300 px-5 py-4 font-black text-[#08111f]">
            Login with Google
          </button>
        </div>
      </main>
    );
  }

  if (!live.quiz) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#000212] p-4 text-amber-50">
        <div className={panelClass}>No live quiz available.</div>
      </main>
    );
  }

  const join = async () => {
    try {
      await joinQuiz(live.quiz!.id);
      setHasJoined(true);
      await live.reload();
    } catch (error) {
      console.error(error);
      window.alert("Quiz join nahi ho paya. Please login/schema/admin setup check karein.");
    }
  };

  const submit = async (optionId: string) => {
    if (!live.quiz || !live.activeQuestion || submittedQuestionId === live.activeQuestion.id) return;
    setSubmittedQuestionId(live.activeQuestion.id);
    setSubmitStatus("Submitting...");
    try {
      await submitCompetitionAnswer(live.quiz.id, live.activeQuestion.id, optionId);
      setSubmitStatus("Answer Submitted ✓ Waiting for next question...");
      live.reload();
    } catch (error) {
      console.error(error);
      setSubmitStatus("Answer already submitted or quiz moved ahead.");
    }
  };

  const entry = live.myEntry;
  const remaining = live.remainingQuestions;
  const isJoined = hasJoined || Boolean(live.participant) || Boolean(entry);

  return (
    <main className="min-h-screen bg-[#000212] px-4 py-5 text-amber-50">
      <div className="mx-auto max-w-3xl">
        <header className="mb-5 flex items-center justify-between rounded-3xl border border-amber-300/20 bg-white/[0.055] p-4 backdrop-blur">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">Participant</p>
            <h1 className="text-2xl font-black">{profile.name}</h1>
          </div>
          <button onClick={signOut} className="rounded-2xl border border-amber-300/25 p-3"><LogOut size={18} /></button>
        </header>

        {!isJoined && (
          <section className={`${panelClass} text-center`}>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-amber-300">
              {live.quiz.status === "active" ? "Quiz is live" : "Ready to join"}
            </p>
            <h2 className="text-4xl font-black">{live.quiz.title}</h2>
            <p className="mt-2 text-amber-50/62">{live.quiz.description}</p>
            <button onClick={join} className="mt-6 w-full rounded-2xl bg-amber-300 px-5 py-4 font-black text-[#08111f]">
              Join Quiz
            </button>
            <p className="mt-3 text-sm text-amber-50/45">
              Join karne ke baad question admin ke start karte hi automatically aa jayega.
            </p>
          </section>
        )}

        {isJoined && live.quiz.status !== "active" && live.quiz.status !== "ended" && (
          <section className={`${panelClass} text-center`}>
            <Clock3 className="mx-auto text-amber-300" size={52} />
            <h2 className="mt-4 text-3xl font-black">You are joined</h2>
            <p className="mt-2 text-amber-50/62">Admin start karega to question yahi screen par aa jayega.</p>
          </section>
        )}

        {isJoined && live.quiz.status === "active" && live.activeQuestion && (
          <section className={panelClass}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-amber-300">
                  Question {live.quiz.currentQuestionIndex + 1}
                </p>
                <h2 className="mt-2 text-3xl font-black">{live.activeQuestion.question}</h2>
              </div>
              <div className="flex size-20 items-center justify-center rounded-full border-4 border-amber-300 text-2xl font-black">
                {secondsLeft}s
              </div>
            </div>

            <div className="grid gap-3">
              {live.activeQuestion.options.map((option) => (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  key={option.id}
                  type="button"
                  disabled={submittedQuestionId === live.activeQuestion?.id}
                  onClick={() => submit(option.id)}
                  className="rounded-2xl border border-amber-300/18 bg-white/[0.045] p-4 text-left text-lg font-bold transition hover:bg-amber-300/10 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {option.optionText}
                </motion.button>
              ))}
            </div>

            {submitStatus && (
              <p className="mt-4 rounded-2xl border border-green-300/20 bg-green-500/10 px-4 py-3 font-bold text-green-100">
                {submitStatus}
              </p>
            )}
          </section>
        )}

        {isJoined && live.quiz.status === "ended" && (
          <section className={`${panelClass} text-center`}>
            <Trophy className="mx-auto text-amber-300" size={64} />
            <h2 className="mt-4 text-4xl font-black">Quiz Completed</h2>
            <p className="mt-2 text-amber-50/62">Winners are shown on the live leaderboard.</p>
          </section>
        )}

        <section className="mt-5 grid grid-cols-2 gap-3">
          <StatTile label="Rank" value={entry?.rank ? `#${entry.rank}` : "-"} />
          <StatTile label="Score" value={entry?.score ?? 0} />
          <StatTile label="Correct" value={entry?.correctCount ?? 0} />
          <StatTile label="Wrong" value={entry?.wrongCount ?? 0} />
          <StatTile label="Attempted" value={entry?.attemptedCount ?? 0} />
          <StatTile label="Remaining" value={remaining} />
        </section>
      </div>
    </main>
  );
}
