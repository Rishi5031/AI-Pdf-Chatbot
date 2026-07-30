import React from 'react';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-tertiary p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Profile Settings</h1>
        
        <div className="bg-white rounded-2xl border border-neutral/20 shadow-sm overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-secondary/10 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                {user.profile_picture ? (
                  <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-secondary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-primary">{user.name}</h2>
                <p className="text-neutral mt-1">{user.email}</p>
                
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  Active Account
                </div>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-neutral/20 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-neutral uppercase tracking-wider mb-2">Account Type</h3>
                <div className="flex items-center gap-2">
                  {user.provider === 'google' ? (
                    <>
                      <svg className="w-5 h-5 text-neutral" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span className="text-primary font-medium">Google Sign-In</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-primary font-medium">Email / Password</span>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-neutral uppercase tracking-wider mb-2">Member Since</h3>
                <p className="text-primary font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
