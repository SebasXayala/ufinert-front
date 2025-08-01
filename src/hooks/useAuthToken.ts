"use client";
import { useSession } from "next-auth/react";

export const useAuthToken = () => {
    const { data: session } = useSession();

    const getToken = (): string | undefined => {
        return (session as any)?.accessToken;
    };

    return {
        token: getToken(),
        isAuthenticated: !!session,
        session
    };
};
