import React from 'react';
import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ResetPasswordPage = () => {
  const navigate = useNavigate(); // Initialize the hook

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful password change
    navigate('/login');
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold text-center text-white mb-6">
        Reset Password
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}> {/* Add onSubmit */}
        <div>
          <label className="block text-sm font-medium text-gray-400">Enter new password:</label>
          <input
            type="password"
            className="w-full mt-1 bg-transparent border-b-2 border-gray-600 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400">Confirm password:</label>
          <input
            type="password"
            className="w-full mt-1 bg-transparent border-b-2 border-gray-600 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 font-semibold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-300 focus:outline-none"
        >
          Submit
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;