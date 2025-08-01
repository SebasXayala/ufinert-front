// Application Constants

export const ROUTES = {
    LOGIN: "/",
    REGISTER: "/register",
    DASHBOARD: "/seleccion",
    AUTH_ERROR: "/auth/error",
} as const;

export const VALIDATION_MESSAGES = {
    // Authentication
    USERNAME_MIN: "El nombre de usuario debe tener al menos 2 caracteres",
    PASSWORD_MIN: "La contraseña debe tener al menos 6 caracteres",
    EMAIL_INVALID: "Email inválido",
    PASSWORDS_NOT_MATCH: "Las contraseñas no coinciden",
    CONFIRM_PASSWORD: "Confirma tu contraseña",

    // Car validation
    MODEL_REQUIRED: "El modelo es requerido",
    BRAND_REQUIRED: "La marca es requerida",
    COLOR_REQUIRED: "El color es requerido",
    YEAR_INVALID: "El año debe ser un número de 4 dígitos",
    PLATE_FORMAT: "La placa debe tener formato ABC123 (3 letras + 3 números)",
    URL_INVALID: "Debe ser una URL válida",
} as const;

export const APP_CONFIG = {
    SESSION_REFETCH_INTERVAL: 5 * 60, // 5 minutes
    YEAR_LENGTH: 4,
    PLATE_PATTERN: /^[A-Z]{3}\d{3}$/i,
} as const;
