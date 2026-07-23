import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Download, Flame, Droplets, Ruler, TrendingUp, ArrowRight } from "lucide-react";
import { useLastSession } from "../hooks/useLastSession.js";
import { getHistory, downloadReportUrl } from "../api/client.js";

export default function Dashboard() {
  const session = useLastSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.userId) {
      setLoading(false);
      return;
    }
    getHistory(session.userId)
      .then(setData)
      .catch((e) => setError(e.response?.data?.detail || "Could not load your dashboard."))
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) {
    return <CenteredMessage>Loading your dashboard...</CenteredMessage>;
  }

  if (!session?.userId) {
    return (
      <CenteredMessage>
        <p className="mb-4">You haven't generated a plan yet.</p>
        <Link
          to="/planner"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors"
        >
          Create Your First Plan <ArrowRight size={16} />
        </Link>
      </CenteredMessage>
    );
  }

  if (error) return <CenteredMessage>{error}</CenteredMessage>;

  const latestPlan = data?.plans?.[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back, {data?.user?.name} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here's a snapshot of your current plan and goals.
        </p>
      </motion.div>

      {latestPlan && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <StatCard icon={Ruler} label="BMI" value={latestPlan.bmi} sub={latestPlan.bmi_category} color="brand" />
          <StatCard icon={Flame} label="Daily Calories" value={`${latestPlan.daily_calories}`} sub="kcal target" color="ocean" />
          <StatCard icon={TrendingUp} label="Goal" value={data.user.goal.replace("_", " ")} sub="capitalize" color="brand" />
          <StatCard icon={Droplets} label="Diet" value={data.user.diet_type.replace("_", " ")} sub="preference" color="ocean" />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mt-10">
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white">
              Latest Plan
            </h2>
            {latestPlan && (
              <a
                href={downloadReportUrl(latestPlan.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-ocean-600 hover:bg-ocean-700 text-white transition-colors"
              >
                <Download size={14} /> PDF
              </a>
            )}
          </div>
          {latestPlan ? (
            <div className="prose-fitai max-h-[420px] overflow-y-auto pr-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{latestPlan.content_markdown || "Generating..."}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-slate-400">No plan yet.</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-ocean-600 p-6 text-white shadow-floating">
            <h3 className="font-display font-semibold mb-2">Track Today</h3>
            <p className="text-sm text-brand-50 mb-4">Log your weight, water, and workouts to see your trends.</p>
            <Link
              to="/progress"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-brand-700 text-sm font-semibold hover:bg-brand-50 transition-colors"
            >
              Go to Progress <ArrowRight size={14} />
            </Link>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-card p-6">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-3">Plan History</h3>
            <ul className="space-y-2 text-sm">
              {data?.plans?.map((p) => (
                <li key={p.id} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                  <a href={downloadReportUrl(p.id)} className="text-brand-600 hover:underline text-xs font-semibold">
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  const colorMap = {
    brand: "from-brand-100 to-brand-50 text-brand-600 dark:from-brand-900/40 dark:to-brand-900/10 dark:text-brand-300",
    ocean: "from-ocean-100 to-ocean-50 text-ocean-600 dark:from-ocean-900/40 dark:to-ocean-900/10 dark:text-ocean-300",
  };
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-card p-5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 ${colorMap[color]}`}>
        <Icon size={18} />
      </div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize">{value}</p>
      <p className="text-xs text-slate-400 capitalize">{sub}</p>
    </div>
  );
}

function CenteredMessage({ children }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center text-slate-500 dark:text-slate-400">
      {children}
    </div>
  );
}
