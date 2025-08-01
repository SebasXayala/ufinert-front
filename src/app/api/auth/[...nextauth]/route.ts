import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ROUTES } from "../../../../constants";

// Utility function to decode JWT payload
const decodeJWTPayload = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "usuario123" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password
              }),
            }
          );

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (!data.token) {
            return null;
          }

          // Extract username from JWT token
          const payload = decodeJWTPayload(data.token);
          const username = payload?.sub || "usuario";

          return {
            id: username,
            name: username,
            email: `${username}@local.com`,
            username: username,
            token: data.token
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token;
        token.name = user.name;
        token.username = (user as any).username;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;

      if (token.username) {
        session.user.name = token.username as string;
        (session.user as any).username = token.username;
      }

      if (token.email) {
        session.user.email = token.email as string;
      }

      return session;
    },
  },
  pages: {
    signIn: ROUTES.LOGIN,
    error: ROUTES.AUTH_ERROR,
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };