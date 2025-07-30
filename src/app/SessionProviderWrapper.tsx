"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState, useEffect } from "react";
import { APP_CONFIG } from "../constants";

interface ProvidersProps {
  children: ReactNode;
}

export default function SessionProviderWrapper({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <SessionProvider
      refetchInterval={APP_CONFIG.SESSION_REFETCH_INTERVAL}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}