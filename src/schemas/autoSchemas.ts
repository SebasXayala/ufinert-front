// src/schemas/autoSchemas.ts
import { z } from "zod";
import { VALIDATION_MESSAGES, APP_CONFIG } from "../constants";

// Schema para crear/editar auto
export const carSchema = z.object({
  model: z.string()
    .min(1, { message: VALIDATION_MESSAGES.MODEL_REQUIRED })
    .max(APP_CONFIG.MAX_FILE_NAME_LENGTH, { message: "El modelo debe tener máximo 50 caracteres" }),

  brand: z.string()
    .min(1, { message: VALIDATION_MESSAGES.BRAND_REQUIRED })
    .max(APP_CONFIG.MAX_FILE_NAME_LENGTH, { message: "La marca debe tener máximo 50 caracteres" }),

  color: z.string()
    .min(1, { message: VALIDATION_MESSAGES.COLOR_REQUIRED })
    .max(30, { message: "El color debe tener máximo 30 caracteres" }),

  year: z.string()
    .min(APP_CONFIG.YEAR_LENGTH, { message: VALIDATION_MESSAGES.YEAR_INVALID })
    .max(APP_CONFIG.YEAR_LENGTH, { message: VALIDATION_MESSAGES.YEAR_INVALID })
    .regex(/^\d{4}$/, { message: VALIDATION_MESSAGES.YEAR_INVALID }),

  plateNumber: z.string()
    .min(APP_CONFIG.MIN_PLATE_LENGTH, { message: VALIDATION_MESSAGES.PLATE_MIN })
    .max(APP_CONFIG.MAX_PLATE_LENGTH, { message: VALIDATION_MESSAGES.PLATE_MAX })
    .regex(/^[A-Z0-9-]+$/, { message: VALIDATION_MESSAGES.PLATE_FORMAT }),

  imageUrl: z.string()
    .url({ message: VALIDATION_MESSAGES.URL_INVALID })
    .optional()
    .or(z.literal(''))
});

// Tipo inferido del schema
export type CarFormData = z.infer<typeof carSchema>;
