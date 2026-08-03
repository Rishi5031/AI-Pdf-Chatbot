import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import { useProfileStore } from '../store/profileStore';

export default function AvatarUploader({ profile, isGoogleUser }) {
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

    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds the ${maxSizeMB} MB limit.`);
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
    : 'AI';

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-secondary/10 flex items-center justify-center border-4 border-white shadow-md overflow-hidden flex-shrink-0 relative transition-all duration-200 group-hover:shadow-lg">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={profile?.name || 'Profile'}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl sm:text-4xl font-bold text-secondary">
              {initials}
            </span>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-primary/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2">
              <svg
                className="w-7 h-7 animate-spin mb-1 text-white"
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
              <span className="text-[11px] font-semibold">
                {uploadProgress}%
              </span>
            </div>
          )}

          {!uploading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
              title="Change Profile Picture"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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
              <span className="text-[10px] font-medium tracking-wide">Upload</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 p-2 bg-secondary text-white rounded-full shadow-md hover:bg-secondary/90 transition-transform active:scale-95 disabled:opacity-50"
          title="Upload new avatar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

      <p className="text-xs text-neutral/70 mt-3 font-medium">
        JPG, PNG, or WEBP (Max 5MB)
      </p>
    </div>
  );
}
