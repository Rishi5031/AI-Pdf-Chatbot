import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import PasswordInput from '../components/PasswordInput';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const { resetPassword, isLoading, clearMessages } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    clearMessages();
    return () => clearMessages();
  }, [clearMessages]);

  const validatePassword = () => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const err = validatePassword();
    if (err) {
      toast.error(err);
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, password, confirmPassword);
      toast.success('Password reset successfully!');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to reset password.');
      setIsSubmitting(false); // Only clear submitting state if error, to keep button spinner during redirect
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
        <p className="text-sm text-gray-500 mb-6">
          This password reset link is invalid or missing the security token.
        </p>
        <Link
          to="/forgot-password"
          className="w-full bg-secondary text-white font-medium py-2.5 rounded-lg shadow-sm hover:bg-secondary/90 transition-all inline-block"
        >
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-sm text-gray-500 mt-2">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordInput
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
        />

        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting || !password || !confirmPassword}
          className="w-full bg-secondary text-white font-medium py-2.5 rounded-lg shadow-sm hover:bg-secondary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
}
