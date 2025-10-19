import React, { useEffect, useState } from "react";
import Header from "../components/Header"; // adjust path if needed


const Settings = () => {
  // form state
  const [form, setForm] = useState({
    username: "Jalendu",
    email: "jalendu@example.com",
    department: "CSE",
    batch: "2024",
    enableNotifications: true,
    soundEffects: true,
    autoQueen: false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // load initial settings from backend (placeholder)
  useEffect(() => {
    // Example GET endpoint: GET /api/user/settings
    // Uncomment and change URL to your actual endpoint
    // setLoading(true);
    // fetch("/api/user/settings")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setForm({
    //       username: data.username,
    //       email: data.email,
    //       department: data.department,
    //       batch: data.batch,
    //       enableNotifications: data.enableNotifications,
    //       soundEffects: data.soundEffects,
    //       autoQueen: data.autoQueen,
    //     });
    //   })
    //   .catch((err) => console.error("Failed to load settings", err))
    //   .finally(() => setLoading(false));
  }, []);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Example PUT endpoint: PUT /api/user/settings
    // Replace URL and payload as needed
    try {
      // const res = await fetch("/api/user/settings", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      // if (!res.ok) throw new Error("Save failed");
      // const updated = await res.json();
      // setForm(updated);

      // Demo behavior: simulate save delay
      await new Promise((r) => setTimeout(r, 700));
    } catch (err) {
      console.error(err);
      setError("Failed to save settings. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This will permanently delete your account.")) return;


    // Example DELETE endpoint: DELETE /api/user
    try {
      setLoading(true);
      // const res = await fetch("/api/user", { method: "DELETE" });
      // if (!res.ok) throw new Error("Delete failed");

      // Simulate deletion
      await new Promise((r) => setTimeout(r, 700));
      // After delete: redirect to login or show message
      // window.location.href = "/login";
      alert("Account deleted (simulated). Redirect to login.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete account. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-9">
        <h1 className="text-3xl font-extrabold mb-2">Settings</h1>
        <p className="text-sm text-gray-400 mb-6">Manage your account and preferences</p>

        {/* Profile Information card */}
        <form onSubmit={handleSave} className="space-y-6">
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

          {/* Game Preferences card */}
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
                    aria-hidden
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
                    aria-hidden
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
                    aria-hidden
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

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-400 text-black px-5 py-2 rounded-md font-medium hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-yellow-300"
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

          {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
        </form>
      </main>
    </div>
  );
};

export default Settings;
