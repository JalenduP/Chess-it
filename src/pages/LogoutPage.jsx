import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Example: clear session or localStorage token
    localStorage.removeItem("authToken");

    // Redirect to login page after logout
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="text-white p-6">
      <p>Logging you out...</p>
    </div>
  );
};

export default LogoutPage;
