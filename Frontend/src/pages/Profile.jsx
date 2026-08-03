import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';

import ProfileHeader from '../components/ProfileHeader';
import ProfileForm from '../components/ProfileForm';
import AccountStatistics from '../components/AccountStatistics';
import ChangePasswordModal from '../components/ChangePasswordModal';
import DeleteAccountModal from '../components/DeleteAccountModal';

export default function Profile() {
  const { user } = useAuthStore();
  const { profile, statistics, loading, fetchProfile } = useProfileStore();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile().catch(() => {});
  }, [fetchProfile]);

  const activeProfile = profile || user;
  const isGoogleUser = user?.provider === 'google';

  if (loading && !activeProfile) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#f8f9fd] p-6 sm:p-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-10 h-10 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-slate-700 font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f9fd] p-3 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Top Header Card */}
        <ProfileHeader profile={activeProfile} isGoogleUser={isGoogleUser} />

        {/* Middle Section: Personal Info (Left) & Right Column (Statistics + Security) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 items-start">
          {/* Left Column: Personal Information Form (3 spans) */}
          <div className="lg:col-span-3">
            <ProfileForm profile={activeProfile} />
          </div>

          {/* Right Column: Activity Statistics & Security (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Statistics Card */}
            <AccountStatistics
              statistics={statistics}
              createdAt={activeProfile?.created_at}
            />

            {/* Security Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">Security</h2>
              </div>

              <div className="space-y-3">
                {/* Password Row */}
                {!isGoogleUser ? (
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50/80 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Password</p>
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Change your access key</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Password changes managed via Google Account.
                  </div>
                )}

                {/* Delete Account Row */}
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-red-50/50 transition-all text-left text-red-600 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-red-50 text-red-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-red-600 leading-tight">Delete Account</p>
                      <p className="text-[11px] sm:text-xs text-red-400/90 mt-0.5">Permanent deletion of data</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Privacy Statement Footer Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex items-start sm:items-center gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 flex-shrink-0 mt-0.5 sm:mt-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
            DocIntel AI prioritizes your privacy. Personal Information is encrypted at rest and in transit. Your data is never utilized for large language model training without explicit opt-in consent.
          </p>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        isGoogleUser={isGoogleUser}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
