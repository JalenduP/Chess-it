import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {/* A real gradient from yellow to white */}
    <div className="mb-8">
    <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-white">
        chess it
    </span>
    </div>

      {/* Form Card */}
      <div className="relative w-full max-w-sm">
        {/* Shadow/Background effect */}
        <div className="absolute top-2 left-2 w-full h-full bg-gray-700 rounded-lg"></div>
        
        <div className="relative z-10 w-full p-8 bg-gray-800 rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;