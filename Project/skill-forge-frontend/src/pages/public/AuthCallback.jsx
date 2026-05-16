import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Google OAuth Callback Page
 * Backend redirects to: /auth/callback?token=<jwt>
 * This page extracts the token, logs the user in, then redirects to their dashboard.
 */
const AuthCallback = () => {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        navigate('/login?error=oauth_failed');
        return;
      }

      try {
        const user = await loginWithToken(token);
        // Redirect based on role
        const dashboardRoutes = {
          student: '/student/dashboard',
          instructor: '/instructor/dashboard',
          admin: '/admin/dashboard',
        };
        navigate(dashboardRoutes[user.role] || '/');
      } catch {
        navigate('/login?error=oauth_failed');
      }
    };

    handleCallback();
  }, [loginWithToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Signing you in with Google...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
