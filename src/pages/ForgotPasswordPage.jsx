import React from 'react';
import AuthLayout from '../components/AuthLayout';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import TextType from '../components/TextType';


const ForgotPasswordPage = () => {
  const navigate = useNavigate(); // Initialize the hook

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending reset OTP
    navigate('/reset-password-otp');
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold text-center text-white mb-6">
        <TextType
          text={["Forgot password" , "Request OTP to reset"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}> {/* Add onSubmit */}
        <div>
          <label className="block text-sm font-medium text-gray-400">Enter registered Email:</label>
          <input
            type="email"
            className="w-full mt-1 bg-transparent border-b-2 border-gray-600 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 font-semibold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-300 focus:outline-none"
        >
          Request OTP
        </button>

        <div className="text-sm text-center text-gray-400">
          Don't have an account? <Link to="/signup" className="font-medium text-yellow-400 hover:underline">Sign up</Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;