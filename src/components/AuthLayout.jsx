import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {/* Logo */}
      <div className="mb-8">
        <span className="text-6xl font-bold text-white">
          chess <span className="text-yellow-400">it</span>
        </span>
      </div>

      {/* Form Card */}
      <div className="relative w-full max-w-sm">
        {/* Shadow/Background effect */}
        <div className="absolute top-2 left-2 w-full h-full bg-gray-700 rounded-lg transform -rotate-2"></div>
        
        <div className="relative z-10 w-full p-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;