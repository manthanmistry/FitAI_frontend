import { motion } from "framer-motion";

export default function StreamingIndicator({ label = "FitAI is generating your plan" }) {
  return (
    <div className="flex items-center gap-3 text-sm text-brand-700 dark:text-brand-300 font-medium">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-brand-500"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <span>{label}</span>
      <span className="inline-block w-2 border-r-2 border-brand-500 animate-blink h-4" />
    </div>
  );
}
