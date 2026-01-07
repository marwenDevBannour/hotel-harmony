import { useEffect, useState, useCallback } from 'react';
import { authApi, User } from '@/services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // Token invalid or expired
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signOut = useCallback(async () => {
    authApi.logout();
    setUser(null);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    setUser(response.user);
    return response;
  }, []);

  const signUp = useCallback(async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const response = await authApi.signup(data);
    setUser(response.user);
    return response;
  }, []);

  return { 
    user, 
    session: user ? { user } : null, 
    loading, 
    signOut,
    signIn,
    signUp,
  };
};
