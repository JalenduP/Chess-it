// src/pages/SettingsPage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import authService from "../services/authService";

const Settings = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    department: "CSE",
    batch: "2024",
    enableNotifications: true,
    soundEffects: true,
    autoQueen: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load initial settings from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getUserProfile();
        
        if (response.success && response.user) {
          setForm({
            username: response.user.username || "",
            email: response.user.email || "",
            department: response.user.department || "CSE",
            batch: response.user.batch || "2024",
            enableNotifications: response.user.settings?.enableNotifications ?? true,
            soundEffects: response.user.settings?.soundEffects ?? true,
            autoQueen: response.user.settings?.autoQueen ?? false,
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Update profile
      const profileResponse = await authService.updateUserProfile({
        username: form.username,
        email: form.email,
        department: form.department,
        batch: form.batch,
      });

      if (profileResponse.success) {
        // Update settings separately (if your backend has separate endpoint)
        // For now, assuming settings are part of profile update
        setSuccess("Settings saved successfully!");
        
        // Update local storage
        const currentUser = authService.getCurrentUser();
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          username: form.username,
          email: form.email,
          department: form.department,
          batch: form.batch,
        }));
        
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || "Failed to save settings. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This will permanently delete your account and all data.")) {
      return;
    }

    const secondConfirm = window.prompt('Type "DELETE" to confirm account deletion:');
    if (secondConfirm !== "DELETE") {
      return;
    }

    try {
      setLoading(true);
      // Call delete account API
      await authService.logout();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setError("Failed to delete account. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
            <p>Loading settings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-9">
        <h1 className="text-3xl font-extrabold mb-2">Settings</h1>
        <p className="text-sm text-gray-400 mb-6">Manage your account and preferences</p>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Information */}
          <section className="bg-[#0f1720] border border-gray-700 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => onChange("username", e.target.value)}
                  className="w-full bg-[#111827] border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="w-full bg-[#111827] border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => onChange("department", e.target.value)}
                    className="w-full bg-[#111827] border border-gray-700 rounded-md px-4 py-2 text-white"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="CE">CE</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Batch</label>
                  <select
                    value={form.batch}
                    onChange={(e) => onChange("batch", e.target.value)}
                    className="w-full bg-[#111827] border border-gray-700 rounded-md px-4 py-2 text-white"
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Game Preferences */}
          <section className="bg-[#0f1720] border border-gray-700 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Game Preferences</h2>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable Notifications</div>
                  <div className="text-xs text-gray-400">Get notified about game invites and results</div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.enableNotifications}
                    onChange={(e) => onChange("enableNotifications", e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${
                      form.enableNotifications ? "bg-yellow-400" : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`block bg-white rounded-full w-4 h-4 transform transition-transform ${
                        form.enableNotifications ? "translate-x-5" : ""
                      }`}
                    />
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Sound Effects</div>
                  <div className="text-xs text-gray-400">Play sounds for moves and game events</div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.soundEffects}
                    onChange={(e) => onChange("soundEffects", e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${form.soundEffects ? "bg-yellow-400" : "bg-gray-700"}`}
                  >
                    <span
                      className={`block bg-white rounded-full w-4 h-4 transform transition-transform ${
                        form.soundEffects ? "translate-x-5" : ""
                      }`}
                    />
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-Queen Promotion</div>
                  <div className="text-xs text-gray-400">Automatically promote pawns to queens</div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.autoQueen}
                    onChange={(e) => onChange("autoQueen", e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${form.autoQueen ? "bg-yellow-400" : "bg-gray-700"}`}
                  >
                    <span
                      className={`block bg-white rounded-full w-4 h-4 transform transition-transform ${
                        form.autoQueen ? "translate-x-5" : ""
                      }`}
                    />
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-400 text-black px-5 py-2 rounded-md font-medium hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Danger Zone */}
          <section className="bg-[#0f1720] border border-red-600 rounded-xl p-6 shadow-sm">
            <h3 className="text-red-400 font-semibold mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-400 mb-4">Once you delete your account, there is no going back.</p>

            <div>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-700 text-white px-4 py-2 rounded-md hover:brightness-95 focus:outline-none"
              >
                Delete Account
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
};

export default Settings;