import React from "react";
import AuthLayout from "../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import TextType from "../components/TextType";

const SignupPage = () => {
  const navigate = useNavigate(); // Initialize the hook

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending an OTP
    navigate("/verify");
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold text-center text-white mb-6">
        <TextType
          text={["Sign up to continue","Welcome, welcome"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {" "}
        {/* Add onSubmit */}
        <div>
          <label className="block text-sm font-medium text-gray-400">
            Email:
          </label>
          <input
            type="email"
            className="w-full mt-1 bg-transparent border-b-2 border-gray-600 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400">
            Username:
          </label>
          <input
            type="text"
            className="w-full mt-1 bg-transparent border-b-2 border-gray-600 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400">
            Password:
          </label>
          <input
            type="password"
            className="w-full mt-1 bg-transparent border-b-2 border-gray-600 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400">
            Confirm Password:
          </label>
          <input
            type="password"
            className="w-full mt-1 bg-transparent border-b-2 border-gray-600 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 font-semibold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-300 focus:outline-none"
        >
          Sign up
        </button>
        <div className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-yellow-400 hover:underline"
          >
            Log in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
