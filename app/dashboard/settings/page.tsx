"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/authContext";
import {
  getUserSettings,
  updateProfile,
  updatePreferences,
  getUserAPIKeys,
  createAPIKey,
  revokeAPIKey,
  deleteAccount,
  exportSettings,
  type UserSettings,
} from "@/lib/settingsService";
import {
  User,
  Bell,
  Palette,
  Key,
  Shield,
  Download,
  Trash2,
  Save,
  Check,
  AlertCircle,
  Copy,
  Plus,
  X,
  RefreshCw,
  // Github,
  // Linkedin,
} from "lucide-react";
import { useRouter } from "next/navigation";

type TabType =
  | "profile"
  | "preferences"
  | "notifications"
  | "api-keys"
  | "danger";

export default function SettingsPage() {
  const { user, supabaseReady } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [showNewKey, setShowNewKey] = useState<string | null>(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    display_name: "",
    bio: "",
    website: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
  });

  const [preferencesForm, setPreferencesForm] = useState({
    theme: "light" as "light" | "dark" | "system",
    language: "en",
    default_mode: "auto" as "auto" | "local-only" | "ai-only",
    auto_save: true,
  });

  const [notificationsForm, setNotificationsForm] = useState({
    email_notifications: true,
    weekly_digest: true,
    roadmap_updates: true,
  });

  useEffect(() => {
    if (user && supabaseReady) {
      console.log("👤 User ready, loading settings for:", user.uid);
      loadSettings();
      loadAPIKeys();
    }
  }, [user, supabaseReady]);

  const loadSettings = async () => {
    if (!user) {
      console.log("❌ No user found");
      return;
    }

    try {
      setLoading(true);
      console.log("🔍 Loading settings for user ID:", user.uid);

      const data = await getUserSettings(user.uid);
      console.log("📦 Settings data:", data);
      setSettings(data);

      if (data) {
        setProfileForm({
          display_name: data.display_name || user.displayName || "",
          bio: data.bio || "",
          website: data.website || "",
          github_url: data.github_url || "",
          linkedin_url: data.linkedin_url || "",
          twitter_url: data.twitter_url || "",
        });

        setPreferencesForm({
          theme: data.theme || "light",
          language: data.language || "en",
          default_mode: data.default_mode || "auto",
          auto_save: data.auto_save ?? true,
        });

        setNotificationsForm({
          email_notifications: data.email_notifications ?? true,
          weekly_digest: data.weekly_digest ?? true,
          roadmap_updates: data.roadmap_updates ?? true,
        });
      }
    } catch (error: any) {
      console.error("❌ Error loading settings:", error.message);
      showMessage("error", "Failed to load settings: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAPIKeys = async () => {
    if (!user) return;
    try {
      const keys = await getUserAPIKeys(user.uid);
      setApiKeys(keys);
    } catch (error) {
      console.error("Error loading API keys:", error);
    }
  };

  const handleProfileSave = async () => {
    if (!user) {
      showMessage("error", "No user logged in");
      return;
    }

    try {
      setSaving(true);
      console.log("💾 Saving profile for user:", user.uid);
      console.log("📝 Profile data:", profileForm);

      await updateProfile(user.uid, profileForm);
      showMessage("success", "Profile updated successfully!");
      await loadSettings(); // Reload to confirm
    } catch (error: any) {
      console.error("❌ Save error:", error);
      showMessage("error", "Failed to update profile: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesSave = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await updatePreferences(user.uid, preferencesForm);
      showMessage("success", "Preferences updated!");
    } catch (error: any) {
      showMessage("error", "Failed to update preferences: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationsSave = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await updatePreferences(user.uid, notificationsForm);
      showMessage("success", "Notification preferences updated!");
    } catch (error: any) {
      showMessage("error", "Failed to update notifications: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAPIKey = async () => {
    if (!user || !newKeyName.trim()) return;
    try {
      const newKey = await createAPIKey(user.uid, newKeyName.trim());
      setShowNewKey(newKey.api_key);
      setNewKeyName("");
      await loadAPIKeys();
      showMessage("success", "API key created! Copy it now.");
    } catch (error: any) {
      showMessage("error", "Failed to create API key");
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!user || !confirm("Are you sure?")) return;
    try {
      await revokeAPIKey(keyId, user.uid);
      await loadAPIKeys();
      showMessage("success", "API key revoked");
    } catch (error: any) {
      showMessage("error", "Failed to revoke API key");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (
      !confirm(
        "Are you absolutely sure? This will delete all your data permanently!"
      )
    )
      return;

    try {
      await deleteAccount(user.uid);
      router.push("/");
    } catch (error: any) {
      showMessage("error", "Failed to delete account");
    }
  };

  const handleExportData = () => {
    if (!settings) return;
    const data = exportSettings(settings);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `job2roadmap-settings-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage("success", "Settings exported!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showMessage("success", "Copied to clipboard!");
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </DashboardLayout>
    );
  }

  // Debug info
  console.log("🔧 Current state:", {
    user: user?.uid,
    supabaseReady,
    settings,
  });

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: User },
    { id: "preferences" as TabType, label: "Preferences", icon: Palette },
    { id: "notifications" as TabType, label: "Notifications", icon: Bell },
    { id: "api-keys" as TabType, label: "API Keys", icon: Key },
    { id: "danger" as TabType, label: "Danger Zone", icon: Shield },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            User ID: {user?.uid?.substring(0, 10)}...
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border flex">
          <div className="w-64 border-r p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-purple-50 text-purple-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-8">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl text-black font-semibold mb-6">
                  Profile Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.display_name}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          display_name: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profileForm.website}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {/* <Github className="w-4 h-4 inline mr-1" /> */}
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={profileForm.github_url}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            github_url: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {/* <Linkedin className="w-4 h-4 inline mr-1" /> */}
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={profileForm.linkedin_url}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            linkedin_url: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleProfileSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-black">Preferences</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["light", "dark", "system"] as const).map((theme) => (
                        <button
                          key={theme}
                          onClick={() =>
                            setPreferencesForm((prev) => ({ ...prev, theme }))
                          }
                          className={`p-4 rounded-xl border-2 text-center capitalize ${
                            preferencesForm.theme === theme
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200"
                          }`}
                        >
                          <Palette className="w-6 h-6 mx-auto mb-2" />
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Mode
                    </label>
                    <select
                      value={preferencesForm.default_mode}
                      onChange={(e) =>
                        setPreferencesForm((prev) => ({
                          ...prev,
                          default_mode: e.target.value as any,
                        }))
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="auto">Auto (Local + AI)</option>
                      <option value="local-only">Local Only</option>
                      <option value="ai-only">AI Only</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-save Roadmaps</p>
                      <p className="text-sm text-gray-600">
                        Automatically save generated roadmaps
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setPreferencesForm((prev) => ({
                          ...prev,
                          auto_save: !prev.auto_save,
                        }))
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        preferencesForm.auto_save
                          ? "bg-purple-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          preferencesForm.auto_save
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      ></div>
                    </button>
                  </div>

                  <button
                    onClick={handlePreferencesSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-black">Notifications</h2>
                <div className="space-y-4">
                  {[
                    {
                      key: "email_notifications",
                      label: "Email Notifications",
                      desc: "Receive email updates",
                    },
                    {
                      key: "weekly_digest",
                      label: "Weekly Digest",
                      desc: "Weekly summary of new features",
                    },
                    {
                      key: "roadmap_updates",
                      label: "Roadmap Updates",
                      desc: "Updates about your roadmaps",
                    },
                  ].map((notif) => (
                    <div
                      key={notif.key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium">{notif.label}</p>
                        <p className="text-sm text-gray-600">{notif.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotificationsForm((prev) => ({
                            ...prev,
                            [notif.key]: !prev[notif.key as keyof typeof prev],
                          }))
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notificationsForm[
                            notif.key as keyof typeof notificationsForm
                          ]
                            ? "bg-purple-600"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            notificationsForm[
                              notif.key as keyof typeof notificationsForm
                            ]
                              ? "translate-x-6"
                              : "translate-x-0.5"
                          }`}
                        ></div>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleNotificationsSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 mt-4"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}

            {/* Other tabs remain similar but simplified */}
            {activeTab === "api-keys" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-black">API Keys</h2>
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Key name..."
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <button
                    onClick={handleCreateAPIKey}
                    disabled={!newKeyName.trim()}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                    Create
                  </button>
                </div>
                {apiKeys.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No API keys yet
                  </p>
                ) : (
                  apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-2"
                    >
                      <div>
                        <p className="font-medium">{key.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(key.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRevokeKey(key.id)}
                        className="text-red-600 text-sm"
                      >
                        Revoke
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "danger" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-red-600">
                  Danger Zone
                </h2>
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold mb-2 text-black">Export Data</h3>
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 bg-white text-black border px-4 py-2 rounded-lg"
                    >
                      <Download className="w-5 h-5" />
                      Export Settings
                    </button>
                  </div>
                  <div className="p-6 border-2 border-red-200 rounded-xl bg-red-50">
                    <h3 className="font-semibold text-red-700 mb-2">
                      Delete Account
                    </h3>
                    <p className="text-sm text-red-600 mb-4">
                      This action cannot be undone.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
