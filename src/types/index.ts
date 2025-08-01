// Tipos centralizados de la aplicación

// Auth types
export interface LoginForm {
    username: string;
    password: string;
}

export interface RegisterForm {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Auth service types (re-exportados desde services)
export type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    RegisterResponse
} from '../services/authService';

// Car types (re-exportados desde services para mejor organización)
export type { Car, CarCreateRequest } from '../services/autoService';
export type { CarFormData } from '../schemas/autoSchemas';
