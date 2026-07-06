"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthChange } from "@/lib/firebase";
import { getOrCreateUser } from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  supabaseReady: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  supabaseReady: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseReady, setSupabaseReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          console.log("🔄 Syncing Firebase user with Supabase...");
          await getOrCreateUser(
            firebaseUser.uid,
            firebaseUser.email || undefined,
            firebaseUser.displayName || undefined
          );
          setSupabaseReady(true);
          console.log("✅ Supabase sync complete");
        } catch (error) {
          console.error("❌ Failed to sync with Supabase:", error);
          setSupabaseReady(false);
        }
      } else {
        setSupabaseReady(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, supabaseReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
