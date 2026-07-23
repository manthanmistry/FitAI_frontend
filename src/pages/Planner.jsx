import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Download, RefreshCw, AlertTriangle } from "lucide-react";
import { TextField, SelectField, PillGroup, TextAreaField } from "../components/FormFields.jsx";
import StreamingIndicator from "../components/StreamingIndicator.jsx";
import { streamGeneratePlan, downloadReportUrl } from "../api/client.js";
import { saveLastSession } from "../hooks/useLastSession.js";

const initialForm = {
  name: "",
  age: 25,
  gender: "male",
  height_cm: 170,
  weight_kg: 70,
  target_weight_kg: 65,
  activity_level: "moderate",
  sleep_hours: 7,
  stress_level: "moderate",
  water_intake_l: 2,
  goal: "weight_loss",
  workout_experience: "beginner",
  workout_days_per_week: 4,
  workout_duration_min: 45,
  workout_location: "home",
  diet_type: "non_vegetarian",
  allergies: "",
  medical_conditions: "",
};

export default function Planner() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | loading | streaming | done | error
  const [planText, setPlanText] = useState("");
  const [meta, setMeta] = useState(null); // { calculations, plan_id, user_id }
  const [errorMsg, setErrorMsg] = useState("");

  const update = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };
  const updateNum = (key) => (e) => setForm((f) => ({ ...f, [key]: Number(e.target.value) }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setPlanText("");
    setMeta(null);
    setErrorMsg("");

    try {
      await streamGeneratePlan(form, {
        onMeta: (m) => {
          setMeta(m);
          setStatus("streaming");
          saveLastSession({ userId: m.user_id, planId: m.plan_id, name: form.name });
        },
        onChunk: (chunk) => setPlanText((prev) => prev + chunk),
        onError: (message) => {
          setErrorMsg(message);
          setStatus("error");
        },
        onDone: () => setStatus("done"),
      });
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong while generating your plan.");
      setStatus("error");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          AI Fitness Planner
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Fill in your details below. FitAI will calculate your metrics and generate
          a personalized workout and nutrition plan in real time.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-card p-6 sm:p-8 space-y-8"
        >
          <Section title="Personal Information">
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Name" required value={form.name} onChange={update("name")} placeholder="Jane Doe" />
              <TextField label="Age" type="number" min={13} max={100} required value={form.age} onChange={updateNum("age")} />
            </div>
            <PillGroup
              label="Gender"
              value={form.gender}
              onChange={(v) => setForm((f) => ({ ...f, gender: v }))}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />
          </Section>

          <Section title="Body Information">
            <div className="grid sm:grid-cols-3 gap-4">
              <TextField label="Height (cm)" type="number" min={50} max={250} required value={form.height_cm} onChange={updateNum("height_cm")} />
              <TextField label="Weight (kg)" type="number" min={20} max={300} required value={form.weight_kg} onChange={updateNum("weight_kg")} />
              <TextField label="Target Weight (kg)" type="number" min={20} max={300} required value={form.target_weight_kg} onChange={updateNum("target_weight_kg")} />
            </div>
          </Section>

          <Section title="Lifestyle">
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField
                label="Activity Level"
                value={form.activity_level}
                onChange={update("activity_level")}
                options={[
                  { value: "sedentary", label: "Sedentary (little/no exercise)" },
                  { value: "light", label: "Light (1-3 days/week)" },
                  { value: "moderate", label: "Moderate (3-5 days/week)" },
                  { value: "active", label: "Active (6-7 days/week)" },
                  { value: "very_active", label: "Very Active (athlete)" },
                ]}
              />
              <TextField label="Sleep Hours" type="number" min={0} max={24} step="0.5" value={form.sleep_hours} onChange={updateNum("sleep_hours")} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField
                label="Stress Level"
                value={form.stress_level}
                onChange={update("stress_level")}
                options={[
                  { value: "low", label: "Low" },
                  { value: "moderate", label: "Moderate" },
                  { value: "high", label: "High" },
                ]}
              />
              <TextField label="Daily Water Intake (L)" type="number" min={0} max={15} step="0.1" value={form.water_intake_l} onChange={updateNum("water_intake_l")} />
            </div>
          </Section>

          <Section title="Fitness Goals">
            <PillGroup
              label="Goal"
              value={form.goal}
              onChange={(v) => setForm((f) => ({ ...f, goal: v }))}
              options={[
                { value: "weight_loss", label: "Weight Loss" },
                { value: "muscle_gain", label: "Muscle Gain" },
                { value: "maintenance", label: "Maintenance" },
              ]}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField
                label="Workout Experience"
                value={form.workout_experience}
                onChange={update("workout_experience")}
                options={[
                  { value: "beginner", label: "Beginner" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" },
                ]}
              />
              <PillGroup
                label="Workout Location"
                value={form.workout_location}
                onChange={(v) => setForm((f) => ({ ...f, workout_location: v }))}
                options={[
                  { value: "home", label: "Home" },
                  { value: "gym", label: "Gym" },
                ]}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Workout Days / Week" type="number" min={1} max={7} value={form.workout_days_per_week} onChange={updateNum("workout_days_per_week")} />
              <TextField label="Workout Duration (min)" type="number" min={10} max={240} value={form.workout_duration_min} onChange={updateNum("workout_duration_min")} />
            </div>
          </Section>

          <Section title="Diet">
            <PillGroup
              label="Diet Type"
              value={form.diet_type}
              onChange={(v) => setForm((f) => ({ ...f, diet_type: v }))}
              options={[
                { value: "vegetarian", label: "Vegetarian" },
                { value: "vegan", label: "Vegan" },
                { value: "non_vegetarian", label: "Non-Vegetarian" },
                { value: "eggetarian", label: "Eggetarian" },
              ]}
            />
            <TextAreaField label="Food Allergies (optional)" value={form.allergies} onChange={update("allergies")} placeholder="e.g. peanuts, shellfish" />
            <TextAreaField label="Medical Conditions (optional)" value={form.medical_conditions} onChange={update("medical_conditions")} placeholder="e.g. type 2 diabetes" />
          </Section>

          <button
            type="submit"
            disabled={status === "loading" || status === "streaming"}
            className="w-full py-3.5 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold shadow-floating transition-colors"
          >
            {status === "loading" || status === "streaming" ? "Generating..." : "Generate My Plan"}
          </button>
        </form>

        {/* RESULT */}
        <div className="lg:sticky lg:top-24">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-14 text-center text-slate-400"
              >
                Your personalized plan will appear here once generated.
              </motion.div>
            )}

            {(status === "loading" || status === "streaming" || status === "done") && meta && (
              <motion.div
                key="metrics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                <Metric label="BMI" value={`${meta.calculations.bmi}`} sub={meta.calculations.bmi_category} />
                <Metric label="Calories" value={`${meta.calculations.daily_calories}`} sub="kcal/day" />
                <Metric label="Protein" value={`${meta.calculations.protein_g}g`} sub="daily" />
                <Metric label="Water" value={`${meta.calculations.water_l}L`} sub="daily" />
              </motion.div>
            )}

            {status === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 text-center">
                <RefreshCw className="mx-auto animate-spin text-brand-500 mb-3" size={28} />
                <p className="text-slate-500 dark:text-slate-400 text-sm">Calculating your metrics and contacting FitAI...</p>
              </motion.div>
            )}

            {(status === "streaming" || status === "done") && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-card p-6 sm:p-8"
              >
                {status === "streaming" && <StreamingIndicator />}
                {status === "done" && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">Plan ready ✅</span>
                    {meta?.plan_id && (
                      <a
                        href={downloadReportUrl(meta.plan_id)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-ocean-600 hover:bg-ocean-700 text-white transition-colors"
                      >
                        <Download size={16} /> Download PDF
                      </a>
                    )}
                  </div>
                )}
                <div className="prose-fitai max-h-[70vh] overflow-y-auto pr-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{planText}</ReactMarkdown>
                </div>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-8 text-center"
              >
                <AlertTriangle className="mx-auto text-red-500 mb-3" size={28} />
                <p className="text-red-700 dark:text-red-300 font-medium">{errorMsg}</p>
                <p className="text-xs text-red-500 mt-2">
                  Make sure the backend has a valid OPENAI_API_KEY configured.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="font-display font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Metric({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-display font-bold text-lg text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-brand-600 dark:text-brand-400">{sub}</p>
    </div>
  );
}
