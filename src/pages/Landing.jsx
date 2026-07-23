import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles, Salad, Dumbbell, LineChart, FileDown, Bell, ArrowRight,
} from "lucide-react";
import FeatureCard from "../components/FeatureCard.jsx";

const features = [
  {
    icon: Sparkles,
    title: "AI-Generated Plans",
    description: "GPT-powered workout schedules and 7-day meal plans tailored to your body, goal, and diet type.",
  },
  {
    icon: Salad,
    title: "Precise Nutrition Targets",
    description: "BMI, BMR, TDEE, and macronutrient breakdowns calculated with clinically-recognized formulas.",
  },
  {
    icon: Dumbbell,
    title: "Workouts For Home Or Gym",
    description: "Plans adapt to your experience level, available time, and whether you train at home or the gym.",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    description: "Log weight, workouts, and water intake, then watch your trends unfold on live charts.",
  },
  {
    icon: FileDown,
    title: "Downloadable Reports",
    description: "Export a polished PDF with your full plan and metrics to keep or share with a coach.",
  },
  {
    icon: Bell,
    title: "Daily Reminders",
    description: "Stay on track with reminders for workouts, water, meals, and sleep.",
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-ocean-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-200/40 dark:bg-brand-800/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-ocean-200/40 dark:bg-ocean-800/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6">
              <Sparkles size={14} /> Powered by AI
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight text-slate-900 dark:text-white">
              Your body, your goals —
              <span className="bg-gradient-to-r from-brand-600 to-ocean-600 bg-clip-text text-transparent"> a plan built just for you.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-xl">
              Tell FitAI about your body, lifestyle, and goals. In seconds, get a
              personalized workout schedule, 7-day meal plan, and the exact calorie
              and macro targets to hit your target weight.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-floating transition-colors"
              >
                Build My Plan <ArrowRight size={18} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:border-brand-400 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-floating p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-semibold text-slate-900 dark:text-white">Today's Targets</span>
                <span className="text-xs px-2 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">Weight Loss</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Calories", value: "2,050 kcal" },
                  { label: "Protein", value: "154 g" },
                  { label: "Water", value: "2.6 L" },
                  { label: "BMI", value: "23.4" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                    <p className="font-display font-bold text-lg text-slate-900 dark:text-white">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "68%" }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-brand-500 to-ocean-500"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">68% toward this week's workout goal</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
            Everything you need to reach your goal
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            One platform for planning, tracking, and staying accountable.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-ocean-600 p-10 sm:p-14 text-center shadow-floating">
          <h2 className="font-display text-3xl font-bold text-white">Ready for a plan built around you?</h2>
          <p className="mt-3 text-brand-50 max-w-xl mx-auto">
            It takes about two minutes to enter your details — FitAI does the rest.
          </p>
          <Link
            to="/planner"
            className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-brand-700 font-semibold hover:bg-brand-50 transition-colors"
          >
            Start Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
