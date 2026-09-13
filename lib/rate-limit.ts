import { InterviewMode, UserRole } from "./types";

interface DailyUsageRecord {
  date: string; // YYYY-MM-DD
  count: number;
}

const STORAGE_KEY = "crack-it-daily-usage";
const ROLE_STORAGE_KEY = "crack-it-user-role";
const FREE_TIER_DAILY_LIMIT = 1;

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function getDailyRecord(): DailyUsageRecord {
  if (typeof window === "undefined") {
    return { date: getTodayString(), count: 0 };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: getTodayString(), count: 0 };
    const parsed: DailyUsageRecord = JSON.parse(raw);
    const today = getTodayString();
    if (parsed.date !== today) {
      // New day, reset count
      return { date: today, count: 0 };
    }
    return parsed;
  } catch (_) {
    return { date: getTodayString(), count: 0 };
  }
}

export function getUserRole(): UserRole {
  if (typeof window === "undefined") return "free";
  try {
    const role = localStorage.getItem(ROLE_STORAGE_KEY);
    return role === "pro" ? "pro" : "free";
  } catch (_) {
    return "free";
  }
}

export function setUserRole(role: UserRole): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch (_) {}
}

export function checkDailyAllowance(
  hasCustomApiKey: boolean,
  mode: InterviewMode,
  userRole: UserRole = getUserRole()
): {
  allowed: boolean;
  remaining: number;
  limit: number;
  isUnlimited: boolean;
  reason?: string;
} {
  // Offline practice is always unlimited
  if (mode === "offline") {
    return {
      allowed: true,
      remaining: 999,
      limit: 999,
      isUnlimited: true,
    };
  }

  // BYOK (User supplied their own Gemini key) is completely unlimited!
  if (hasCustomApiKey) {
    return {
      allowed: true,
      remaining: 999,
      limit: 999,
      isUnlimited: true,
      reason: "Unlimited (Your Gemini API Key Active)",
    };
  }

  // Pro tier is unlimited
  if (userRole === "pro") {
    return {
      allowed: true,
      remaining: 999,
      limit: 999,
      isUnlimited: true,
      reason: "Unlimited (Pro Tier Active)",
    };
  }

  // Free tier: 1 mock per day
  const record = getDailyRecord();
  const remaining = Math.max(0, FREE_TIER_DAILY_LIMIT - record.count);

  if (remaining <= 0) {
    return {
      allowed: false,
      remaining: 0,
      limit: FREE_TIER_DAILY_LIMIT,
      isUnlimited: false,
      reason:
        "You've reached your free limit of 1 mock interview today. Add your own free Google Gemini API key or switch to Offline Mode for unlimited mocks!",
    };
  }

  return {
    allowed: true,
    remaining,
    limit: FREE_TIER_DAILY_LIMIT,
    isUnlimited: false,
    reason: `Free Tier: ${remaining} of ${FREE_TIER_DAILY_LIMIT} mock remaining today`,
  };
}

export function recordMockStarted(): void {
  if (typeof window === "undefined") return;
  try {
    const today = getTodayString();
    const current = getDailyRecord();
    const nextCount = current.date === today ? current.count + 1 : 1;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: today, count: nextCount })
    );
  } catch (_) {}
}

