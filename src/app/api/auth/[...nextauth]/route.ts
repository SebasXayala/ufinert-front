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
            console.log("❌ Credenciales faltantes");
            return null;
          }

          console.log("🔑 Intentando autenticar:", credentials.username);
          console.log("📡 URL del backend:", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`);

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

          console.log("📡 Respuesta del login:", res.status, res.statusText);

          if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ Error en login:", errorText);
            return null;
          }

          const user = await res.json();
          console.log("✅ Usuario completo del backend:", user);
          console.log("✅ Usuario recibido del backend:", {
            hasToken: !!user.token,
            hasAccessToken: !!user.access_token,
            username: user.user?.username || user.username,
            name: user.user?.name || user.name,
            fullUser: user.user || null
          });

          if (user.error) {
            console.error("Login error:", user.error);
            return null;
          }

          // El backend devuelve "token", no "access_token"
          const token = user.token || user.access_token;

          if (!token) {
            console.error("❌ No se recibió token del backend");
            return null;
          }

          // Si viene con estructura user separada
          if (user.user) {
            return {
              id: user.user.id || user.user.username || "unknown",
              name: user.user.name || user.user.username || user.user.email || "Usuario",
              email: user.user.email || `${user.user.username}@local.com` || "usuario@ejemplo.com",
              username: user.user.username || "unknown",
              token: token
            };
          }

          // Si viene directamente
          return {
            id: user.id || user.username || "unknown",
            name: user.name || user.username || user.email || "Usuario",
            email: user.email || `${user.username}@local.com` || "usuario@ejemplo.com",
            username: user.username || "unknown",
            token: token
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('🔐 JWT Callback:', { user: !!user, token: !!token.accessToken });
      if (user) {
        token.accessToken = (user as { token?: string }).token;
        token.name = user.name;
        token.username = (user as { username?: string }).username;
        token.email = user.email;
        console.log('✅ Token guardado en JWT:', {
          hasToken: !!token.accessToken,
          name: token.name,
          username: token.username
        });
      }
      return token;
    },
    async session({ session, token }) {
      console.log('👤 Session Callback:', { hasToken: !!token.accessToken });
      (session as { accessToken?: string }).accessToken = token.accessToken as string;

      // Asegurar que el nombre del usuario esté disponible
      if (token.name) {
        session.user.name = token.name as string;
      }
      if (token.username) {
        (session.user as { username?: string }).username = token.username as string;
        // Si no hay name, usar username como fallback
        if (!session.user.name || session.user.name === "Usuario") {
          session.user.name = token.username as string;
        }
      }
      if (token.email && typeof token.email === 'string') {
        session.user.email = token.email;
      }

      console.log('✅ Session configurada:', {
        hasAccessToken: !!(session as any).accessToken,
        userName: session.user.name,
        userEmail: session.user.email,
        username: (session.user as any).username
      });
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