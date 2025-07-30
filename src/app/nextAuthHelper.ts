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

    if (result?.error) {
      return { 
        error: result.error, 
        status: 401 
      };
    }

    if (result?.ok) {
      return { status: 200 };
    }

    return { 
      error: 'Error de autenticación', 
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
