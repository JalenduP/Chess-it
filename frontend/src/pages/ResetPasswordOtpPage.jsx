import React, { useState, useEffect } from 'react';
import AuthLayout from '../components/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import TextType from '../components/TextType';
import authService from '../services/authService';

const ResetPasswordOtpPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Get email from localStorage (set during forgot password)
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      navigate('/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyResetOTP(email, otp);
      
      if (response.success && response.resetToken) {
        setSuccess('OTP verified! Redirecting...');
        // Store reset token for password reset
        localStorage.setItem('resetToken', response.resetToken);
        setTimeout(() => {
          navigate('/reset-password');
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid or expired OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setResending(true);

    try {
      const response = await authService.resendOTP(email);
      
      if (response.success) {
        setSuccess('OTP resent successfully! Check your email.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to resend OTP. Please try again.'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold text-center text-white mb-6">
        <TextType
          text={["Reset your password", "Enter OTP to proceed"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />
      </h2>

      <p className="text-center text-gray-400 mb-6">
        OTP sent to {email}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-sm">
          {success}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-400">Enter OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
              setError('');
            }}
            maxLength={6}
            placeholder="000000"
            required
            disabled={loading}
            className="w-full mt-1 bg-transparent border-b-2 border-gray-600 text-white focus:outline-none focus:border-yellow-400 text-center text-2xl tracking-widest disabled:opacity-50"
          />
        </div>
        
        <div className="text-sm text-gray-400">
          Didn't receive the OTP?{' '}
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resending || loading}
            className="font-medium text-yellow-400 hover:underline disabled:opacity-50"
          >
            {resending ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full py-3 font-semibold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Submit'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordOtpPage;