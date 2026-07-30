import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function GuestRoute() {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return null;
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
