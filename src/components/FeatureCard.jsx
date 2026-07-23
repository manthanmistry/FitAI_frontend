import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-card"
    >
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-100 to-ocean-100 dark:from-brand-900/40 dark:to-ocean-900/40 flex items-center justify-center text-brand-600 dark:text-brand-300 mb-4">
        <Icon size={20} />
      </div>
      <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
