import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call logout endpoint
        await authService.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Redirect to login page after logout
        navigate("/login", { replace: true });
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
        <p className="text-white text-lg">Logging you out...</p>
      </div>
    </div>
  );
};

export default LogoutPage;