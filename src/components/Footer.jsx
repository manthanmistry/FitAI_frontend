import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-slate-900 dark:text-white mb-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-ocean-500 flex items-center justify-center text-white">
              <Dumbbell size={16} />
            </span>
            FitAI
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
            AI-generated workout and nutrition plans. General wellness guidance only —
            not a substitute for professional medical advice.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/planner" className="hover:text-brand-600">AI Planner</Link></li>
            <li><Link to="/dashboard" className="hover:text-brand-600">Dashboard</Link></li>
            <li><Link to="/progress" className="hover:text-brand-600">Progress Tracker</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/profile" className="hover:text-brand-600">Profile</Link></li>
            <li><Link to="/settings" className="hover:text-brand-600">Settings</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-800 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} FitAI. Built as a capstone demo project.
      </div>
    </footer>
  );
}
