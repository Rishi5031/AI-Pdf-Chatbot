import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useProfileStore } from '../store/profileStore';

export default function ProfileForm({ profile }) {
  const { updateProfile, saving } = useProfileStore();

  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    if (bio && bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateProfile({
        name: name.trim(),
        bio: bio.trim() || null,
      });
      toast.success('Profile details saved!');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update profile.';
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-7 shadow-xs">
      <div className="flex items-center gap-2 mb-4 sm:mb-6 border-b border-slate-100 pb-3 sm:pb-4">
        <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h2 className="text-base sm:text-lg font-bold text-slate-800">Personal Information</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Top 2 Columns for Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              FULL NAME <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              placeholder="Full Name"
              className={`w-full px-3.5 py-2 bg-white border ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
              } rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none transition-all`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                EMAIL
              </label>
              <span className="text-xs text-slate-400 italic font-serif">private</span>
            </div>
            <div className="relative">
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full pl-3.5 pr-10 py-2 bg-slate-100/90 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-500 cursor-not-allowed font-medium select-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              SHORT BIO
            </label>
            <span
              className={`text-xs font-mono font-medium ${
                bio.length > 500 ? 'text-red-500' : 'text-slate-400'
              }`}
            >
              {bio.length} / 500
            </span>
          </div>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              if (errors.bio) setErrors({ ...errors, bio: null });
            }}
            placeholder="Brief description for your profile..."
            className={`w-full px-3.5 py-2.5 bg-white border ${
              errors.bio ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
            } rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none transition-all placeholder-slate-400 resize-none`}
          />
          {errors.bio && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.bio}</p>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[40px]"
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
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
