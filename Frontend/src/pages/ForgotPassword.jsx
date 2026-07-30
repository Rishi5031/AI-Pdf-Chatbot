import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const { forgotPassword, isLoading, successMessage, clearMessages } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [countdown, setCountdown] = useState(() => {
    const savedTime = localStorage.getItem('resetCooldown');
    if (savedTime) {
      const remaining = Math.floor((parseInt(savedTime) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  });

  // Clear any existing messages when the component mounts or unmounts
  useEffect(() => {
    clearMessages();
    return () => clearMessages();
  }, [clearMessages]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      localStorage.removeItem('resetCooldown');
    }
  }, [countdown]);

  const startCooldown = () => {
    const cooldownTime = 60; // 60 seconds
    setCountdown(cooldownTime);
    localStorage.setItem('resetCooldown', (Date.now() + cooldownTime * 1000).toString());
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      toast.success('Reset link sent to your email!');
      startCooldown(); // 60 seconds cooldown
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to send reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
        <p className="text-sm text-gray-500 mt-2">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting || countdown > 0}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !email || countdown > 0}
          className="w-full bg-secondary text-white font-medium py-2.5 rounded-lg shadow-sm hover:bg-secondary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : countdown > 0 ? (
            `Resend link in ${countdown}s`
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        <Link to="/login" className="font-medium text-secondary hover:text-secondary/80 flex items-center justify-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Login
        </Link>
      </p>
    </div>
  );
}
