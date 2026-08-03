import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import { useProfileStore } from '../store/profileStore';

export default function ProfileHeader({ profile, isGoogleUser }) {
  const fileInputRef = useRef(null);
  const { uploadAvatar, uploading, uploadProgress } = useProfileStore();

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    return `${baseUrl}${path}`;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5 MB limit.');
      return;
    }

    try {
      await uploadAvatar(file);
      toast.success('Profile picture updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to upload image.';
      toast.error(msg);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const avatarUrl = getImageUrl(profile?.profile_image);
  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'RM';

  const formattedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'August 3, 2026';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-7 shadow-xs mb-4 sm:mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left w-full md:w-auto">
          {/* Avatar with Camera Badge */}
          <div className="relative group flex-shrink-0">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-indigo-50/80 border border-slate-200 flex items-center justify-center text-indigo-700 font-bold text-2xl sm:text-3xl overflow-hidden relative shadow-xs">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={profile?.name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}

              {uploading && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                  <svg
                    className="w-6 h-6 animate-spin mb-1 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-[10px] font-medium">{uploadProgress}%</span>
                </div>
              )}
            </div>

            {/* Camera Upload Icon Badge */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50 border-2 border-white min-w-[32px] min-h-[32px] flex items-center justify-center"
              title="Upload Profile Picture"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* User Details */}
          <div className="min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight break-words">
                {profile?.name || 'rishi makwana'}
              </h1>
              <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
                ACTIVE
              </span>
            </div>

            <div className="mt-2 space-y-1 text-sm text-slate-500">
              <p className="flex items-center justify-center sm:justify-start gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {profile?.email || 'rishi@gmail.com'}
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined {formattedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Top Right Auth Badge */}
        <div className="flex items-center justify-center md:justify-end w-full md:w-auto">
          {isGoogleUser ? (
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-2xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google Auth
            </div>
          ) : (
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-2xs">
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" />
              </svg>
              Email & Password
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
