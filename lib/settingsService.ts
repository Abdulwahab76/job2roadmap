import { supabase } from "./supabase";

export type UserSettings = {
  id?: string;
  user_id: string; // Now TEXT type
  display_name?: string;
  bio?: string;
  website?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  avatar_url?: string;

  theme: "light" | "dark" | "system";
  language: string;
  email_notifications: boolean;
  weekly_digest: boolean;
  roadmap_updates: boolean;

  default_mode: "auto" | "local-only" | "ai-only";
  auto_save: boolean;

  tier: "free" | "pro" | "enterprise";
  stripe_customer_id?: string;
  subscription_id?: string;
  subscription_status?: string;
  current_period_end?: string;

  created_at?: string;
  updated_at?: string;
};

const DEFAULT_SETTINGS: Partial<UserSettings> = {
  theme: "light",
  language: "en",
  email_notifications: true,
  weekly_digest: true,
  roadmap_updates: true,
  default_mode: "auto",
  auto_save: true,
  tier: "free",
};

// Get user settings
export async function getUserSettings(
  userId: string
): Promise<UserSettings | null> {
  try {
    console.log("🔍 Fetching settings for user:", userId);

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No settings found, create default
        console.log("📝 No settings found, creating defaults...");
        return createDefaultSettings(userId);
      }
      console.error("❌ Error fetching settings:", error);
      throw error;
    }

    console.log("✅ Settings loaded:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error in getUserSettings:", error.message);
    throw error;
  }
}

// Create default settings for new user
export async function createDefaultSettings(
  userId: string
): Promise<UserSettings> {
  try {
    console.log("🆕 Creating default settings for:", userId);

    // Validate userId is not empty
    if (!userId || userId.trim() === "") {
      throw new Error("Invalid user ID");
    }

    const { data, error } = await supabase
      .from("user_settings")
      .insert({
        user_id: userId.trim(), // Ensure it's trimmed
        ...DEFAULT_SETTINGS,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating settings:", error);
      throw error;
    }

    console.log("✅ Default settings created:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error in createDefaultSettings:", error.message);
    throw error;
  }
}

// Update user settings
export async function updateUserSettings(
  userId: string,
  updates: Partial<UserSettings>
): Promise<UserSettings> {
  try {
    console.log("🔄 Updating settings for:", userId);
    console.log("📝 Updates:", updates);

    // First check if settings exist
    const { data: existing } = await supabase
      .from("user_settings")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!existing) {
      // Create settings if they don't exist
      console.log("📝 Settings not found, creating...");
      return createDefaultSettings(userId);
    }

    const { data, error } = await supabase
      .from("user_settings")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("❌ Error updating settings:", error);
      throw error;
    }

    console.log("✅ Settings updated:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error in updateUserSettings:", error.message);
    throw error;
  }
}

// Update profile info
export async function updateProfile(
  userId: string,
  profile: {
    display_name?: string;
    bio?: string;
    website?: string;
    github_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
    avatar_url?: string;
  }
): Promise<UserSettings> {
  return updateUserSettings(userId, profile);
}

// Update preferences
export async function updatePreferences(
  userId: string,
  preferences: {
    theme?: "light" | "dark" | "system";
    language?: string;
    email_notifications?: boolean;
    weekly_digest?: boolean;
    roadmap_updates?: boolean;
    default_mode?: "auto" | "local-only" | "ai-only";
    auto_save?: boolean;
  }
): Promise<UserSettings> {
  return updateUserSettings(userId, preferences);
}

// Export settings as JSON
export function exportSettings(settings: UserSettings): string {
  const exportData = {
    version: "1.0",
    exported_at: new Date().toISOString(),
    settings: {
      profile: {
        display_name: settings.display_name,
        bio: settings.bio,
        website: settings.website,
        github_url: settings.github_url,
        linkedin_url: settings.linkedin_url,
        twitter_url: settings.twitter_url,
      },
      preferences: {
        theme: settings.theme,
        language: settings.language,
        email_notifications: settings.email_notifications,
        weekly_digest: settings.weekly_digest,
        roadmap_updates: settings.roadmap_updates,
        default_mode: settings.default_mode,
        auto_save: settings.auto_save,
      },
    },
  };

  return JSON.stringify(exportData, null, 2);
}

// Get API keys
export async function getUserAPIKeys(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("user_api_keys")
      .select("*")
      .eq("user_id", userId)
      .is("revoked_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching API keys:", error);
    throw error;
  }
}

// Create API key
export async function createAPIKey(userId: string, name: string): Promise<any> {
  try {
    const apiKey = `j2r_${generateRandomString(32)}`;

    const { data, error } = await supabase
      .from("user_api_keys")
      .insert({
        user_id: userId,
        api_key: apiKey,
        name: name,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating API key:", error);
    throw error;
  }
}

// Revoke API key
export async function revokeAPIKey(
  keyId: string,
  userId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from("user_api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", keyId)
      .eq("user_id", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error revoking API key:", error);
    throw error;
  }
}

// Delete account
export async function deleteAccount(userId: string): Promise<void> {
  try {
    await supabase.from("user_progress").delete().eq("user_id", userId);
    await supabase.from("roadmaps").delete().eq("user_id", userId);
    await supabase.from("job_posts").delete().eq("user_id", userId);
    await supabase.from("user_api_keys").delete().eq("user_id", userId);
    await supabase.from("user_settings").delete().eq("user_id", userId);
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
}

function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
