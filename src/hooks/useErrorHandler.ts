// Custom hook para manejar mensajes de error de forma consistente
import { useState, useCallback } from 'react';

export function useErrorHandler() {
    const [error, setError] = useState<string | null>(null);

    const handleError = useCallback((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Ha ocurrido un error inesperado';
        setError(errorMessage);
        console.error('Error:', error);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        error,
        handleError,
        clearError,
        setError
    };
}
