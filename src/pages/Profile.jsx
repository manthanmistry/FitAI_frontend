import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, ArrowRight, RefreshCw } from "lucide-react";
import { useLastSession } from "../hooks/useLastSession.js";
import { getHistory } from "../api/client.js";

export default function Profile() {
  const session = useLastSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.userId) {
      setLoading(false);
      return;
    }
    getHistory(session.userId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) return <Centered><RefreshCw className="mx-auto animate-spin text-brand-500" /></Centered>;

  if (!session?.userId) {
    return (
      <Centered>
        <p className="mb-4">No profile yet — generate a plan to create one.</p>
        <Link to="/planner" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors">
          Create a Plan <ArrowRight size={16} />
        </Link>
      </Centered>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-card p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-ocean-500 flex items-center justify-center text-white">
            <User size={28} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{data?.user?.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">FitAI Member</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <InfoRow label="Primary Goal" value={data?.user?.goal?.replace("_", " ")} />
          <InfoRow label="Diet Type" value={data?.user?.diet_type?.replace("_", " ")} />
          <InfoRow label="Plans Generated" value={data?.plans?.length ?? 0} />
          <InfoRow label="User ID" value={`#${data?.user?.id}`} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/planner" className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors">
            Generate New Plan
          </Link>
          <Link to="/dashboard" className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors">
            View Dashboard
          </Link>
        </div>
      </motion.div>

      <p className="text-xs text-slate-400 mt-4 text-center">
        FitAI doesn't use accounts or passwords in this demo — your profile is linked to this browser only.
      </p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-semibold text-slate-900 dark:text-white capitalize">{value}</p>
    </div>
  );
}

function Centered({ children }) {
  return <div className="max-w-2xl mx-auto px-6 py-24 text-center text-slate-500 dark:text-slate-400">{children}</div>;
}
