import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function GoogleLoginButton() {
  const { googleLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential); // This is the id_token
      navigate('/dashboard');
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  const handleError = () => {
    console.log('Google Sign-In Failed');
  };

  return (
    <div className="w-full flex justify-center mt-6">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        shape="rectangular"
        size="large"
        width="100%"
        text="continue_with"
      />
    </div>
  );
}
