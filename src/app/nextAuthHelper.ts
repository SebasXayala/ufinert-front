import { signIn, SignInResponse } from "next-auth/react";

interface LoginResponse {
  error?: string;
  status: number;
}

export async function loginWithNextAuth(username: string, password: string): Promise<LoginResponse> {
  try {
    const result: SignInResponse | undefined = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    console.log("SignIn result:", result);

    if (result?.error) {
      console.error("SignIn error:", result.error);
      return {
        error: result.error === "CredentialsSignin" ? "Credenciales inválidas" : result.error,
        status: 401
      };
    }

    if (result?.ok) {
      return { status: 200 };
    }

    return {
      error: 'Error de autenticación desconocido',
      status: 500
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      error: 'Error de conexión',
      status: 500
    };
  }
}
