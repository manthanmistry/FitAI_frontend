import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Scale, Dumbbell, Droplets, Flame, ArrowRight } from "lucide-react";
import { useLastSession } from "../hooks/useLastSession.js";
import { getProgress, logWeight, logWorkout, logWater } from "../api/client.js";

export default function Progress() {
  const session = useLastSession();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [weightInput, setWeightInput] = useState("");
  const [waterInput, setWaterInput] = useState("");
  const [workoutActivity, setWorkoutActivity] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");

  async function refresh() {
    if (!session?.userId) return;
    const data = await getProgress(session.userId);
    setProgress(data);
  }

  useEffect(() => {
    if (!session?.userId) {
      setLoading(false);
      return;
    }
    refresh().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (loading) {
    return <Centered>Loading your progress...</Centered>;
  }

  if (!session?.userId) {
    return (
      <Centered>
        <p className="mb-4">Generate a plan first to start tracking your progress.</p>
        <Link to="/planner" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors">
          Create a Plan <ArrowRight size={16} />
        </Link>
      </Centered>
    );
  }

  const weightData = (progress?.weight_logs || []).map((w) => ({
    date: new Date(w.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    weight: w.weight_kg,
    bmi: w.bmi,
  }));

  async function handleLogWeight(e) {
    e.preventDefault();
    if (!weightInput) return;
    setBusy(true);
    try {
      await logWeight(session.userId, Number(weightInput));
      setWeightInput("");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleLogWater(e) {
    e.preventDefault();
    if (!waterInput) return;
    setBusy(true);
    try {
      await logWater(session.userId, Number(waterInput));
      setWaterInput("");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleLogWorkout(e) {
    e.preventDefault();
    if (!workoutActivity || !workoutDuration) return;
    setBusy(true);
    try {
      await logWorkout(session.userId, workoutActivity, Number(workoutDuration));
      setWorkoutActivity("");
      setWorkoutDuration("");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Progress Tracker</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Log your daily numbers and watch your trends take shape.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center"><Dumbbell size={18} /></div>
          <div>
            <p className="text-xs text-slate-400">Workout Streak</p>
            <p className="font-display font-bold text-lg text-slate-900 dark:text-white">{progress?.workout_streak_days || 0} days</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ocean-100 dark:bg-ocean-900/40 text-ocean-600 dark:text-ocean-300 flex items-center justify-center"><Scale size={18} /></div>
          <div>
            <p className="text-xs text-slate-400">Weight Entries</p>
            <p className="font-display font-bold text-lg text-slate-900 dark:text-white">{progress?.weight_logs?.length || 0}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center"><Droplets size={18} /></div>
          <div>
            <p className="text-xs text-slate-400">Water Logs</p>
            <p className="font-display font-bold text-lg text-slate-900 dark:text-white">{progress?.water_logs?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-card p-6">
          <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Weight Trend</h2>
          {weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" fontSize={12} stroke="#94a3b8" />
                <YAxis fontSize={12} stroke="#94a3b8" domain={["auto", "auto"]} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#14975b" strokeWidth={2.5} dot={{ r: 3 }} name="Weight (kg)" />
                <Line type="monotone" dataKey="bmi" stroke="#1c67f0" strokeWidth={2} dot={{ r: 3 }} name="BMI" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-sm py-16 text-center">Log your weight to see the trend here.</p>
          )}
        </div>

        <div className="space-y-4">
          <LogForm title="Log Weight" icon={Scale} onSubmit={handleLogWeight} busy={busy}>
            <input
              type="number" step="0.1" placeholder="Weight (kg)"
              value={weightInput} onChange={(e) => setWeightInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </LogForm>

          <LogForm title="Log Water" icon={Droplets} onSubmit={handleLogWater} busy={busy}>
            <input
              type="number" step="0.1" placeholder="Amount (L)"
              value={waterInput} onChange={(e) => setWaterInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </LogForm>

          <LogForm title="Log Workout" icon={Flame} onSubmit={handleLogWorkout} busy={busy}>
            <input
              type="text" placeholder="Activity (e.g. Running)"
              value={workoutActivity} onChange={(e) => setWorkoutActivity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="number" placeholder="Duration (min)"
              value={workoutDuration} onChange={(e) => setWorkoutDuration(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mt-2"
            />
          </LogForm>
        </div>
      </div>
    </div>
  );
}

function LogForm({ title, icon: Icon, onSubmit, busy, children }) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-brand-600 dark:text-brand-300" />
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{title}</h3>
      </div>
      {children}
      <button
        type="submit"
        disabled={busy}
        className="mt-3 w-full py-2 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
      >
        Save
      </button>
    </form>
  );
}

function Centered({ children }) {
  return <div className="max-w-2xl mx-auto px-6 py-24 text-center text-slate-500 dark:text-slate-400">{children}</div>;
}
