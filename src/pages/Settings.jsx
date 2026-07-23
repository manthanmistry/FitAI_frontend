import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Bell, Droplets, Dumbbell, Utensils, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

const REMINDER_KEY = "fitai-reminders";
const defaultReminders = { workout: true, water: true, meals: true, sleep: false };

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [reminders, setReminders] = useState(defaultReminders);

  useEffect(() => {
    const saved = localStorage.getItem(REMINDER_KEY);
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  function toggleReminder(key) {
    setReminders((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(REMINDER_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearLocalData() {
    localStorage.removeItem("fitai-last-session");
    localStorage.removeItem(REMINDER_KEY);
    window.location.reload();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14 space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Customize your FitAI experience.</p>
      </motion.div>

      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-card p-6">
        <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
              <p className="text-xs text-slate-400">Switch between light and dark themes</p>
            </div>
          </div>
          <Toggle checked={theme === "dark"} onChange={toggleTheme} />
        </div>
      </section>

      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-brand-600 dark:text-brand-300" />
          <h2 className="font-display font-semibold text-slate-900 dark:text-white">Reminders</h2>
        </div>
        <div className="space-y-4">
          <ReminderRow icon={Dumbbell} label="Workout Reminders" checked={reminders.workout} onChange={() => toggleReminder("workout")} />
          <ReminderRow icon={Droplets} label="Water Reminders" checked={reminders.water} onChange={() => toggleReminder("water")} />
          <ReminderRow icon={Utensils} label="Meal Reminders" checked={reminders.meals} onChange={() => toggleReminder("meals")} />
          <ReminderRow icon={Moon} label="Sleep Reminders" checked={reminders.sleep} onChange={() => toggleReminder("sleep")} />
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Reminder preferences are saved to this browser. Enable notifications in your OS/browser to receive them.
        </p>
      </section>

      <section className="rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-red-700 dark:text-red-300">Clear local data</p>
            <p className="text-xs text-red-500 dark:text-red-400">Removes your saved session and preferences from this browser.</p>
          </div>
          <button
            onClick={clearLocalData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </section>
    </div>
  );
}

function ReminderRow({ icon: Icon, label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-slate-400" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${
        checked ? "bg-brand-600 justify-end" : "bg-slate-200 dark:bg-slate-700 justify-start"
      }`}
    >
      <motion.span layout className="w-5 h-5 rounded-full bg-white shadow" />
    </button>
  );
}
