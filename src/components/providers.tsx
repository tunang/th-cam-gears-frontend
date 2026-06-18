'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthInitializer from './auth-initializer';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthInitializer />
        {children}
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
