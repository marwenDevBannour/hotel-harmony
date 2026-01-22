import { useEffect, useState, useCallback } from 'react';
import { isProduction } from '@/lib/environment';
import { authApi, User as SpringBootUser } from '@/services/api';
import { supabaseAuthApi } from '@/services/supabase-api';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Type unifié pour l'utilisateur
export type UnifiedUser = {
  id: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
};

// Convertir les utilisateurs selon le backend
const normalizeUser = (user: SpringBootUser | SupabaseUser | null): UnifiedUser | null => {
  if (!user) return null;
  
  if ('codeUser' in user) {
    // Spring Boot user
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } else {
    // Supabase user
    return {
      id: user.id,
      email: user.email || '',
      firstName: user.user_metadata?.first_name,
      lastName: user.user_metadata?.last_name,
    };
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<UnifiedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthSpringBoot = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(normalizeUser(currentUser));
    } catch (error) {
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuthSupabase = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ? normalizeUser(session.user) : null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isProduction()) {
      // Production: Supabase Auth
      checkAuthSupabase();
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ? normalizeUser(session.user) : null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Development: Spring Boot Auth
      checkAuthSpringBoot();
    }
  }, [checkAuthSpringBoot, checkAuthSupabase]);

  const signOut = useCallback(async () => {
    if (isProduction()) {
      await supabaseAuthApi.logout();
    } else {
      authApi.logout();
    }
    setUser(null);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (isProduction()) {
      const response = await supabaseAuthApi.login(email, password);
      setUser(response.user ? normalizeUser(response.user) : null);
      return response;
    } else {
      const response = await authApi.login(email, password);
      setUser(normalizeUser(response.user));
      return response;
    }
  }, []);

  const signUp = useCallback(async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    if (isProduction()) {
      const response = await supabaseAuthApi.signup(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
      });
      setUser(response.user ? normalizeUser(response.user) : null);
      return response;
    } else {
      const response = await authApi.signup(data);
      setUser(normalizeUser(response.user));
      return response;
    }
  }, []);

  return { 
    user, 
    session: user ? { user } : null, 
    loading, 
    signOut,
    signIn,
    signUp,
    isProduction: isProduction(),
  };
};
