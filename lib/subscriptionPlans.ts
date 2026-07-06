export type PlanFeature = {
  text: string;
  included: boolean;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  period: "month" | "year";
  dailyLimit: number | "unlimited";
  features: PlanFeature[];
  highlighted: boolean;
  cta: string;
  priceId?: string; // Stripe price ID
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "month",
    dailyLimit: 3,
    highlighted: false,
    cta: "Get Started",
    features: [
      { text: "3 roadmaps per day", included: true },
      { text: "Local templates", included: true },
      { text: "Basic AI generation", included: true },
      { text: "Progress tracking", included: true },
      { text: "Export roadmap", included: false },
      { text: "Priority AI generation", included: false },
      { text: "Unlimited roadmaps", included: false },
      { text: "Custom templates", included: false },
      { text: "Team collaboration", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    period: "month",
    dailyLimit: "unlimited",
    highlighted: true,
    cta: "Upgrade to Pro",
    priceId: "price_pro_monthly", // Replace with actual Stripe price ID
    features: [
      { text: "Unlimited roadmaps", included: true },
      { text: "Local templates", included: true },
      { text: "Advanced AI generation", included: true },
      { text: "Progress tracking", included: true },
      { text: "Export roadmap (PDF, JSON)", included: true },
      { text: "Priority AI generation", included: true },
      { text: "Custom templates", included: true },
      { text: "Team collaboration", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 29.99,
    period: "month",
    dailyLimit: "unlimited",
    highlighted: false,
    cta: "Contact Sales",
    features: [
      { text: "Unlimited roadmaps", included: true },
      { text: "Local templates", included: true },
      { text: "Advanced AI generation", included: true },
      { text: "Progress tracking", included: true },
      { text: "Export roadmap (PDF, JSON)", included: true },
      { text: "Priority AI generation", included: true },
      { text: "Custom templates", included: true },
      { text: "Team collaboration", included: true },
      { text: "API access", included: true },
    ],
  },
];

export const ANONYMOUS_LIMIT = 1;
export const FREE_USER_LIMIT = 3;
export const PRO_LIMIT = Infinity;
