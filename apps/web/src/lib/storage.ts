const COMPLETED_KEY = "s2s_completed";

export function markSessionComplete(id: number): void {
  if (typeof window === "undefined") return;
  try {
    const data = getCompletedData();
    data[id] = {
      completed: true,
      lastPlayed: new Date().toISOString(),
      count: (data[id]?.count ?? 0) + 1,
    };
    window.localStorage.setItem(COMPLETED_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function getCompletedSessions(): number[] {
  const data = getCompletedData();
  return Object.keys(data)
    .map(Number)
    .filter((id) => data[id]?.completed)
    .sort((a, b) => a - b);
}

export function getSessionProgress(id: number): {
  completed: boolean;
  lastPlayed?: string;
  count: number;
} {
  const data = getCompletedData();
  const entry = data[id];
  if (!entry) return { completed: false, count: 0 };
  return {
    completed: entry.completed,
    lastPlayed: entry.lastPlayed,
    count: entry.count,
  };
}

type SessionEntry = {
  completed: boolean;
  lastPlayed?: string;
  count: number;
};

function getCompletedData(): Record<number, SessionEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(COMPLETED_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
