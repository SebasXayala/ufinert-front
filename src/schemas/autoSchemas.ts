import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../constants';

// Schema para validación de formulario de auto
export const carSchema = z.object({
    model: z.string().min(1, { message: VALIDATION_MESSAGES.MODEL_REQUIRED }),
    brand: z.string().min(1, { message: VALIDATION_MESSAGES.BRAND_REQUIRED }),
    color: z.string().min(1, { message: VALIDATION_MESSAGES.COLOR_REQUIRED }),
    year: z.string()
        .length(4, { message: VALIDATION_MESSAGES.YEAR_INVALID })
        .regex(/^\d{4}$/, { message: VALIDATION_MESSAGES.YEAR_INVALID }),
    plateNumber: z.string()
        .min(3, { message: "La placa debe tener al menos 3 caracteres" })
        .max(15, { message: "La placa debe tener máximo 15 caracteres" })
        .regex(/^[A-Z0-9\-]+$/i, { message: "La placa solo puede contener letras, números y guiones" }),
    imageUrl: z.string().url({ message: VALIDATION_MESSAGES.URL_INVALID }).optional().or(z.literal(''))
});

export type CarFormData = z.infer<typeof carSchema>;
