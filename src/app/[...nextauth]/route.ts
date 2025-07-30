import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "usuario123" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        console.log("Credentials received:", credentials);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user/login`,
          {
            method: "POST",
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();

        if (user.error) throw user;
        if (user.access_token && user.user) {
          return { ...user.user, token: user.access_token };
        }
        if (user.access_token) {
          return { ...user, token: user.access_token };
        }
        return user;
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
      console.log("Session callback:", session);
      return session;

    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };