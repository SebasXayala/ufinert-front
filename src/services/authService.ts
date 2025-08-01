// src/services/authService.ts
import { delay } from '../utils';

// Interfaces
export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
    };
}

export interface RegisterResponse {
    message: string;
    user: {
        id: number;
        username: string;
        email: string;
    };
}

// Configuration
interface AuthConfig {
    baseUrl: string;
    useMockData: boolean;
}

const config: AuthConfig = {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || '',
    useMockData: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
};

// Validar configuración al inicio
if (!config.useMockData && !config.baseUrl) {
    console.warn('⚠️ NEXT_PUBLIC_BACKEND_URL no está configurada. Usando mock data como fallback.');
}

// HTTP utilities
const createHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
});

const createAuthUrl = (endpoint: string): string => `${config.baseUrl}/api/auth${endpoint}`;

const parseApiResponse = async (response: Response): Promise<any> => {
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorMessage;

            // Log detallado para debugging
            console.error('Auth API Error Details:', {
                status: response.status,
                statusText: response.statusText,
                errorData,
                errorText
            });
        } catch {
            // Log el texto crudo si no se puede parsear como JSON
            console.error('Raw Auth API Error:', errorText);
        }

        throw new Error(errorMessage);
    }

    return response.json();
};

// Mock service functions
const registerUserMock = async (userData: RegisterRequest): Promise<RegisterResponse> => {
    await delay(1000);

    // Simular respuesta exitosa
    return {
        message: 'Usuario registrado exitosamente',
        user: {
            id: Math.floor(Math.random() * 1000),
            username: userData.username,
            email: userData.email,
        }
    };
};

const loginUserMock = async (loginData: LoginRequest): Promise<AuthResponse> => {
    await delay(800);

    // Simular login exitoso
    return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
            id: 1,
            username: loginData.username,
            email: 'user@example.com',
        }
    };
};

// API service functions
const registerUserApi = async (userData: RegisterRequest): Promise<RegisterResponse> => {
    if (!config.baseUrl) {
        throw new Error('Backend URL not configured');
    }

    console.log('Sending register data to API:', userData);
    console.log('API URL:', createAuthUrl('/register'));

    const response = await fetch(createAuthUrl('/register'), {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(userData),
    });

    const data = await parseApiResponse(response);
    return data;
};

const loginUserApi = async (loginData: LoginRequest): Promise<AuthResponse> => {
    if (!config.baseUrl) {
        throw new Error('Backend URL not configured');
    }

    console.log('Sending login data to API:', loginData);
    console.log('API URL:', createAuthUrl('/login'));

    const response = await fetch(createAuthUrl('/login'), {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(loginData),
    });

    const data = await parseApiResponse(response);
    return data;
};

// Public API functions
export const registerUser = async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
        return config.useMockData ? await registerUserMock(userData) : await registerUserApi(userData);
    } catch (error) {
        if (error instanceof Error && error.message.includes('Failed to fetch')) {
            console.warn('Auth API not available, falling back to mock data');
            return registerUserMock(userData);
        }
        throw error;
    }
};

export const loginUser = async (loginData: LoginRequest): Promise<AuthResponse> => {
    try {
        return config.useMockData ? await loginUserMock(loginData) : await loginUserApi(loginData);
    } catch (error) {
        if (error instanceof Error && error.message.includes('Failed to fetch')) {
            console.warn('Auth API not available, falling back to mock data');
            return loginUserMock(loginData);
        }
        throw error;
    }
};
