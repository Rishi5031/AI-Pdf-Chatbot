import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProfileStore } from '../store/profileStore';

export default function DeleteAccountModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { deleteAccount, saving } = useProfileStore();

  const [confirmText, setConfirmText] = useState('');

  if (!isOpen) return null;

  const isConfirmed = confirmText.trim() === 'DELETE';

  const handleDelete = async () => {
    if (!isConfirmed) return;

    try {
      await deleteAccount();
      toast.success('Your account has been deleted.');
      onClose();
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete account.';
      toast.error(msg);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-surface p-4 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-neutral/20 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 text-red-600 mb-3">
          <div className="p-2 sm:p-2.5 bg-red-100 rounded-xl flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-primary">Delete Account</h3>
        </div>

        <p className="text-neutral text-xs sm:text-sm mb-4 leading-relaxed">
          This action <strong className="text-red-600 font-bold">cannot be undone</strong>. All your chat history, uploaded document files, vector indexes, and account data will be permanently deleted.
        </p>

        <div className="mb-5">
          <label className="block text-[11px] sm:text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5">
            Type <span className="font-bold text-red-600">DELETE</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full px-3.5 sm:px-4 py-2 bg-surface border border-neutral/30 focus:border-red-500 rounded-xl text-xs sm:text-sm text-primary focus:outline-none transition-all font-mono"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-3.5 sm:px-4 py-2 rounded-xl text-neutral hover:bg-neutral/10 font-semibold text-xs sm:text-sm transition-colors cursor-pointer min-h-[38px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isConfirmed || saving}
            className="px-4 sm:px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed min-h-[38px]"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting Account...
              </>
            ) : (
              'Delete My Account'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
