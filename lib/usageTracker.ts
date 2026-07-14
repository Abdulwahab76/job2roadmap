// Usage tracking with localStorage + Supabase backup

type UsageData = {
  date: string; // YYYY-MM-DD
  anonymousCount: number; // Without login
  userCount: number; // With login
  totalGenerated: number;
  lastReset: string;
};

type UserTier = "free" | "pro" | "enterprise";

type UserSubscription = {
  tier: UserTier;
  dailyLimit: number;
  unlimited: boolean;
  expiresAt?: string;
};

const STORAGE_KEY = "job2roadmap_usage";
const ANONYMOUS_LIMIT = 1;
const FREE_USER_LIMIT = 30;
const PRO_USER_LIMIT = Infinity;

// Get today's date as string
export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

// Get usage data from localStorage
export function getUsageData(): UsageData {
  if (typeof window === "undefined") {
    return {
      date: getToday(),
      anonymousCount: 0,
      userCount: 0,
      totalGenerated: 0,
      lastReset: getToday(),
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial: UsageData = {
      date: getToday(),
      anonymousCount: 0,
      userCount: 0,
      totalGenerated: 0,
      lastReset: getToday(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  const data: UsageData = JSON.parse(stored);

  // Check if we need to reset for new day
  if (data.date !== getToday()) {
    const reset: UsageData = {
      date: getToday(),
      anonymousCount: 0,
      userCount: 0,
      totalGenerated: 0,
      lastReset: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
    return reset;
  }

  return data;
}

// Save usage data
export function saveUsageData(data: UsageData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

// Increment usage counter
export function incrementUsage(isAuthenticated: boolean): void {
  const data = getUsageData();

  if (isAuthenticated) {
    data.userCount++;
  } else {
    data.anonymousCount++;
  }
  data.totalGenerated++;

  saveUsageData(data);
}

// Check if user can generate
export function canGenerate(
  isAuthenticated: boolean,
  userTier: UserTier = "free"
): {
  canGenerate: boolean;
  remainingToday: number;
  dailyLimit: number;
  message: string;
  tier: UserTier;
} {
  const data = getUsageData();

  // Pro users always can generate
  if (userTier === "pro" || userTier === "enterprise") {
    return {
      canGenerate: true,
      remainingToday: Infinity,
      dailyLimit: Infinity,
      message: "Unlimited generations available",
      tier: userTier,
    };
  }

  if (isAuthenticated) {
    const remaining = FREE_USER_LIMIT - data.userCount;
    const canGen = remaining > 0;

    return {
      canGenerate: canGen,
      remainingToday: Math.max(0, remaining),
      dailyLimit: FREE_USER_LIMIT,
      message: canGen
        ? `${remaining} generations remaining today`
        : "Daily limit reached. Upgrade to Pro for unlimited access!",
      tier: "free",
    };
  } else {
    const remaining = ANONYMOUS_LIMIT - data.anonymousCount;
    const canGen = remaining > 0;

    return {
      canGenerate: canGen,
      remainingToday: Math.max(0, remaining),
      dailyLimit: ANONYMOUS_LIMIT,
      message: canGen
        ? `${remaining} free generation remaining. Sign in for ${FREE_USER_LIMIT} more!`
        : "Free limit reached. Sign in for more or upgrade to Pro!",
      tier: "free",
    };
  }
}

// Get remaining generations
export function getRemainingGenerations(
  isAuthenticated: boolean,
  userTier: UserTier = "free"
): number {
  const { remainingToday } = canGenerate(isAuthenticated, userTier);
  return remainingToday;
}

// Format time until reset
export function getTimeUntilReset(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}

// Get subscription tier
export function getUserTier(subscription?: UserSubscription | null): UserTier {
  if (!subscription) return "free";

  // Check if subscription is expired
  if (subscription.expiresAt && new Date(subscription.expiresAt) < new Date()) {
    return "free";
  }

  return subscription.tier;
}
