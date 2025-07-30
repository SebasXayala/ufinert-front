import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ROUTES } from "../../../../constants";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "usuario123" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          console.log("Credentials received:", credentials);

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({
                username: credentials?.username,
                password: credentials?.password
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!res.ok) {
            const errorText = await res.text();
            return null;
          }

          const user = await res.json();

          if (user.error) {
            console.error("Login error:", user.error);
            return null;
          }

          if (user.access_token && user.user) {
            return { ...user.user, token: user.access_token };
          }
          if (user.access_token) {
            return { ...user, token: user.access_token };
          }

          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { token?: string }).token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as { accessToken?: string }).accessToken = token.accessToken as string;
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