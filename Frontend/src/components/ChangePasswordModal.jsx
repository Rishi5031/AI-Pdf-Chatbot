import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useProfileStore } from '../store/profileStore';

export default function ChangePasswordModal({ isOpen, onClose, isGoogleUser }) {
  const { changePassword, saving } = useProfileStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required.';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters.';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isGoogleUser) {
      toast.error('Google accounts cannot change password here.');
      return;
    }

    if (!validate()) return;

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success('Password changed successfully!');
      handleClose();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to change password.';
      toast.error(msg);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-xs">
      <div className="bg-surface p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-neutral/20 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Change Password
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-neutral hover:text-primary hover:bg-neutral/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isGoogleUser ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm mb-4">
            You signed in using Google OAuth. Password changes are managed directly through your Google Account.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (errors.currentPassword) setErrors({ ...errors, currentPassword: null });
                }}
                className={`w-full px-4 py-2 bg-surface border ${
                  errors.currentPassword ? 'border-red-500' : 'border-neutral/30 focus:border-secondary'
                } rounded-xl text-sm text-primary focus:outline-none transition-all`}
                placeholder="Enter current password"
              />
              {errors.currentPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) setErrors({ ...errors, newPassword: null });
                }}
                className={`w-full px-4 py-2 bg-surface border ${
                  errors.newPassword ? 'border-red-500' : 'border-neutral/30 focus:border-secondary'
                } rounded-xl text-sm text-primary focus:outline-none transition-all`}
                placeholder="Enter new password (min. 6 characters)"
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                }}
                className={`w-full px-4 py-2 bg-surface border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-neutral/30 focus:border-secondary'
                } rounded-xl text-sm text-primary focus:outline-none transition-all`}
                placeholder="Re-enter new password"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-neutral hover:text-primary hover:bg-neutral/10 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-secondary/20 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
