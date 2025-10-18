import React from 'react';
import AuthLayout from '../components/AuthLayout';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const ResetPasswordOtpPage = () => {
  const navigate = useNavigate(); // Initialize the hook

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate correct OTP
    navigate('/reset-password');
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold text-center text-white mb-6">
        Reset Password
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}> {/* Add onSubmit */}
        <div>
          <label className="block text-sm font-medium text-gray-400">Enter OTP:</label>
          <input
            type="text"
            className="w-full mt-1 bg-transparent border-b-2 border-gray-600 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
        
        <div className="text-sm text-gray-400">
          Didn't receive the OTP? <Link to="#" className="font-medium text-yellow-400 hover:underline">Resend OTP</Link>
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

export default ResetPasswordOtpPage;