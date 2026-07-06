"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { canGenerate, getTimeUntilReset } from "@/lib/usageTracker";
import { AlertTriangle, Clock, Crown, LogIn, Zap } from "lucide-react";
import { signInWithGoogle } from "@/lib/firebase";
import Link from "next/link";

type UsageLimitProps = {
  variant?: "inline" | "card" | "modal";
  onClose?: () => void;
};

export default function UsageLimit({
  variant = "inline",
  onClose,
}: UsageLimitProps) {
  const { user } = useAuth();
  const [usage, setUsage] = useState(canGenerate(!!user));
  const [timeUntilReset, setTimeUntilReset] = useState("");

  useEffect(() => {
    setUsage(canGenerate(!!user));
    setTimeUntilReset(getTimeUntilReset());

    const interval = setInterval(() => {
      setTimeUntilReset(getTimeUntilReset());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  // Don't show if user can generate
  if (usage.canGenerate && usage.tier === "free" && usage.remainingToday > 0) {
    return null;
  }

  const content = (
    <div
      className={`${
        variant === "card"
          ? "bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-yellow-200"
          : variant === "modal"
          ? "bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto"
          : "bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4"
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {usage.tier === "pro" ? (
          <div className="p-3 bg-purple-100 rounded-xl">
            <Crown className="w-6 h-6 text-purple-600" />
          </div>
        ) : usage.remainingToday === 0 ? (
          <div className="p-3 bg-red-100 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        ) : (
          <div className="p-3 bg-blue-100 rounded-xl">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
        )}

        <div className="flex-1">
          <h3
            className={`text-lg font-semibold ${
              usage.remainingToday === 0 ? "text-red-700" : "text-gray-900"
            }`}
          >
            {usage.remainingToday === 0
              ? "Daily Limit Reached"
              : `${usage.remainingToday} Generations Left`}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{usage.message}</p>
        </div>

        {variant === "modal" && onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg p-3">
        <Clock className="w-4 h-4" />
        <span>
          Resets in <strong>{timeUntilReset}</strong>
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {!user && (
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            <LogIn className="w-5 h-5" />
            Sign In for 3 More Free Generations
          </button>
        )}

        {usage.remainingToday === 0 && (
          <Link
            href="/pricing"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Crown className="w-5 h-5" />
            Upgrade to Pro - Unlimited Access
          </Link>
        )}
      </div>

      {/* Free vs Pro comparison */}
      {!user && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <div className="font-medium text-gray-900">Free</div>
              <div className="text-gray-600">1 roadmap</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Sign In</div>
              <div className="text-gray-600">3 roadmaps/day</div>
            </div>
            <div className="col-span-2">
              <div className="font-medium text-purple-600 flex items-center justify-center gap-1">
                <Crown className="w-4 h-4" />
                Pro - Unlimited
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        {content}
      </div>
    );
  }

  return content;
}
