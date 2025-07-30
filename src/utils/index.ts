// Utilidades para formateo y validación de datos

/**
 * Formatea el número de placa a mayúsculas
 */
export function formatPlateNumber(plate: string): string {
    return plate.toUpperCase().trim();
}

/**
 * Genera un ID único para elementos mock
 */
export function generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * Simula delay de red para operaciones mock
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Verifica si una URL de imagen es válida
 */
export function isValidImageUrl(url: string): boolean {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Obtiene el año actual como string
 */
export function getCurrentYear(): string {
    return new Date().getFullYear().toString();
}
