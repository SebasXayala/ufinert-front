import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            username?: string;
        }
    }

    interface User {
        token?: string;
        username?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        username?: string;
    }
}
