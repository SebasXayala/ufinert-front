import { z } from 'zod';
import { VALIDATION_MESSAGES, APP_CONFIG } from '../constants';

export const carSchema = z.object({
    model: z.string().min(1, { message: VALIDATION_MESSAGES.MODEL_REQUIRED }),
    brand: z.string().min(1, { message: VALIDATION_MESSAGES.BRAND_REQUIRED }),
    color: z.string().min(1, { message: VALIDATION_MESSAGES.COLOR_REQUIRED }),
    year: z.string()
        .length(APP_CONFIG.YEAR_LENGTH, { message: VALIDATION_MESSAGES.YEAR_INVALID })
        .regex(/^\d{4}$/, { message: VALIDATION_MESSAGES.YEAR_INVALID }),
    plateNumber: z.string()
        .regex(APP_CONFIG.PLATE_PATTERN, { message: VALIDATION_MESSAGES.PLATE_FORMAT }),
    imageUrl: z.string().url({ message: VALIDATION_MESSAGES.URL_INVALID }).optional().or(z.literal(''))
});

export type CarFormData = z.infer<typeof carSchema>;
