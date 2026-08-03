import { create } from 'zustand';
import { profileService } from '../services/profileService';
import { useAuthStore } from './authStore';

export const useProfileStore = create((set, get) => ({
  profile: null,
  statistics: null,
  loading: false,
  saving: false,
  uploading: false,
  uploadProgress: 0,
  error: null,
  successMessage: null,

  clearError: () => set({ error: null }),
  clearSuccess: () => set({ successMessage: null }),

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const data = await profileService.getProfile();
      set({
        profile: data,
        statistics: data.statistics,
        loading: false,
      });

      // Update authStore user profile information if available
      const authUser = useAuthStore.getState().user;
      if (authUser) {
        useAuthStore.getState().setUser({
          ...authUser,
          name: data.name,
          profile_picture: data.profile_image || authUser.profile_picture,
        });
      }

      return data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || 'Failed to load profile information.';
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  updateProfile: async (profileData) => {
    set({ saving: true, error: null, successMessage: null });
    try {
      const data = await profileService.updateProfile(profileData);
      set({
        profile: data,
        statistics: data.statistics,
        saving: false,
        successMessage: 'Profile updated successfully.',
      });

      // Sync with auth store
      const authUser = useAuthStore.getState().user;
      if (authUser) {
        useAuthStore.getState().setUser({
          ...authUser,
          name: data.name,
          profile_picture: data.profile_image || authUser.profile_picture,
        });
      }

      return data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || 'Failed to update profile.';
      set({ error: errorMsg, saving: false });
      throw err;
    }
  },

  uploadAvatar: async (file) => {
    set({ uploading: true, uploadProgress: 0, error: null, successMessage: null });
    try {
      const data = await profileService.uploadAvatar(file, (progress) => {
        set({ uploadProgress: progress });
      });

      set({
        profile: data,
        statistics: data.statistics,
        uploading: false,
        uploadProgress: 100,
        successMessage: 'Profile picture updated successfully.',
      });

      // Sync with auth store
      const authUser = useAuthStore.getState().user;
      if (authUser) {
        useAuthStore.getState().setUser({
          ...authUser,
          profile_picture: data.profile_image,
        });
      }

      return data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || 'Failed to upload profile picture.';
      set({ error: errorMsg, uploading: false, uploadProgress: 0 });
      throw err;
    }
  },

  changePassword: async (passwordData) => {
    set({ saving: true, error: null, successMessage: null });
    try {
      const res = await profileService.changePassword(passwordData);
      set({
        saving: false,
        successMessage: res.message || 'Password changed successfully.',
      });
      return res;
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || 'Failed to change password.';
      set({ error: errorMsg, saving: false });
      throw err;
    }
  },

  deleteAccount: async () => {
    set({ saving: true, error: null });
    try {
      const res = await profileService.deleteAccount();
      set({
        profile: null,
        statistics: null,
        saving: false,
      });

      // Clear auth store session
      useAuthStore.getState().clearAuth();
      return res;
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || 'Failed to delete account.';
      set({ error: errorMsg, saving: false });
      throw err;
    }
  },
}));
