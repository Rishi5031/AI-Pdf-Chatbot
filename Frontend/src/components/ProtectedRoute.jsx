import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute() {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return null; // The global loader in App.jsx handles the loading state
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
