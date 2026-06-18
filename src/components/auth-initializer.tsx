'use client';

import { useEffect } from 'react';
import useAuthStore from '@/src/store/auth.store';
import api from '@/src/utils/api';

/**
 * Runs once on app mount. If an accessToken exists in the persisted
 * Zustand store, it calls GET /auth/me to validate the session and
 * refresh the user profile data. The 401 interceptor in api.ts handles
 * automatic token refresh if the access token is expired.
 */
export default function AuthInitializer() {
  const { accessToken, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    const validateSession = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch {
        // The interceptor already tried refreshing.
        // If we still fail, clear everything.
        logout();
      }
    };

    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return null;
}
