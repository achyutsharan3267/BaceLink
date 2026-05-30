import { motion } from "framer-motion";
import { Crown, Medal, Pause, Play, SkipForward, Square, Trophy } from "lucide-react";
import { goToNextQuestion, setQuizStatus, startQuiz, useCompetitionAuth, useLiveCompetition } from "../services/competition";

const panelClass = "rounded-3xl border border-amber-300/20 bg-white/[0.055] p-5 backdrop-blur";

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="text-amber-300" size={34} />;
  if (rank === 2) return <Medal className="text-slate-200" size={30} />;
  if (rank === 3) return <Medal className="text-orange-300" size={30} />;
  return <span className="text-xl font-black text-amber-100">#{rank}</span>;
}

export default function LiveLeaderboardPage() {
  const { isAdmin } = useCompetitionAuth();
  const live = useLiveCompetition();
  const quiz = live.quiz;

  return (
    <main className="min-h-screen bg-[#000212] p-5 text-amber-50">
      <div className="grid min-h-[calc(100vh-2.5rem)] gap-5 xl:grid-cols-[0.85fr_1.3fr_0.85fr]">
        <section className={panelClass}>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">Current Question</p>
          <h1 className="mt-4 text-4xl font-black">{quiz?.title ?? "Raja Vidya Quiz"}</h1>
          <p className="mt-4 text-2xl font-bold text-white/86">{live.activeQuestion?.question ?? "Waiting for admin..."}</p>
          <div className="mt-8 rounded-3xl border border-amber-300/20 bg-black/25 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-300">Progress</p>
            <p className="mt-2 text-5xl font-black">{quiz ? quiz.currentQuestionIndex + 1 : 0}/{live.questions.length}</p>
          </div>
          <div className="mt-5 rounded-3xl border border-amber-300/20 bg-black/25 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-300">Status</p>
            <p className="mt-2 text-4xl font-black capitalize">{quiz?.status ?? "offline"}</p>
          </div>
        </section>

        <section className={panelClass}>
          <div className="mb-5 flex items-center justify-center gap-3">
            <Trophy className="text-amber-300" size={40} />
            <h2 className="text-5xl font-black">Live Leaderboard</h2>
          </div>
          <div className="grid gap-3">
            {live.leaderboard.slice(0, 10).map((entry) => (
              <motion.div
                layout
                key={entry.userId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between rounded-3xl border p-4 ${
                  entry.rank <= 3
                    ? "border-amber-300/45 bg-amber-300/10 shadow-[0_0_28px_rgba(245,178,57,0.14)]"
                    : "border-amber-300/15 bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <RankIcon rank={entry.rank} />
                  <div>
                    <p className="text-2xl font-black">{entry.name}</p>
                    <p className="text-sm text-amber-50/55">{entry.correctCount} correct • {entry.wrongCount} wrong</p>
                  </div>
                </div>
                <motion.p layout className="text-4xl font-black text-amber-200">{entry.score}</motion.p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className={panelClass}>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">Statistics</p>
          <div className="mt-5 grid gap-3">
            {[
              ["Participants", live.stats.totalParticipants],
              ["Submitted", live.stats.answersSubmitted],
              ["Pending", live.stats.pendingUsers],
              ["Correct Rate", `${live.stats.correctRate}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-black/25 p-4">
                <p className="text-sm text-amber-300">{label}</p>
                <p className="text-3xl font-black">{value}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-7 text-2xl font-black">Fastest Responders</h3>
          <div className="mt-3 grid gap-2">
            {live.stats.fastestResponders.map((entry) => (
              <p key={entry.userId} className="flex justify-between rounded-2xl bg-white/[0.045] px-4 py-3">
                <span>{entry.name}</span><span>{Math.round(entry.totalTimeMs / 1000)}s</span>
              </p>
            ))}
          </div>

          {quiz && isAdmin && (
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button onClick={() => startQuiz(quiz.id).then(live.reload)} className="rounded-2xl bg-green-600 px-4 py-3 font-bold"><Play className="inline" size={17} /> Start</button>
              <button onClick={() => setQuizStatus(quiz, "paused").then(live.reload)} className="rounded-2xl border border-amber-300/25 px-4 py-3 font-bold"><Pause className="inline" size={17} /> Pause</button>
              <button onClick={() => goToNextQuestion(quiz).then(live.reload)} className="rounded-2xl bg-amber-300 px-4 py-3 font-black text-[#08111f]"><SkipForward className="inline" size={17} /> Next</button>
              <button onClick={() => setQuizStatus(quiz, "ended").then(live.reload)} className="rounded-2xl bg-red-600 px-4 py-3 font-bold"><Square className="inline" size={17} /> End</button>
            </div>
          )}
          {quiz && !isAdmin && (
            <p className="mt-7 rounded-2xl border border-amber-300/15 bg-black/25 px-4 py-3 text-sm font-bold text-amber-50/60">
              Public screen mode. Admin controls are hidden.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
