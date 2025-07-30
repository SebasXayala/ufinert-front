// Constantes globales de la aplicación

export const ROUTES = {
    LOGIN: "/",
    REGISTER: "/register",
    DASHBOARD: "/seleccion",
    AUTH_ERROR: "/auth/error",
} as const;

export const VALIDATION_MESSAGES = {
    USERNAME_MIN: "El nombre de usuario debe tener al menos 2 caracteres",
    PASSWORD_MIN: "La contraseña debe tener al menos 6 caracteres",
    EMAIL_INVALID: "Email inválido",
    PASSWORDS_NOT_MATCH: "Las contraseñas no coinciden",
    CONFIRM_PASSWORD: "Confirma tu contraseña",

    // Car validation messages
    MODEL_REQUIRED: "El modelo es requerido",
    BRAND_REQUIRED: "La marca es requerida",
    COLOR_REQUIRED: "El color es requerido",
    YEAR_INVALID: "El año debe ser un número de 4 dígitos",
    PLATE_MIN: "La placa debe tener al menos 6 caracteres",
    PLATE_MAX: "La placa debe tener máximo 10 caracteres",
    PLATE_FORMAT: "La placa solo puede contener letras mayúsculas, números y guiones",
    URL_INVALID: "Debe ser una URL válida",
} as const;

export const APP_CONFIG = {
    SESSION_REFETCH_INTERVAL: 5 * 60, // 5 minutes
    MAX_FILE_NAME_LENGTH: 50,
    MAX_PLATE_LENGTH: 10,
    MIN_PLATE_LENGTH: 6,
    YEAR_LENGTH: 4,
} as const;
