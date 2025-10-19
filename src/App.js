import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import your pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordOtpPage from "./pages/ResetPasswordOtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import LeaderboardPage from "./pages/LeaderboardPage";
import TournamentPage from "./pages/TournamentPage";
import GamePage from "./pages/GamePage";
import DashboardPage from "./pages/DashboardPage";
import FriendsPage from "./pages/FriendsPage";
import SettingsPage from "./pages/SettingsPage";
import LogoutPage from "./pages/LogoutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password-otp" element={<ResetPasswordOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* App Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/tournaments" element={<TournamentPage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/logout" element={<LogoutPage />} />

        {/* Set the default page to your dashboard */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
