// src/schemas/autoSchemas.ts
import { z } from "zod";

// Schema para crear/editar auto
export const carSchema = z.object({
  model: z.string()
    .min(1, { message: "El modelo es requerido" })
    .max(50, { message: "El modelo debe tener máximo 50 caracteres" }),
  
  brand: z.string()
    .min(1, { message: "La marca es requerida" })
    .max(50, { message: "La marca debe tener máximo 50 caracteres" }),
  
  color: z.string()
    .min(1, { message: "El color es requerido" })
    .max(30, { message: "El color debe tener máximo 30 caracteres" }),
  
  year: z.string()
    .min(4, { message: "El año debe tener 4 dígitos" })
    .max(4, { message: "El año debe tener 4 dígitos" })
    .regex(/^\d{4}$/, { message: "El año debe ser un número de 4 dígitos" }),
  
  plateNumber: z.string()
    .min(6, { message: "La placa debe tener al menos 6 caracteres" })
    .max(10, { message: "La placa debe tener máximo 10 caracteres" })
    .regex(/^[A-Z0-9-]+$/, { message: "La placa solo puede contener letras mayúsculas, números y guiones" }),

  imageUrl: z.string()
    .url({ message: "Debe ser una URL válida" })
    .optional()
    .or(z.literal(''))
});

// Tipo inferido del schema
export type CarFormData = z.infer<typeof carSchema>;
