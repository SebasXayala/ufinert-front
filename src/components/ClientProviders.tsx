"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

interface ClientProvidersProps {
    children: ReactNode;
}

function ClientProviders({ children }: ClientProvidersProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Durante el SSR y antes de montar en el cliente, renderizar sin SessionProvider
    if (!hasMounted) {
        return <div suppressHydrationWarning>{children}</div>;
    }

    // Solo después de montar en el cliente, usar SessionProvider
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}

export default ClientProviders;
