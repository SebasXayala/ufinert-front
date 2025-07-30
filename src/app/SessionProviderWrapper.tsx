"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState, useEffect } from "react";

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
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}