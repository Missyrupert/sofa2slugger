const UNLOCK_KEY = "s2s_unlocked";
const PREMIUM_ACCESS_KEY = "s2s_premium_access";
const FULL_ACCESS_KEY = "s2s_full_access";
const COMPLETED_KEY = "s2s_completed";
const SESSION1_TEASER_KEY = "s2s_session1_teaser_seen";

export function hasUnlockedAll(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      window.localStorage.getItem(UNLOCK_KEY) === "true" ||
      window.localStorage.getItem(PREMIUM_ACCESS_KEY) === "true" ||
      window.localStorage.getItem(FULL_ACCESS_KEY) === "true"
    );
  } catch {
    return false;
  }
}

export function unlockAllSessions(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(UNLOCK_KEY, "true");
    window.localStorage.setItem(PREMIUM_ACCESS_KEY, "true");
    window.localStorage.setItem(FULL_ACCESS_KEY, "true");
  } catch {
    /* ignore */
  }
}

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

export function hasSeenSession1Teaser(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SESSION1_TEASER_KEY) === "true";
  } catch {
    return false;
  }
}

export function markSession1TeaserSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION1_TEASER_KEY, "true");
  } catch {
    /* ignore */
  }
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
