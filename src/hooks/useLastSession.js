import { useEffect, useState } from "react";

const KEY = "fitai-last-session";

export function saveLastSession({ userId, planId, name }) {
  localStorage.setItem(KEY, JSON.stringify({ userId, planId, name }));
}

export function useLastSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch {
        setSession(null);
      }
    }
  }, []);

  return session;
}
