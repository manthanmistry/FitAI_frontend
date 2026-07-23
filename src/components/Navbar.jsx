import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, Dumbbell } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/planner", label: "AI Planner" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/progress", label: "Progress" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-slate-900 dark:text-white">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-ocean-500 flex items-center justify-center text-white">
            <Dumbbell size={18} />
          </span>
          FitNova
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                    : "text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9, rotate: 15 }}
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          <Link
            to="/planner"
            className="hidden sm:inline-flex px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-card transition-colors"
          >
            Get My Plan
          </Link>
        </div>
      </div>
    </header>
  );
}
