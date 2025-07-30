"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthError() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case "CredentialsSignin":
                return "Credenciales inválidas. Por favor, verifica tu usuario y contraseña.";
            case "Configuration":
                return "Error de configuración del servidor.";
            case "AccessDenied":
                return "Acceso denegado.";
            case "Verification":
                return "Error de verificación.";
            default:
                return "Ha ocurrido un error durante la autenticación.";
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Error de Autenticación
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {getErrorMessage(error)}
                    </p>
                </div>
                <div className="text-center">
                    <Link
                        href="/"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}