import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export async function calculateHealth(profile) {
  const { data } = await api.post("/calculate", profile);
  return data;
}

export async function getHistory(userId) {
  const { data } = await api.get("/history", { params: { user_id: userId } });
  return data;
}

export async function getProgress(userId) {
  const { data } = await api.get("/progress", { params: { user_id: userId } });
  return data;
}

export async function logWeight(userId, weightKg) {
  const { data } = await api.post("/progress/weight", { user_id: userId, weight_kg: weightKg });
  return data;
}

export async function logWorkout(userId, activity, durationMin, caloriesBurned = 0) {
  const { data } = await api.post("/progress/workout", {
    user_id: userId,
    activity,
    duration_min: durationMin,
    calories_burned: caloriesBurned,
  });
  return data;
}

export async function logWater(userId, amountL) {
  const { data } = await api.post("/progress/water", { user_id: userId, amount_l: amountL });
  return data;
}

export function downloadReportUrl(planId) {
  return `${API_BASE}/download-report?plan_id=${planId}`;
}

/**
 * Streams a generated plan from the backend using fetch + ReadableStream
 * (Server-Sent-Events style "data: {...}\n\n" framing).
 *
 * callbacks: { onMeta, onChunk, onError, onDone }
 */
export async function streamGeneratePlan(profile, callbacks = {}) {
  const response = await fetch(`${API_BASE}/generate-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to start plan generation");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const evt of events) {
      const line = evt.trim();
      if (!line.startsWith("data:")) continue;
      const jsonStr = line.slice(5).trim();
      if (!jsonStr) continue;

      let payload;
      try {
        payload = JSON.parse(jsonStr);
      } catch {
        continue;
      }

      if (payload.type === "meta") callbacks.onMeta?.(payload);
      else if (payload.type === "chunk") callbacks.onChunk?.(payload.content);
      else if (payload.type === "error") callbacks.onError?.(payload.message);
      else if (payload.type === "done") callbacks.onDone?.();
    }
  }
}
